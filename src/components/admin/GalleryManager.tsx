'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUpload from '@/components/admin/ImageUpload'
import { createImage, deleteImage } from '@/app/admin/gallery/actions'
import { compressImage } from '@/lib/image-compression'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GalleryImage {
    id: string
    title: string
    category: string | null
    image_url: string
    created_at: string
}

interface GalleryManagerProps {
    initialImages: GalleryImage[]
}

const ALLOWED_CATEGORIES = ['Islas', 'Reserva', 'Desierto', 'Aventura']

export default function GalleryManager({ initialImages }: GalleryManagerProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [images, setImages] = useState(initialImages)
    const [uploadImage, setUploadImage] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState(ALLOWED_CATEGORIES[0])
    const [deletingId, setDeletingId] = useState<string | null>(null)

    // Update local state when props change
    if (initialImages !== images && !isPending) {
        setImages(initialImages)
    }

    // ...

    async function handleUpload(formData: FormData) {
        if (!uploadImage) {
            toast.error('Selecciona una imagen')
            return
        }

        // Validate category
        if (!category.trim()) {
            toast.error('Selecciona una categoría')
            return
        }

        let fileToUpload = uploadImage
        try {
            // Compress image before upload
            // Max 1920px width, 0.8 JPEG quality
            fileToUpload = await compressImage(uploadImage)
        } catch (error) {
            console.error('Compression failed:', error)
            // Fallback to original file
        }

        formData.set('image', fileToUpload)
        formData.set('category', category)

        startTransition(async () => {
            const result = await createImage(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Imagen subida correctamente')
                setTitle('')
                setCategory(ALLOWED_CATEGORIES[0])
                setUploadImage(null)
                // Force reset of ImageUpload preview if possible (it's uncontrolled mostly, but key change can reset it)
                // Actually, ImageUpload depends on parent state passed? No, local state.
                // I need to use a key or ref to reset it. Key approach is easiest.
            }
        })
    }

    async function handleDelete(id: string, url: string) {
        setDeletingId(id)
        try {
            const result = await deleteImage(id, url)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Imagen eliminada')
                // Optimistic update
                setImages(prev => prev.filter(img => img.id !== id))
                router.refresh()
            }
        } catch (error) {
            toast.error('Error al eliminar')
        } finally {
            setDeletingId(null)
        }
    }

    // Key to reset ImageUpload
    const uploadKey = `upload-${isPending ? 'pending' : 'idle'}-${images.length}`

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Upload Area */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    Subir Nueva Foto
                </h2>

                <form action={handleUpload} className="grid md:grid-cols-[300px_1fr] gap-6">
                    <div>
                        <ImageUpload
                            key={uploadKey}
                            onImageSelect={setUploadImage}
                            name="image"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Título / Descripción</label>
                            <input
                                type="text"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="Ej: Atardecer en la playa..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            >
                                {ALLOWED_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending || !uploadImage || !title || !category.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Subiendo...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        Agregar a Galería
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {images.map((img) => (
                        <motion.div
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                        >
                            <Image
                                src={img.image_url}
                                alt={img.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white font-medium text-sm line-clamp-1">{img.title}</p>
                                <span className="text-gray-300 text-xs">{img.category}</span>
                            </div>

                            {/* Delete Action */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button
                                            className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            disabled={deletingId === img.id}
                                        >
                                            {deletingId === img.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Se eliminará permanentemente "{img.title}".
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(img.id, img.image_url)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No hay imágenes en la galería aún.</p>
                </div>
            )}
        </motion.div>
    )
}
