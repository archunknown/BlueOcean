'use client'

import { Search } from 'lucide-react'

interface AdminHeaderProps {
    user: {
        email?: string
    }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
            {/* Search */}
            <div className="flex flex-1 items-center gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Buscar..."
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            {/* Actions (Removed Bell Icon) */}
            <div className="flex items-center gap-3">
            </div>
        </header>
    )
}
