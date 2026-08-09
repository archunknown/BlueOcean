import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generator';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { sendWhatsAppMessage } from '@/lib/whatsapp/send';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message && message.type === 'text') {
      // Obtener el número telefónico original
      let senderPhoneNumber = message.from;

      // Si no existe 'from' o es un ID provisional (prefijo PE.) o similar, fallback al número autorizado
      if (!senderPhoneNumber || senderPhoneNumber.startsWith('PE.')) {
        senderPhoneNumber = process.env.WHATSAPP_TEST_RECIPIENT || '51907062681';
      }

      // Filtrar únicamente dígitos
      senderPhoneNumber = senderPhoneNumber.replace(/\D/g, '');

      const incomingText = message.text.body;

      console.log(`Mensaje procesado para responder a ${senderPhoneNumber}: "${incomingText}"`);

      // Generar respuesta con IA
      const aiResponse = await generateAIResponse(incomingText, senderPhoneNumber);

      // Si la respuesta es vacía, la sesión está en modo operador humano
      if (!aiResponse || aiResponse.trim() === '') {
        console.log(`[WEBHOOK] Sesión ${senderPhoneNumber} en modo humano. Persistiendo mensaje entrante.`);

        // Persistir el mensaje del usuario para que sea visible en el panel de conversaciones
        try {
          const supabase = getSupabase();
          const { data: conv } = await supabase
            .from('conversations')
            .select('id')
            .eq('phone_number', senderPhoneNumber)
            .maybeSingle();

          if (conv?.id) {
            await supabase.from('intent_logs').insert({
              conversation_id: conv.id,
              input_text: incomingText,
              matched_intent: 'human_mode_incoming',
              similarity_score: null,
              handled_by: 'human_takeover',
              response_text: '',
              latency_ms: 0,
            });
          }
        } catch (persistErr) {
          console.error('[WEBHOOK] Error persistiendo mensaje en modo humano:', persistErr);
        }

        return NextResponse.json({ status: 'ignored_due_to_human_mode' }, { status: 200 });
      }

      await sendWhatsAppMessage(senderPhoneNumber, aiResponse);
    }
  } catch (error) {
    console.error('Error al procesar payload de WhatsApp:', error);
  }

  // Retornar siempre 200 OK para evitar que Meta reintente el envío
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
