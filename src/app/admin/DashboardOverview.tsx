'use client'

import { motion } from 'framer-motion'
import { Compass, Image as ImageIcon, MessageSquare, Calendar, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

interface DashboardOverviewProps {
    stats: {
        tours: number
        gallery: number
        testimonials: number
        bookings: number
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
        name: 'Imágenes en Galería',
        icon: ImageIcon,
        color: 'purple',
        href: '/admin/gallery',
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
}

export default function DashboardOverview({ stats, role }: DashboardOverviewProps) {
    const statsArray = [stats.tours, stats.gallery, stats.testimonials, stats.bookings]

    // Filter cards based on role
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
                    // Map value based on original index. Since we filtered, we need to find the stat by name or maintain order?
                    // Simpler: Map stat name to value key.
                    let value = 0
                    if (card.name === 'Tours Activos') value = stats.tours
                    if (card.name === 'Imágenes en Galería') value = stats.gallery
                    if (card.name === 'Testimonios') value = stats.testimonials
                    if (card.name === 'Reservas') value = stats.bookings

                    return (
                        <motion.div
                            key={card.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={card.href}>
                                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600">{card.name}</p>
                                            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                                        </div>
                                        <div className={`rounded-lg p-3 ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </div>
                            </Link>
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
                    <Link href="/admin/gallery">
                        <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors">
                            <ImageIcon className="mx-auto mb-2 h-6 w-6" />
                            Subir Imagen
                        </button>
                    </Link>

                    {/* Admin Actions */}
                    {role === 'admin' && (
                        <>
                            <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
                                <Users className="mx-auto mb-2 h-6 w-6" />
                                Ver Clientes
                            </button>

                            <button className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-sm font-medium text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors">
                                <TrendingUp className="mx-auto mb-2 h-6 w-6" />
                                Ver Reportes
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
