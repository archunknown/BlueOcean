import { createClient } from '@/utils/supabase/server'
import { getUserRole } from '@/utils/roles'
import DashboardOverview from './DashboardOverview'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Get stats
    const [
        { count: toursCount },
        { count: galleryCount },
        { count: testimonialsCount },
        { count: clientsCount },
        { count: bookingsCount },
        { count: pendingCount },
    ] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending_payment'),
    ])

    const role = await getUserRole()

    const stats = {
        tours: toursCount || 0,
        gallery: galleryCount || 0,
        testimonials: testimonialsCount || 0,
        clients: clientsCount || 0,
        bookings: bookingsCount || 0,
        pendingBookings: pendingCount || 0,
    }

    return <DashboardOverview stats={stats} role={role} />
}
