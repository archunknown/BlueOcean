import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendWhatsAppText } from '@/lib/whatsapp';
import { matchFAQ } from '@/services/faq-service';
import { getLLMResponse } from '@/services/llm-service';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ [WHATSAPP_WEBHOOK] Webhook verificado con éxito.');
        return new Response(challenge, { status: 200 });
    }

    console.warn('❌ [WHATSAPP_WEBHOOK] Token de verificación inválido o ausente.');
    return new Response('Forbidden', { status: 403 });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Evitar bucle infinito si Meta reenvía notificaciones de status u otros objetos
        if (body.object !== 'whatsapp_business_account') {
            return NextResponse.json({ status: 'ignored' }, { status: 200 });
        }

        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        // Si no es un evento de mensaje entrante, ignorar (status notifications, read receipt, etc)
        if (!messages || messages.length === 0) {
            return NextResponse.json({ status: 'ok' }, { status: 200 });
        }

        const message = messages[0];
        const phone = message.from;

        // Extraer texto según el tipo de mensaje
        let text = '';
        if (message.type === 'text') {
            text = message.text?.body || '';
        } else if (message.type === 'interactive') {
            const interactive = message.interactive;
            if (interactive?.type === 'button_reply') {
                text = interactive.button_reply?.title || interactive.button_reply?.id || '';
            } else if (interactive?.type === 'list_reply') {
                text = interactive.list_reply?.title || interactive.list_reply?.id || '';
            }
        }

        // Si no hay texto o teléfono legible, ignorar
        if (!phone || !text.trim()) {
            return NextResponse.json({ status: 'ok' }, { status: 200 });
        }

        const supabase = await createClient();

        // 1. Obtener o crear conversación (Conversations)
        let conversationId: string;
        let estado: 'bot' | 'atencion_humana' = 'bot';

        const { data: existingConv, error: convError } = await supabase
            .from('conversations')
            .select('id, estado')
            .eq('phone_number', phone)
            .maybeSingle();

        if (convError) {
            console.error('Error fetching conversation:', convError);
        }

        if (existingConv) {
            conversationId = existingConv.id;
            estado = existingConv.estado;
        } else {
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                    phone_number: phone,
                    estado: 'bot',
                })
                .select('id, estado')
                .single();

            if (createError || !newConv) {
                console.error('Error creating conversation:', createError);
                return NextResponse.json({ error: 'Failed to manage conversation' }, { status: 500 });
            }
            conversationId = newConv.id;
            estado = newConv.estado;
        }

        // 2. Si el estado es 'atencion_humana', omitir procesamiento automático del bot
        if (estado === 'atencion_humana') {
            console.log(`[WHATSAPP_BOT] Conversación ${phone} está en atención humana. Mensaje ignorado de forma automática.`);
            return NextResponse.json({ status: 'human_handled' }, { status: 200 });
        }

        // 3. Ejecutar Capa 1: Búsqueda Vectorial Semántica (Supabase pgvector)
        const faqMatches = await matchFAQ(text, 0.80, 1);
        let replyText = '';
        let handledBy: 'pgvector' | 'llm' = 'pgvector';
        let matchedIntent = null;
        let score = null;

        if (faqMatches && faqMatches.length > 0) {
            const bestMatch = faqMatches[0];
            replyText = bestMatch.respuesta;
            matchedIntent = bestMatch.pregunta;
            score = bestMatch.similarity;
            handledBy = 'pgvector';
            console.log(`[WHATSAPP_BOT] Capa 1 (pgvector) resolvió el mensaje. Similitud: ${score}`);
        } else {
            // 4. Ejecutar Capa 2: LLM Fallback (Gemini Flash RAG)
            console.log(`[WHATSAPP_BOT] Similitud baja. Escalando a Capa 2 (LLM)...`);
            replyText = await getLLMResponse(text, conversationId, phone);
            handledBy = 'llm';
            matchedIntent = 'llm_fallback';
            score = 0.0;
        }

        // 5. Registrar Log del Intento en la Base de Datos para las métricas de tesis
        const { error: logError } = await supabase
            .from('intent_logs')
            .insert({
                conversation_id: conversationId,
                input_text: text,
                matched_intent: matchedIntent,
                similarity_score: score,
                handled_by: handledBy,
            });

        if (logError) {
            console.error('Error writing intent log:', logError);
        }

        // 6. Enviar la respuesta vía WhatsApp
        await sendWhatsAppText(phone, replyText);

        return NextResponse.json({ status: 'ok' }, { status: 200 });
    } catch (err) {
        console.error('❌ [WHATSAPP_WEBHOOK] Error interno:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
