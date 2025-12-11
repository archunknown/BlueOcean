import { createClient } from '@/utils/supabase/server'
import GalleryManager from '@/components/admin/GalleryManager'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
    const supabase = await createClient()

    const { data: images, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching gallery:', error)
        return <div className="p-8 text-red-500">Error al cargar la galería</div>
    }

    return (
        <div className="space-y-8 p-6 sm:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galería de Imágenes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Sube y administra las fotos de la galería pública
                    </p>
                </div>
            </div>

            <GalleryManager initialImages={images || []} />
        </div>
    )
}
