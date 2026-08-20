export async function sendWhatsAppMessage(to: string, messageText: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error('[WHATSAPP] Error: Variables de entorno de WhatsApp no configuradas.');
    return;
  }

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
    console.error('[WHATSAPP] Error en llamada a Graph API:', JSON.stringify(errorData, null, 2));
  }
}
