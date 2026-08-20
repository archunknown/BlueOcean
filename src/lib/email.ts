
import { Resend } from 'resend';
import BookingConfirmationEmail from '@/components/emails/BookingConfirmationEmail';
import { render } from '@react-email/components'; // Can potentially use renderAsync? 
// Actually latest resend SDK usually takes react component directly, but render is safer for custom logic if needed.
// However, resend.emails.send supports 'react' property directly.
import { createClient } from '@/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(
    booking: any,
    tour: any,
    client: any,
    voucherLink: string
) {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing');
        return;
    }

    const clientName = client.first_name || 'Viajero';
    const tourTitle = tour.title;
    // Format date and time if needed, or assume they are strings
    const date = new Date(booking.tour_date).toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Total Price formatting
    const totalPrice = typeof booking.total_price === 'number'
        ? `S/ ${booking.total_price.toFixed(2)}`
        : booking.total_price;

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'reservas@blueoceanparacastours.com';
    const ownerEmail = process.env.OWNER_EMAIL || 'reservas@blueoceanparacastours.com';

    let whatsappPrimary = '';
    try {
        const supabase = await createClient();
        const { data: settings } = await supabase.from('settings').select('whatsapp_primary').single();
        if (settings?.whatsapp_primary) {
            whatsappPrimary = settings.whatsapp_primary;
        }
    } catch (e) {
        console.error('Error fetching settings for email:', e);
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `Blue Ocean <${fromEmail}>`,
            to: [client.email],
            bcc: [ownerEmail],
            replyTo: ownerEmail,
            subject: `Confirmación de Reserva: ${tourTitle}`,
            react: BookingConfirmationEmail({
                clientName,
                tourTitle,
                date,
                time: booking.tour_time,
                pax: booking.pax,
                totalPrice,
                voucherLink,
                whatsappPrimary
            }),
        });

        if (error) {
            console.error('Error sending email:', error);
            throw error;
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to send email:', error);
        // We don't throw here to avoid failing the webhook logic if email fails
        return { success: false, error };
    }
}

export async function sendHumanTakeoverAlert(phoneNumber: string) {
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is missing, skipping takeover alert email.');
        return;
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'reservas@blueoceanparacastours.com';

    // Obtener el email de contacto de settings (destino de la alerta)
    let alertEmail = process.env.OWNER_EMAIL || 'reservas@blueoceanparacastours.com';
    try {
        const supabase = await createClient();
        const { data: settings } = await supabase.from('settings').select('contact_email').single();
        if (settings?.contact_email) alertEmail = settings.contact_email;
    } catch (e) {
        console.error('Error fetching settings for takeover alert:', e);
    }

    const now = new Date().toLocaleString('es-PE', {
        timeZone: 'America/Lima',
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    try {
        await resend.emails.send({
            from: `Blue Ocean Bot <${fromEmail}>`,
            to: [alertEmail],
            subject: `🚨 Cliente en WhatsApp solicita operador humano`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
                    <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                        <h1 style="color: white; margin: 0; font-size: 20px;">🤖 Blue Ocean — Alerta del Bot</h1>
                    </div>
                    <p style="color: #374151; font-size: 16px;">Un cliente ha sido derivado a <strong>atención humana</strong> y requiere que un operador responda manualmente.</p>
                    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 0; color: #92400e;"><strong>📱 Número de WhatsApp:</strong> +${phoneNumber}</p>
                        <p style="margin: 8px 0 0; color: #92400e;"><strong>🕐 Hora de derivación:</strong> ${now}</p>
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">Ingresa al panel de administración en la sección <strong>Conversaciones</strong> para atender al cliente.</p>
                    <a href="${appUrl}/admin/conversations"
                       style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
                        Ir al Panel de Conversaciones →
                    </a>
                </div>
            `,
        });
        console.log(`[EMAIL] Alerta de atención humana enviada para el número: ${phoneNumber}`);
    } catch (error) {
        console.error('Failed to send human takeover alert email:', error);
    }
}
