'use client'

interface AdminHeaderProps {
    user: {
        email?: string
    }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6 shadow-sm">
            <div className="flex items-center gap-3">
            </div>
        </header>
    )
}
