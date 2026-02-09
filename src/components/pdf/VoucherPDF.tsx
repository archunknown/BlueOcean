
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Database } from '@/types/database';

// Tipado para las props
type Booking = Database['public']['Tables']['bookings']['Row'];

interface VoucherPDFProps {
    booking: Booking;
    qrCodeUrl?: string;
}

// Estilos (similares a CSS pero objetos JS)
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica', // Fuente estándar segura
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#1E3A5F', // Ocean Blue
        paddingBottom: 10,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E3A5F',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        width: 120,
        fontSize: 10,
        color: '#666',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 11,
        color: '#333',
    },
    bookingCodeContainer: {
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    bookingCodeLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    bookingCode: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A5F',
        fontFamily: 'Courier', // Monospace para el código
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 15,
        marginTop: 5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E3A5F',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    totalSection: {
        marginTop: 20,
        borderTopWidth: 2,
        borderTopColor: '#33A8B1', // Turquoise
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 20,
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E8B57', // Emerald Green
    },
    qrPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20,
    },
    qrText: {
        fontSize: 8,
        color: '#999',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 9,
        color: '#999',
    },
});

const VoucherPDF: React.FC<VoucherPDFProps> = ({ booking, qrCodeUrl }) => {
    // Formateo de fecha y hora
    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    };

    const formatCurrency = (amount: number) => {
        return `S/ ${amount.toFixed(2)}`;
    };

    // Construir detalles del cliente
    // Intentamos usar los campos desglosados si están, sino el nombre completo
    const clientFullName = booking.client_first_name
        ? `${booking.client_first_name} ${booking.client_paternal_surname} ${booking.client_maternal_surname || ''}`
        : booking.client_name;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logoText}>BLUE OCEAN</Text>
                    <Text style={styles.title}>VOUCHER DE RESERVA</Text>
                </View>

                {/* Código de Reserva */}
                <View style={styles.bookingCodeContainer}>
                    <Text style={styles.bookingCodeLabel}>Código de Reserva</Text>
                    <Text style={styles.bookingCode}>{booking.booking_code}</Text>
                </View>

                {/* Detalles del Tour */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Detalles de la Experiencia</Text>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Tour / Servicio:</Text>
                        <Text style={styles.value}>{booking.tour_title}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{formatDate(booking.tour_date)}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Hora:</Text>
                        <Text style={styles.value}>{booking.tour_time}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Punto de Encuentro:</Text>
                        <Text style={styles.value}>Oficina Principal - Muelle El Chaco</Text>
                    </View>
                </View>

                {/* Detalles del Pasajero */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Datos del Titular</Text>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Nombre Completo:</Text>
                        <Text style={styles.value}>{clientFullName}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{booking.client_email}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={styles.label}>Teléfono:</Text>
                        <Text style={styles.value}>{booking.client_phone}</Text>
                    </View>
                </View>

                {/* Desglose y QR */}
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Resumen de Pago</Text>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.label}>Pasajeros (PAX):</Text>
                        <Text style={styles.value}>{booking.pax} personas</Text>
                    </View>

                    <View style={styles.totalSection}>
                        <Text style={styles.totalLabel}>TOTAL PAGADO:</Text>
                        <Text style={styles.totalValue}>{formatCurrency(booking.total_price)}</Text>
                    </View>
                </View>

                {/* Espacio para QR */}
                <View style={styles.qrPlaceholder}>
                    {booking.id && qrCodeUrl ? (
                        <Image src={qrCodeUrl} style={{ width: 100, height: 100 }} />
                    ) : (
                        <Text style={styles.qrText}>Loading QR...</Text>
                    )}
                    <Text style={{ fontSize: 6, color: '#999', marginTop: 4 }}>
                        {booking.id.substring(0, 8)}...
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Por favor, presente este voucher digital o impreso 15 minutos antes de la hora programada.
                    </Text>
                    <Text style={styles.footerText}>
                        www.blueocean.com.pe | Soporte: contacto@blueocean.com.pe
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default VoucherPDF;
