'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { Settings } from '@/types/database'

interface Props {
    children: React.ReactNode
    settings?: Settings | null
}

export default function ClientProvider({ children, settings }: Props) {
    const pathname = usePathname()

    // Routes where we don't want the standard layout (Navbar/Footer)
    const isIsolatedRoute = pathname.startsWith('/login') || pathname.startsWith('/admin')

    return (
        <>
            {!isIsolatedRoute && <Navbar />}
            {children}
            {!isIsolatedRoute && <WhatsAppButton phoneNumber={settings?.whatsapp_primary} />}
            {!isIsolatedRoute && <Footer email={settings?.contact_email} phoneNumber={settings?.whatsapp_primary} />}
        </>
    )
}
