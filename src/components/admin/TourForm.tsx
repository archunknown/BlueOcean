'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import ImageUpload from '@/components/admin/ImageUpload'
import DynamicList from '@/components/admin/DynamicList'
import { createTour, updateTour } from '@/app/admin/tours/actions'

interface TourFormProps {
    tour?: {
        id: string
        title: string
        price: string | number
        short_description: string
        long_description: string | null
        duration: string | null
        capacity?: number | string | null
        group_size?: string | null
        schedule?: string | null
        image?: string
        image_url?: string
        itinerary?: { title: string; items: string[] } | any
        details?: { title: string; items: string[] } | any
    }
    mode: 'create' | 'edit'
}

function extractNumericPrice(price: string | number | undefined): string {
    if (!price) return ''
    const priceStr = String(price)
    const numericValue = priceStr.replace(/[^0-9.]/g, '')
    return numericValue
}

export default function TourForm({ tour, mode }: TourFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    // Prepare initial data for DynamicLists
    // If we have data, use it. If not, use defaults.
    const initialItineraryData = tour?.itinerary || { title: 'Itinerario', items: [] }
    const initialDetailsData = tour?.details || { title: 'Detalles', items: [] }

    // Determine if enabled initially.
    // For 'create' mode, enable both by default.
    // For 'edit' mode, enable only if data existed.
    const isCreate = mode === 'create'
    const enableItinerary = isCreate || !!tour?.itinerary
    const enableDetails = isCreate || !!tour?.details

    // State tracks the actual data to be submitted (can be null if disabled)
    // Initialize with current data if enabled, or null otherwise.
    const [itinerarySubmission, setItinerarySubmission] = useState(enableItinerary ? initialItineraryData : null)
    const [detailsSubmission, setDetailsSubmission] = useState(enableDetails ? initialDetailsData : null)

    const numericPrice = tour ? extractNumericPrice(tour.price) : ''
    const initialImage = tour?.image_url || tour?.image
    const initialCapacity = tour?.group_size || tour?.capacity || ''

    async function handleSubmit(formData: FormData) {
        if (selectedImage) {
            formData.set('image', selectedImage)
        }

        startTransition(async () => {
            try {
                const result = mode === 'create'
                    ? await createTour(formData)
                    : await updateTour(tour!.id, formData)

                if (result?.error) {
                    toast.error(result.error)
                } else {
                    toast.success(mode === 'create' ? 'Tour creado exitosamente' : 'Tour actualizado exitosamente')
                    router.push('/admin/tours')
                }
            } catch (error) {
                toast.error('Error inesperado')
            }
        })
    }

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            action={handleSubmit}
            className="space-y-8"
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Imagen de Portada *
                </label>
                <ImageUpload
                    initialUrl={initialImage}
                    onImageSelect={setSelectedImage}
                    name="image"
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                        Título del Tour *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={tour?.title}
                        required
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ej: Tour Islas Ballestas"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio (Soles) *
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-gray-500 font-medium">S/</span>
                        </div>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            defaultValue={numericPrice}
                            required
                            step="0.01"
                            min="0"
                            onWheel={(e) => e.currentTarget.blur()}
                            className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="40.00"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
                        Duración
                    </label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        defaultValue={tour?.duration || ''}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ej: 4 horas"
                    />
                </div>

                <div>
                    <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                        Cupos Máximos
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        defaultValue={initialCapacity}
                        min="1"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="20"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="short_description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción Corta *
                </label>
                <textarea
                    id="short_description"
                    name="short_description"
                    defaultValue={tour?.short_description}
                    required
                    rows={2}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Breve descripción que aparece en las tarjetas..."
                />
            </div>

            <div>
                <label htmlFor="long_description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción General
                </label>
                <textarea
                    id="long_description"
                    name="long_description"
                    defaultValue={tour?.long_description || ''}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Descripción introductoria..."
                />
            </div>

            {/* Schedule Field */}
            <div>
                <label htmlFor="schedule" className="block text-sm font-semibold text-gray-700 mb-2">
                    Horario de Salidas
                </label>
                <input
                    type="text"
                    id="schedule"
                    name="schedule"
                    defaultValue={tour?.schedule || ''}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Ej: Salidas 8am, 10am, 12pm"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Dynamic Block 1: Itinerary / Main Route */}
                <div>
                    <DynamicList
                        label="Sección Dinámica 1 (Ej: Recorrido / Ruta)"
                        initialTitle={initialItineraryData.title}
                        initialItems={initialItineraryData.items}
                        initialEnabled={enableItinerary}
                        onUpdate={setItinerarySubmission}
                    />
                    <input type="hidden" name="itinerary" value={JSON.stringify(itinerarySubmission)} />
                </div>

                {/* Dynamic Block 2: Details / Includes */}
                <div>
                    <DynamicList
                        label="Sección Dinámica 2 (Ej: Incluye / Requisitos)"
                        initialTitle={initialDetailsData.title}
                        initialItems={initialDetailsData.items}
                        initialEnabled={enableDetails}
                        onUpdate={setDetailsSubmission}
                    />
                    <input type="hidden" name="details" value={JSON.stringify(detailsSubmission)} />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Cancelar
                </button>

                <motion.button
                    type="submit"
                    disabled={isPending || (mode === 'create' && !selectedImage)}
                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            {mode === 'create' ? 'Crear Tour' : 'Guardar Cambios'}
                        </>
                    )}
                </motion.button>
            </div>
        </motion.form>
    )
}
