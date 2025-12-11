'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Compass,
    Image as ImageIcon,
    MessageSquare,
    Settings,
    Users,
    ChevronLeft,
    LogOut
} from 'lucide-react'
import { signout } from '@/app/auth/actions'
interface AdminSidebarProps {
    user: {
        email?: string
    }
    role?: 'admin' | 'worker' | null
}

const allNavItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin', 'worker'] },
    { name: 'Tours', href: '/admin/tours', icon: Compass, roles: ['admin'] },
    { name: 'Clientes', href: '/admin/clients', icon: Users, roles: ['admin', 'worker'] },
    { name: 'Usuarios', href: '/admin/users', icon: Users, roles: ['admin'] },
    { name: 'Galería', href: '/admin/gallery', icon: ImageIcon, roles: ['admin', 'worker'] },
    { name: 'Testimonios', href: '/admin/testimonials', icon: MessageSquare, roles: ['admin', 'worker'] },
    { name: 'Configuración', href: '/admin/settings', icon: Settings, roles: ['admin'] },
]

export default function AdminSidebar({ user, role }: AdminSidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Filter items based on role
    const navItems = allNavItems.filter(item =>
        role === 'admin' || (role && item.roles.includes(role))
    )

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="relative flex flex-col border-r border-gray-200 bg-white shadow-sm"
        >
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <h2 className="text-lg font-bold text-gray-900">Blue Ocean</h2>
                        <p className="text-xs text-gray-500">Admin Panel</p>
                    </motion.div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                    <ChevronLeft className={`h-5 w-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive = item.href === '/admin'
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }
              `}
                        >
                            <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />

                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {item.name}
                                </motion.span>
                            )}

                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 h-full w-1 rounded-r-full bg-blue-600"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 p-4">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold flex-shrink-0">
                        {user.email?.[0].toUpperCase()}
                    </div>

                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 min-w-0"
                        >
                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                            <form action={signout}>
                                <button
                                    type="submit"
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="h-3 w-3" />
                                    Cerrar sesión
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.aside>
    )
}
