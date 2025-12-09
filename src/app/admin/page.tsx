import { createClient } from '@/utils/supabase/server'
import DashboardOverview from './DashboardOverview'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Get stats
    const [
        { count: toursCount },
        { count: galleryCount },
    ] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('gallery').select('*', { count: 'exact', head: true }),
    ])

    const stats = {
        tours: toursCount || 0,
        gallery: galleryCount || 0,
        testimonials: 0,
        bookings: 0,
    }

    return <DashboardOverview stats={stats} />
}
