import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Iniciar Sesión - Blue Ocean Paracas',
    description: 'Panel de administración',
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This layout bypasses ClientProvider to hide Navbar/Footer
    return <>{children}</>
}
