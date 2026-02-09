
import { Resend } from 'resend';
import BookingConfirmationEmail from '@/components/emails/BookingConfirmationEmail';
import { render } from '@react-email/components'; // Can potentially use renderAsync? 
// Actually latest resend SDK usually takes react component directly, but render is safer for custom logic if needed.
// However, resend.emails.send supports 'react' property directly.

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
                voucherLink
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
