'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Routes where we don't want the standard layout (Navbar/Footer)
    const isIsolatedRoute = pathname.startsWith('/login') || pathname.startsWith('/admin')

    return (
        <>
            {!isIsolatedRoute && <Navbar />}
            {children}
            {!isIsolatedRoute && <WhatsAppButton />}
            {!isIsolatedRoute && <Footer />}
        </>
    )
}
