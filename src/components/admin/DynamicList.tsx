'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { motion, Reorder } from 'framer-motion'

interface DynamicListProps {
    label: string
    initialTitle: string
    initialItems: string[]
    initialIcon?: string
    onUpdate: (data: { title: string; items: string[]; icon: string } | null) => void
    initialEnabled?: boolean
}

const EMOJI_OPTIONS = [
    { value: '📍', label: '📍 Ubicación' },
    { value: '🕒', label: '🕒 Horario' },
    { value: '✅', label: '✅ Check' },
    { value: '🎒', label: '🎒 Mochila' },
    { value: '🚲', label: '🚲 Bicicleta' },
    { value: '🗺️', label: '🗺️ Mapa' },
    { value: '⚙️', label: '⚙️ Engranaje' },
    { value: '⚠️', label: '⚠️ Alerta' },
    { value: '🌟', label: '🌟 Estrella' },
    { value: '📝', label: '📝 Nota' },
]

export default function DynamicList({ label, initialTitle, initialItems, initialIcon = '📍', onUpdate, initialEnabled = true }: DynamicListProps) {
    const [isEnabled, setIsEnabled] = useState(initialEnabled)
    const [title, setTitle] = useState(initialTitle)
    const [icon, setIcon] = useState(initialIcon || '📍')
    const [items, setItems] = useState<string[]>(initialItems)

    // Notify parent whenever state changes
    useEffect(() => {
        if (!isEnabled) {
            onUpdate(null)
        } else {
            onUpdate({ title, items, icon })
        }
    }, [isEnabled, title, items, icon, onUpdate])

    const addItem = () => {
        setItems([...items, ''])
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const updateItem = (index: number, value: string) => {
        const newItems = [...items]
        newItems[index] = value
        setItems(newItems)
    }

    if (!isEnabled) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {label} (Deshabilitado)
                    </h3>
                    <button
                        type="button"
                        onClick={() => setIsEnabled(true)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Habilitar Sección
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    {label}
                </h3>
                <button
                    type="button"
                    onClick={() => setIsEnabled(false)}
                    className="text-sm text-red-500 hover:text-red-700 hover:underline"
                >
                    Deshabilitar
                </button>
            </div>

            <div className="space-y-4">
                {/* Section Title Input + Icon Picker */}
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">
                        Título de la Sección e Ícono
                    </label>
                    <div className="flex gap-2">
                        <select
                            value={icon}
                            onChange={(e) => setIcon(e.target.value)}
                            className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-2 text-xl text-center focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {EMOJI_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.value}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Ej: Recorrido Principal"
                        />
                    </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-gray-500">
                        Elementos de la lista
                    </label>

                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="grid place-items-center text-gray-400">
                                <GripVertical className="h-4 w-4" />
                            </div>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => updateItem(index, e.target.value)}
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={`Item ${index + 1}`}
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addItem}
                        className="mt-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Elemento
                    </button>
                </div>
            </div>
        </div>
    )
}
