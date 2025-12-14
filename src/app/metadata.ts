import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.blueoceanparacastours.com'),
  title: "Blue Ocean Adventure Tours Paracas | Experiencias Inolvidables",
  description: "Descubre las Islas Ballestas, Reserva Nacional de Paracas y más con los mejores tours y guías locales. Reserva tu aventura hoy.",
  openGraph: {
    title: "Blue Ocean Adventure Tours Paracas",
    description: "Experiencias turísticas premium en Paracas. Islas Ballestas, Tubulares, Yakumama y más.",
    url: "https://www.blueoceanparacastours.com", // Replace with actual URL if known, or leave generic
    siteName: "Blue Ocean Paracas",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or is handled
        width: 1200,
        height: 630,
        alt: "Blue Ocean Adventure Tours Paracas",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Ocean Adventure Tours Paracas",
    description: "Vive la aventura en Paracas com Blue Ocean. Tours personalizados y servicio premium.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};
