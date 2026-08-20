import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { sendWhatsAppMessage } from '@/lib/whatsapp/send';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const body = await req.json().catch(() => ({}));
    console.log('[WEBHOOK IPN DEBUG] Query Params:', queryParams);
    console.log('[WEBHOOK IPN DEBUG] Body:', JSON.stringify(body, null, 2));

    const paymentId = body?.data?.id || body?.id || queryParams.id;
    const type = body?.type || body?.action || queryParams.type || queryParams.topic;

    const validEventTypes = ['payment', 'payment.created', 'action.payment.created'];

    if (!paymentId || !validEventTypes.includes(type)) {
      console.log(`[IPN DEBUG] Ignorando evento no válido o sin ID. Type: ${type}, ID: ${paymentId}`);
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    console.log(`[IPN DEBUG] Procesando pago ID: ${paymentId}`);
    const payment = new Payment(client);
    let paymentData;

    try {
      paymentData = await payment.get({ id: String(paymentId) });
    } catch (e) {
      console.log(`[IPN DEBUG] ID de pago no encontrado o de prueba: ${paymentId}`);
      return NextResponse.json({ status: 'ok' }, { status: 200 });
    }

    if (paymentData && paymentData.status === 'approved') {
      console.log(`[IPN DEBUG] Pago ${paymentId} aprobado. Buscando external_reference...`);
      const senderPhone = paymentData.external_reference;

        if (senderPhone) {
          console.log(`[IPN DEBUG] Referencia encontrada: ${senderPhone}. Actualizando Supabase y notificando vía WhatsApp.`);
          const supabase = getSupabase();
          
          // Buscar si existe la conversación para asociar el log
          const { data: conv } = await supabase
            .from('conversations')
            .select('id')
            .eq('phone_number', senderPhone)
            .maybeSingle();

          const conversationId = conv ? conv.id : null;

          // Registrar en intent_logs el pago aprobado
          if (conversationId) {
            await supabase.from('intent_logs').insert({
              conversation_id: conversationId,
              handled_by: 'human_takeover', // o un handler dedicado a pagos si se prefiere
              input_text: '[Notificación IPN Mercado Pago]',
              response_text: 'Pago Aprobado por Mercado Pago',
              latency_ms: 0,
            });
          }

          // Despachar el mensaje por WhatsApp
          const message = "¡Pago confirmado! Hemos recibido tu pago para la reserva de tu tour. Muchas gracias por tu preferencia.";
          await sendWhatsAppMessage(senderPhone, message);
        }
      }

    // SIEMPRE responder HTTP 200 OK
    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (error) {
    console.error('[WEBHOOK IPN MERCADO PAGO] Error:', error);
    // Para evitar reintentos masivos que bloqueen el servidor, retornamos 200 incluso si fallamos localmente
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }
}
