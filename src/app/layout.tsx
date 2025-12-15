import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./client-provider";
import { metadata as appMetadata } from "./metadata";
import StickyCTA from "../components/StickyCTA";
import { Toaster } from "sonner";
import { getGlobalSettings } from "./admin/actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...appMetadata, // Mantiene tu título, descripción y demás configuraciones
  verification: {
    google: 'EzW0_DJQEszjkVU0rCwrDjHtXvo-H7Oy-lJT96k3BdQ',
  },
};

export const viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getGlobalSettings();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider settings={settings}>
          {children}
          <StickyCTA />
        </ClientProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
