'use client';
import { useState } from 'react';
import type { Metadata } from "next"; // Importar Metadata como tipo
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuickBookingModal from '@/components/QuickBookingModal';
import { useScroll } from '@/hooks/useScroll';
import { motion, AnimatePresence } from 'framer-motion';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const scrolled = useScroll(200); // Aparece después de 200px de scroll

  const toggleBookingModal = () => {
    setIsBookingModalOpen(!isBookingModalOpen);
  };

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar onOpenBookingModal={toggleBookingModal} />
        {children}
        <Footer />

        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              onClick={toggleBookingModal}
              className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-emeraldGreen shadow-lg transition-colors hover:bg-green-600 focus:outline-none"
            >
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <QuickBookingModal isOpen={isBookingModalOpen} onClose={toggleBookingModal} />
      </body>
    </html>
  );
}
