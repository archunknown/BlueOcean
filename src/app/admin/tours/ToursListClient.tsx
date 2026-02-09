'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search, Filter, Loader2, AlertCircle } from 'lucide-react'
import { ArchiveBoxIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { toggleTourStatus } from './actions'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
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

// Define helper types for correct property access
interface Tour {
    id: string;
    title: string;
    price: string | number;
    category?: string | null;
    image_url?: string;
    image?: string; // fallback
    group_size?: string | number | null;
    capacity?: string | number | null; // fallback
    duration?: string | null;
    is_active: boolean; // Added field
}

interface ToursListClientProps {
    initialTours: Tour[]
}

export default function ToursListClient({ initialTours }: ToursListClientProps) {
    const router = useRouter()

    const [tours, setTours] = useState(initialTours)
    const [searchTerm, setSearchTerm] = useState('')
    const [processingId, setProcessingId] = useState<string | null>(null)

    // Filter tours based on search term
    const filteredTours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        const newStatus = !currentStatus
        setProcessingId(id)
        try {
            // Using logic from deleteTour which now calls toggleTourStatus for false, 
            // but we need to explicitly call toggleTourStatus for true (reactivate).
            // To imply cleaner logic, we should probably import toggleTourStatus if we exported it,
            // or just use deleteTour for archiving.
            // Wait, let's look at what we did in actions.ts. We exported toggleTourStatus.
            // We need to import it here. But wait, I can't change imports in this block.
            // I will assume I can update imports in a separate block or I will just use deleteTour for archive
            // and I'll need to figure out how to reactivate if I only have deleteTour imported.
            // Actually, I should update the imports first or in the same step if possible.
            // Since this tool replaces a block, I'll do the imports in a separate call to be safe 
            // OR I will simply use server actions directly if Next.js allows, but I need to import them.
            // I will update the imports in a previous step or use the multi_replace tool.
            // Ah, I see I am in the middle of replacing the component body. 
            // I will assume I will fix the imports in the next step.

            // For now, I will write the logic assuming toggleTourStatus is available.

            const result = await toggleTourStatus(id, newStatus)

            if (result.error) throw new Error(result.error)

            setTours(current => current.map(t =>
                t.id === id ? { ...t, is_active: newStatus } : t
            ))
            toast.success(newStatus ? 'Tour activado correctamente' : 'Tour archivado correctamente')
            router.refresh()
        } catch (error) {
            console.error('Error updating tour:', error)
            toast.error('Error al actualizar el estado')
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar tours..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                    <Link
                        href="/admin/tours/new"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Tour
                    </Link>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredTours.length > 0 ? (
                        filteredTours.map((tour) => (
                            <motion.div
                                key={tour.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${!tour.is_active ? 'opacity-75 grayscale-[0.5]' : ''} ${!tour.is_active ? 'border-gray-200' : 'border-gray-100'}`}
                            >
                                {/* Image Area */}
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    {(tour.image_url || tour.image) ? (
                                        <Image
                                            src={tour.image_url || tour.image || ''}
                                            alt={tour.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <ImageIcon className="h-10 w-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <div className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm ${tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {tour.is_active ? 'ACTIVO' : 'INACTIVO'}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {tour.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-semibold text-gray-900">
                                                {typeof tour.price === 'string' && tour.price.startsWith('S/')
                                                    ? tour.price
                                                    : `S/ ${tour.price}`}
                                            </span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>{tour.duration || 'N/A'}</span>
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>{tour.group_size || tour.capacity || 'N/A'} p.</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                        <Link
                                            href={`/admin/tours/${tour.id}`}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </Link>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    className={`flex items-center justify-center p-2 rounded-lg transition-all ${tour.is_active
                                                        ? 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                                                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                        }`}
                                                    disabled={processingId === tour.id}
                                                    title={tour.is_active ? "Archivar / Desactivar" : "Reactivar"}
                                                >
                                                    {processingId === tour.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        tour.is_active ? <ArchiveBoxIcon className="h-4 w-4" /> : <ArrowPathIcon className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {tour.is_active ? '¿Desactivar Tour?' : '¿Reactivar Tour?'}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {tour.is_active
                                                            ? `¿Seguro que deseas desactivar "${tour.title}"? No aparecerá en la web pública, pero el historial de reservas se mantendrá.`
                                                            : `¿Deseas reactivar "${tour.title}"? Volverá a ser visible para el público.`
                                                        }
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleToggleStatus(tour.id, tour.is_active)}
                                                        className={tour.is_active ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
                                                    >
                                                        {tour.is_active ? 'Desactivar' : 'Reactivar'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <AlertCircle className="h-10 w-10 mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron tours</h3>
                            <p className="text-sm">Prueba ajustando tu búsqueda o crea un nuevo tour.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function ImageIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )
}
