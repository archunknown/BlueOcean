export interface WhatsAppTemplateComponent {
    type: 'header' | 'body' | 'button';
    parameters: Array<{
        type: 'text' | 'image' | 'document' | 'video' | 'currency' | 'date_time';
        text?: string;
        image?: { link: string };
        document?: { link: string; filename?: string };
        video?: { link: string };
    }>;
}

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const GRAPH_API_VERSION = 'v20.0';

/**
 * Sends a raw payload to the Meta WhatsApp Cloud API.
 */
export async function sendWhatsAppPayload(to: string, payload: Record<string, any>): Promise<any> {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.error('❌ [WHATSAPP] Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID');
        return { success: false, error: 'Missing environment configuration' };
    }

    // Clean phone number (remove +, spaces, and prefix if necessary; Meta expects string of numbers)
    const cleanTo = to.replace(/\D/g, '');

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: cleanTo,
                ...payload,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ [WHATSAPP] Meta API Error:', JSON.stringify(data));
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error('❌ [WHATSAPP] Network/Fetch Error:', error);
        return { success: false, error };
    }
}

/**
 * Sends a plain text message.
 */
export async function sendWhatsAppText(to: string, text: string): Promise<any> {
    return sendWhatsAppPayload(to, {
        type: 'text',
        text: {
            preview_url: false,
            body: text,
        },
    });
}

/**
 * Sends a Meta WhatsApp Template message (useful for business-initiated conversations).
 */
export async function sendWhatsAppTemplate(
    to: string,
    templateName: string,
    languageCode: string = 'es',
    components: WhatsAppTemplateComponent[] = []
): Promise<any> {
    return sendWhatsAppPayload(to, {
        type: 'template',
        template: {
            name: templateName,
            language: {
                code: languageCode,
            },
            components,
        },
    });
}

/**
 * Sends an interactive message (e.g. list, buttons).
 */
export async function sendWhatsAppInteractive(to: string, interactiveBody: Record<string, any>): Promise<any> {
    return sendWhatsAppPayload(to, {
        type: 'interactive',
        interactive: interactiveBody,
    });
}
