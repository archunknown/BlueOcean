import { createClient } from '@/utils/supabase/server'
import GalleryManager from '@/components/admin/GalleryManager'

export const metadata = {
    title: 'Gestión de Galería | Admin',
}

export default async function GalleryPage() {
    const supabase = await createClient()

    const { data: images } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Galería de Imágenes</h1>
                <p className="text-gray-500 mt-2">Sube, organiza y elimina las fotos que aparecen en la sección de galería.</p>
            </div>

            <GalleryManager initialImages={images || []} />
        </div>
    )
}
