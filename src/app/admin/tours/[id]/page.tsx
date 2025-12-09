import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import TourFormWrapper from '../new/TourFormWrapper'

export default async function EditTourPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: tour, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !tour) {
        return <div>Tour no encontrado</div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/admin/tours"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a Tours
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Editar Tour</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Edita la información del tour
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <TourFormWrapper mode="edit" tour={tour} />
                </div>
            </div>
        </div>
    )
}
