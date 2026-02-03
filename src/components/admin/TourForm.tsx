'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import ImageUpload from '@/components/admin/ImageUpload'
import DynamicList from '@/components/admin/DynamicList'
import { createTour, updateTour } from '@/app/admin/tours/actions'
import { compressImage } from '@/lib/image-compression'

interface TourFormProps {
    tour?: {
        id: string
        title: string
        category?: 'Tour' | 'Alquiler' | 'Paquete' | 'Full Day' | string
        price: string | number
        short_description: string
        long_description: string | null
        duration: string | null
        capacity?: number | string | null
        group_size?: string | null
        schedule?: string | null
        image?: string
        image_url?: string
        itinerary?: { title: string; items: string[]; icon?: string } | any
        details?: { title: string; items: string[]; icon?: string } | any
        is_active?: boolean
        is_flexible_schedule?: boolean
        time_slots?: string[] | null
    }
    mode: 'create' | 'edit'
}

export default function TourForm({ tour, mode }: TourFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    // New Fields State
    const [isActive, setIsActive] = useState(tour?.is_active ?? true)
    const [isFlexible, setIsFlexible] = useState(tour?.is_flexible_schedule ?? false)
    const [timeSlots, setTimeSlots] = useState<string[]>(tour?.time_slots || [])
    const [newTimeSlot, setNewTimeSlot] = useState('')

    // Prepare initial data for DynamicLists
    const initialItineraryData = tour?.itinerary || { title: 'Itinerario', items: [], icon: '📍' }
    const initialDetailsData = tour?.details || { title: 'Detalles', items: [], icon: '✅' }

    const isCreate = mode === 'create'
    const enableItinerary = isCreate || !!tour?.itinerary
    const enableDetails = isCreate || !!tour?.details

    const [itinerarySubmission, setItinerarySubmission] = useState(enableItinerary ? initialItineraryData : null)
    const [detailsSubmission, setDetailsSubmission] = useState(enableDetails ? initialDetailsData : null)

    const initialImage = tour?.image_url || tour?.image
    const initialCapacity = tour?.group_size || tour?.capacity || ''

    const handleAddTimeSlot = () => {
        if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
            setTimeSlots([...timeSlots, newTimeSlot].sort())
            setNewTimeSlot('')
        }
    }

    const removeTimeSlot = (slot: string) => {
        setTimeSlots(timeSlots.filter(s => s !== slot))
    }

    async function handleSubmit(formData: FormData) {
        // Append hidden fields manually if not in DOM or special types
        formData.append('is_active', String(isActive))
        formData.append('is_flexible_schedule', String(isFlexible))
        formData.append('time_slots', JSON.stringify(timeSlots))

        if (selectedImage) {
            try {
                const compressedFile = await compressImage(selectedImage)
                const MAX_SIZE = 5 * 1024 * 1024;
                if (compressedFile.size > MAX_SIZE) {
                    toast.error(`La imagen es demasiado pesada (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB).`);
                    return;
                }
                formData.set('image', compressedFile)
            } catch (error) {
                console.error('Error compression:', error);
                toast.error('Error al procesar la imagen.');
                return;
            }
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
            {/* Header: Title + Active Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
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

                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Tour Visible en Web
                    </label>
                    <button
                        type="button"
                        id="is_active"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${isActive ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <span className="text-xs text-gray-400 font-mono">
                        {isActive ? 'PUBLICADO' : 'OCULTO'}
                    </span>
                </div>
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
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                        Categoría *
                    </label>
                    <select
                        id="category"
                        name="category"
                        defaultValue={tour?.category || 'Tour'}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="Tour">Tour</option>
                        <option value="Alquiler">Alquiler</option>
                        <option value="Paquete">Paquete</option>
                        <option value="Full Day">Full Day</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                        Precio (Soles) *
                    </label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        defaultValue={tour?.price}
                        required
                        step="0.01"
                        min="0"
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="40.00"
                    />
                    <p className="mt-1 text-xs text-gray-500">Ingrese el monto numérico exacto.</p>
                </div>

                <div>
                    <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                        Cupos Máximos / Info Grupo
                    </label>
                    <input
                        type="text"
                        id="capacity"
                        name="capacity"
                        defaultValue={initialCapacity}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ej: 20 personas, Varía"
                    />
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
            </div>

            {/* Schedule Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Configuración de Horarios</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_flexible"
                            checked={isFlexible}
                            onChange={(e) => setIsFlexible(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label htmlFor="is_flexible" className="text-sm text-gray-700 select-none cursor-pointer">
                            ¿Horario Flexible?
                        </label>
                    </div>
                </div>

                {isFlexible ? (
                    <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-lg">
                        El cliente podrá elegir cualquier hora, o se coordinará internamente. No se mostrarán horarios fijos para reservar.
                        <input type="hidden" name="schedule" value="Horario Flexible" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Agregar Horario de Salida
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={newTimeSlot}
                                    onChange={(e) => setNewTimeSlot(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTimeSlot}
                                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>

                        {timeSlots.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {timeSlots.map((time) => (
                                    <span key={time} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                                        {time}
                                        <button
                                            type="button"
                                            onClick={() => removeTimeSlot(time)}
                                            className="text-gray-400 hover:text-red-500 ml-1"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-gray-500">Estos horarios aparecerán como opciones en el formulario de reserva.</p>
                        {/* Display Schedule Text for backwards compatibility or display */}
                        <div className="hidden">
                            <input type="text" name="schedule" defaultValue={tour?.schedule || ''} />
                        </div>
                    </div>
                )}
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

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Dynamic Block 1: Itinerary / Main Route */}
                <div>
                    <DynamicList
                        label="Sección Dinámica 1 (Ej: Recorrido / Ruta)"
                        initialTitle={initialItineraryData.title}
                        initialItems={initialItineraryData.items}
                        initialIcon={initialItineraryData.icon}
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
                        initialIcon={initialDetailsData.icon}
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
