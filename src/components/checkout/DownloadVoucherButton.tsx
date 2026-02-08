
'use client';

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import VoucherPDF from '@/components/pdf/VoucherPDF';
import { Database } from '@/types/database';
import { ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

import QRCode from 'qrcode';

type Booking = Database['public']['Tables']['bookings']['Row'];

interface DownloadVoucherButtonProps {
    booking: Booking;
}

export default function DownloadVoucherButton({ booking }: DownloadVoucherButtonProps) {
    const [isClient, setIsClient] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    // Fix for hydration mismatch with @react-pdf
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Generate QR Code
    useEffect(() => {
        const generateQR = async () => {
            try {
                // Use NEXT_PUBLIC_BASE_URL or fallback to window.location.origin
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
                const url = `${baseUrl}/verify/${booking.id}`;
                const dataUrl = await QRCode.toDataURL(url, { width: 200, margin: 1 });
                setQrCodeUrl(dataUrl);
            } catch (err) {
                console.error("Error generating QR:", err);
            }
        };

        if (booking.id) {
            generateQR();
        }
    }, [booking.id]);

    if (!isClient) {
        return (
            <button disabled className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-xl text-center cursor-wait flex items-center justify-center gap-2">
                <DocumentTextIcon className="w-5 h-5 animate-pulse" />
                <span>Preparando descarga...</span>
            </button>
        );
    }

    // Only render PDFDownloadLink when QR is ready to avoid "breaking" the PDF generation
    const isReady = qrCodeUrl !== '';

    return (
        <div className="w-full">
            {isReady ? (
                <PDFDownloadLink
                    document={<VoucherPDF booking={booking} qrCodeUrl={qrCodeUrl} />}
                    fileName={`Voucher-${booking.booking_code}.pdf`}
                    className="block w-full"
                >
                    {({ blob, url, loading, error }) => (
                        <button
                            disabled={loading}
                            className={`
                                w-full py-4 font-bold rounded-xl text-center flex items-center justify-center gap-2
                                transition-all duration-300 shadow-lg group
                                ${loading
                                    ? 'bg-gray-800 text-gray-400 cursor-wait'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generando documento...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownTrayIcon className="w-5 h-5 group-hover:animate-bounce" />
                                    <span>Descargar Voucher Oficial (PDF)</span>
                                </>
                            )}
                        </button>
                    )}
                </PDFDownloadLink>
            ) : (
                <button disabled className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-xl text-center cursor-wait flex items-center justify-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 animate-pulse" />
                    <span>Preparando QR...</span>
                </button>
            )}
        </div>
    );
}
