import { NextResponse } from "next/server";
import { getPaymentStatus } from "@/lib/mercadopago";
import { createClient } from "@/utils/supabase/server";
import { sendBookingConfirmation } from "@/lib/email";
import { sendWhatsAppText } from "@/lib/whatsapp";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        // 1. Parsear el Body (Mercado Pago envía JSON en el POST)
        let body: any = {};
        try {
            body = await request.json();
        } catch (e) {
            console.warn("Webhook sin body JSON o inválido");
        }

        // 2. Extraer parámetros (Soportar diferentes formatos de notificación: Query Params o Body)
        // Query Params (IPN Style): ?id=...&topic=...
        // Body (Webhook Style): { type: "payment", data: { id: "..." } }

        const topic = searchParams.get("topic") || searchParams.get("type") || body.type || body.topic;
        const id = searchParams.get("id") || searchParams.get("data.id") || body.data?.id || body.id;

        // Debug
        // console.log("🔔 [WEBHOOK] Recibido:", { topic, id });

        // 3. Condición filtro: Solo proceder si es un pago y existe un ID
        if ((topic === 'payment' || topic === 'merchant_order') && id) {
            // 4. Verificación de Seguridad: Consultar estado real a Mercado Pago
            // NUNCA confiar solo en los datos del webhook.
            const payment = await getPaymentStatus(id);

            if (payment.status === 'approved') {
                const externalReference = payment.external_reference;

                if (externalReference) {
                    const supabase = await createClient();

                    // 5. Idempotencia: Actualizar Base de Datos (Si ya está confirmed, no pasa nada)
                    const { error } = await supabase
                        .from('bookings')
                        .update({
                            status: 'confirmed',
                            payment_status: 'approved',
                            payment_id: id,
                            payment_provider: 'mercadopago'
                        })
                        .eq('id', externalReference);

                    if (error) {
                        console.error('❌ [WEBHOOK] Error actualizando booking:', error);
                    } else {
                        console.log(`✅ [WEBHOOK] Booking ${externalReference} confirmado.`);

                        // --- SEND EMAIL & WHATSAPP CONFIRMATION ---
                        try {
                            // Fetch full booking details with relations
                            const { data: fullBooking, error: fetchError } = await supabase
                                .from('bookings')
                                .select('*, clients(*), tours(*)')
                                .eq('id', externalReference)
                                .single();

                            if (fetchError || !fullBooking) {
                                console.error('Error fetching details for confirmation:', fetchError);
                            } else {
                                const voucherLink = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/thank-you?bookingId=${externalReference}`;

                                // Send email
                                try {
                                    await sendBookingConfirmation(
                                        fullBooking,
                                        fullBooking.tours,
                                        fullBooking.clients,
                                        voucherLink
                                    );
                                } catch (emailError) {
                                    console.error('⚠️ [WEBHOOK] Email failed:', emailError);
                                }

                                // Send WhatsApp message
                                try {
                                    const clientPhone = fullBooking.client_phone;
                                    if (clientPhone) {
                                        const whatsappMsg = `¡Hola ${fullBooking.client_first_name || 'Viajero'}! 🌊\n\nTu pago para el tour *${fullBooking.tour_title}* ha sido confirmado con éxito.\n\n*Código de Reserva:* ${fullBooking.booking_code}\n*Fecha:* ${fullBooking.tour_date}\n*Turno:* ${fullBooking.tour_time}\n*Pasajeros:* ${fullBooking.pax}\n\nPuedes ver tu voucher digital y código QR aquí: ${voucherLink}\n\n¡Gracias por elegir Blue Ocean Paracas Tours!`;
                                        await sendWhatsAppText(clientPhone, whatsappMsg);
                                        console.log(`✅ [WEBHOOK] WhatsApp enviado a ${clientPhone}.`);
                                    }
                                } catch (wsError) {
                                    console.error('⚠️ [WEBHOOK] WhatsApp failed:', wsError);
                                }
                            }
                        } catch (confirmError) {
                            console.error('⚠️ [WEBHOOK] Confirmation triggers failed:', confirmError);
                        }
                    }
                }
            }
        }

        // 6. Respuesta Rápida (Siempre 200 OK)
        // Mercado Pago requiere una respuesta 200/201 para dejar de reintentar.
        return NextResponse.json({ status: 'ok' }, { status: 200 });

    } catch (error) {
        console.error("❌ [WEBHOOK] Error interno:", error);
        // Retornar siempre 200 para evitar bucles de reintento de Mercado Pago
        return NextResponse.json({ status: 'ok' }, { status: 200 });
    }
}
