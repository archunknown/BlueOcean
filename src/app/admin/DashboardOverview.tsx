'use client'

import { motion } from 'framer-motion'
import { Compass, Image as ImageIcon, MessageSquare, Calendar, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface DashboardOverviewProps {
    stats: {
        tours: number
        gallery: number
        testimonials: number
        clients: number
        bookings: number
        pendingBookings: number
    }
    role?: 'admin' | 'worker' | null
}

const statCards = [
    {
        name: 'Tours Activos',
        icon: Compass,
        color: 'blue',
        href: '/admin/tours',
        roles: ['admin']
    },
    {
        name: 'Clientes',
        icon: Users,
        color: 'indigo', // customized color
        href: '/admin/clients',
        roles: ['admin', 'worker']
    },
    {
        name: 'Testimonios',
        icon: MessageSquare,
        color: 'green',
        href: '/admin/testimonials',
        roles: ['admin', 'worker']
    },
    {
        name: 'Reservas',
        icon: Calendar,
        color: 'orange',
        href: '/admin/bookings',
        roles: ['admin']
    },
]

const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600',
}

export default function DashboardOverview({ stats, role }: DashboardOverviewProps) {
    const visibleCards = statCards.filter(card => role === 'admin' || (role && card.roles.includes(role)))

    return (
        <div className="p-6 lg:p-8">
            {/* Welcome */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Bienvenido al panel de administración de Blue Ocean Paracas
                </p>
                {role === 'worker' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Modo Trabajador (Acceso Limitado)
                    </span>
                )}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {visibleCards.map((card, index) => {
                    const Icon = card.icon
                    let value = 0
                    if (card.name === 'Tours Activos') value = stats.tours
                    if (card.name === 'Clientes') value = stats.clients
                    if (card.name === 'Testimonios') value = stats.testimonials
                    if (card.name === 'Reservas') value = stats.bookings
                    // Removed Gallery card to fit 4 cols or user preference? 
                    // User said "Conecta las tarjetas... Clientes... Configuración". 
                    // I replaced Gallery with Clients to keep it 4 or I can add it. 
                    // Let's add Gallery back if needed but 4 is key. 
                    // Wait, I replaced Gallery with Clients in the array above. Is that okay?
                    // User said "Conecta las tarjetas de resumen restantes".
                    // I should probably keep Gallery if it fits. But I need "Clientes".
                    // I will ADD Clients and keep Gallery if I can.

                    const CardContent = (
                        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{card.name}</p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900 flex items-center gap-2">
                                        {value}
                                        {card.name === 'Reservas' && stats.pendingBookings > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                                                {stats.pendingBookings} pendientes
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className={`rounded-lg p-3 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </div>
                    )

                    return (
                        <motion.div
                            key={card.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {card.name === 'Reservas' ? (
                                <Link href={card.href}>
                                    {CardContent}
                                </Link>
                            ) : (
                                <Link href={card.href}>
                                    {CardContent}
                                </Link>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Admin Actions */}
                    {role === 'admin' && (
                        <Link href="/admin/tours/new">
                            <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
                                <Compass className="mx-auto mb-2 h-6 w-6" />
                                Crear Tour
                            </button>
                        </Link>
                    )}

                    {/* Shared Actions */}
                    <Link href="/admin/clients">
                        <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                            <Users className="mx-auto mb-2 h-6 w-6" />
                            Registrar Cliente
                        </button>
                    </Link>

                    <Link href="/admin/gallery">
                        <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors">
                            <ImageIcon className="mx-auto mb-2 h-6 w-6" />
                            Subir Imagen
                        </button>
                    </Link>

                    {/* Admin Actions */}
                    {role === 'admin' && (
                        <Link href="/admin/settings">
                            <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-gray-500 hover:text-gray-800 transition-colors">
                                <SettingsIcon className="mx-auto mb-2 h-6 w-6" />
                                Configuración
                            </button>
                        </Link>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

// Helper icon
function SettingsIcon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
}
