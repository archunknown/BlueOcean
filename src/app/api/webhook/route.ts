import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generator';

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

      await sendWhatsAppMessage(senderPhoneNumber, aiResponse);
    }
  } catch (error) {
    console.error('Error al procesar payload de WhatsApp:', error);
  }

  // Retornar siempre 200 OK para evitar que Meta reintente el envío
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

async function sendWhatsAppMessage(to: string, messageText: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error en llamada a Graph API:', JSON.stringify(errorData, null, 2));
  }
}