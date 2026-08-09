import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient<Database>(url, key);
}

/**
 * GET: Obtener listado de conversaciones con su último log.
 */
export async function GET() {
    try {
        const supabase = getSupabase();

        const { data: conversations, error } = await supabase
            .from('conversations')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('[CONVERSATIONS_API] Error fetching conversations:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Para cada conversación, obtener los últimos logs
        const enriched = await Promise.all(
            (conversations || []).map(async (conv) => {
                const { data: logs } = await supabase
                    .from('intent_logs')
                    .select('id, input_text, response_text, handled_by, matched_intent, created_at')
                    .eq('conversation_id', conv.id)
                    .order('created_at', { ascending: false })
                    .limit(50);

                return { ...conv, messages: logs || [] };
            })
        );

        return NextResponse.json({ conversations: enriched });
    } catch (err) {
        console.error('[CONVERSATIONS_API] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH: Actualizar estado de una conversación (toggle bot/atencion_humana).
 */
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, estado } = body;

        if (!conversationId || !estado) {
            return NextResponse.json({ error: 'conversationId y estado requeridos' }, { status: 400 });
        }

        if (estado !== 'bot' && estado !== 'atencion_humana') {
            return NextResponse.json({ error: 'estado debe ser "bot" o "atencion_humana"' }, { status: 400 });
        }

        const supabase = getSupabase();

        const { error } = await supabase
            .from('conversations')
            .update({ estado })
            .eq('id', conversationId);

        if (error) {
            console.error('[CONVERSATIONS_API] Error updating conversation:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: 'updated', conversationId, estado });
    } catch (err) {
        console.error('[CONVERSATIONS_API] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST: Enviar mensaje manual del operador a WhatsApp.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { conversationId, phoneNumber, messageText } = body;

        if (!phoneNumber || !messageText) {
            return NextResponse.json({ error: 'phoneNumber y messageText requeridos' }, { status: 400 });
        }

        // Enviar mensaje por WhatsApp Graph API
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

        if (!phoneNumberId || !accessToken) {
            return NextResponse.json({ error: 'Configuración de WhatsApp incompleta' }, { status: 500 });
        }

        const waResponse = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: phoneNumber,
                type: 'text',
                text: { preview_url: false, body: messageText },
            }),
        });

        if (!waResponse.ok) {
            const errData = await waResponse.json().catch(() => ({}));
            console.error('[CONVERSATIONS_API] Error enviando mensaje a WhatsApp:', errData);
            return NextResponse.json({ error: 'Error enviando mensaje a WhatsApp', details: errData }, { status: 502 });
        }

        // Registrar el mensaje del operador en intent_logs
        if (conversationId) {
            const supabase = getSupabase();
            await supabase.from('intent_logs').insert({
                conversation_id: conversationId,
                input_text: '',
                matched_intent: 'human_reply',
                similarity_score: null,
                handled_by: 'human_takeover',
                response_text: messageText,
                latency_ms: 0,
            });
        }

        return NextResponse.json({ status: 'sent' });
    } catch (err) {
        console.error('[CONVERSATIONS_API] Unhandled error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
