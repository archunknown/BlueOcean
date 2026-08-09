import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize the Mercado Pago client
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    options: { timeout: 5000, idempotencyKey: undefined }
});

/**
 * Creates a Mercado Pago payment preference.
 * 
 * @param title Product or service title
 * @param quantity Quantity of items
 * @param unitPrice Price per item
 * @returns The `init_point` URL for the checkout page, or null if it fails.
 */
export async function createPaymentPreference(title: string, quantity: number, unitPrice: number, senderPhone: string): Promise<string | null> {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
        console.error('[MERCADOPAGO] Token no configurado.');
        return null;
    }

    try {
        const rawUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const isLocal = !rawUrl || rawUrl.includes('localhost') || rawUrl.startsWith('http://');
        const baseUrl = isLocal ? 'https://blueoceanparacastours.com' : rawUrl;
        
        // Nota: En desarrollo local debe usarse la URL activa de ngrok si se define en .env o hardcodeada para pruebas:
        const webhookBaseUrl = process.env.NGROK_URL || (isLocal ? 'https://washboard-semisweet-outer.ngrok-free.dev' : rawUrl);
        
        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: 'tour_reserva',
                    title: title,
                    quantity: Number(quantity),
                    unit_price: Number(unitPrice),
                    currency_id: 'PEN'
                }
            ],
            back_urls: {
                success: `${baseUrl}/reserva/exito`,
                failure: `${baseUrl}/reserva/fallo`,
                pending: `${baseUrl}/reserva/pendiente`
            },
            auto_return: 'approved',
            external_reference: senderPhone,
            notification_url: `${webhookBaseUrl}/api/payments/webhook`,
            payment_methods: {
                excluded_payment_types: [],
                installments: 1
            }
        };

        console.log('[MERCADOPAGO DEBUG] BASE_URL detectada:', baseUrl);
        console.log('[MERCADOPAGO DEBUG] Payload final:', JSON.stringify(body, null, 2));

        const response = await preference.create({ body: body as any });

        if (response.init_point) {
            console.log(`[MERCADOPAGO] Preferencia creada exitosamente: ${response.id}`);
            return response.init_point;
        } else {
            console.error('[MERCADOPAGO] La respuesta no contiene init_point.');
            return null;
        }
    } catch (error) {
        console.error('[MERCADOPAGO] Error al crear preferencia de pago:', error);
        return null;
    }
}
