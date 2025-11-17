'use client';

import { useScroll } from '@/hooks/useScroll';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrolled = useScroll(200);

  return (
    <>
      <Navbar scrolled={scrolled} />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}
