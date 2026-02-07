import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// 1. Configuración del Cliente
// Usamos el token de prueba o string vacío para evitar crash, pero validamos después.
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

// 2. Constantes
const MP_COMMISSION_RATE = 0.045;
const MP_FIXED_FEE = 1.50;

// 3. Fallback de URL a la fuerza
// Si process.env falla, usa localhost.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const createPreference = async (booking: any, tourTitle: string) => {
    if (!process.env.MP_ACCESS_TOKEN) {
        throw new Error("MP_ACCESS_TOKEN no está definido en .env");
    }

    console.log("💰 [MERCADO PAGO] Iniciando preferencia...");
    console.log("🔗 [MERCADO PAGO] URL Base:", BASE_URL);

    // Determinar auto_return basado en HTTPS
    const autoReturnStatus = BASE_URL.startsWith('https') ? 'approved' : undefined;
    console.log("🔄 [MERCADO PAGO] Auto Return:", autoReturnStatus || "Desactivado (HTTP)");

    // Cálculos
    const basePrice = Number(booking.total_price);
    const finalPrice = (basePrice + MP_FIXED_FEE) / (1 - MP_COMMISSION_RATE);
    const unitPrice = Number(finalPrice.toFixed(2));

    const preference = new Preference(client);

    // CREACIÓN SIMPLIFICADA (Payload Limpio)
    const result = await preference.create({
        body: {
            items: [
                {
                    id: booking.tour_id,
                    title: tourTitle,
                    quantity: 1,
                    unit_price: unitPrice,
                    currency_id: 'PEN',
                },
            ],
            payer: {
                email: booking.client_email, // Único dato obligatorio para pre-llenar
            },
            back_urls: {
                success: `${BASE_URL}/checkout/thank-you?booking_id=${booking.id}`,
                failure: `${BASE_URL}/tours?error=payment_failed`,
                pending: `${BASE_URL}/tours?status=pending`,
            },
            auto_return: autoReturnStatus,
            external_reference: booking.id,
            notification_url: `${BASE_URL}/api/webhooks/mercadopago`,
            statement_descriptor: "BLUE OCEAN TOURS",

            // RESTRICCIONES DE PAGO (Solo Tarjeta / Yape - Contado)
            payment_methods: {
                excluded_payment_types: [
                    { id: "ticket" },        // Bloquea PagoEfectivo (Cineplanet, Agentes, etc)
                    { id: "atm" },           // Bloquea Cajeros
                    { id: "bank_transfer" }  // Bloquea transferencias diferidas
                ],
                installments: 1 // Solo una cuota (Contado)
            }
        },
    });

    console.log("✅ [MERCADO PAGO] Preferencia creada:", result.id);
    return result;
};

export const getPaymentStatus = async (paymentId: string) => {
    const payment = new Payment(client);
    return await payment.get({ id: paymentId });
}