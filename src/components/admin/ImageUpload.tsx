'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageUploadProps {
    initialUrl?: string
    onImageSelect: (file: File | null) => void
    name?: string
}

export default function ImageUpload({ initialUrl, onImageSelect, name = 'image' }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(initialUrl || null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileChange = useCallback((file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            onImageSelect(file)
        }
    }, [onImageSelect])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) handleFileChange(file)
    }, [handleFileChange])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleRemove = useCallback(() => {
        setPreview(null)
        onImageSelect(null)
    }, [onImageSelect])

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group"
                    >
                        <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50">
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                        </div>

                        <motion.button
                            type="button"
                            onClick={handleRemove}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute top-3 right-3 flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        >
                            <X className="h-4 w-4" />
                            Quitar
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.label
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`
              relative flex cursor-pointer flex-col items-center justify-center
              aspect-video rounded-xl border-2 border-dashed transition-all duration-200
              ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100'
                            }
            `}
                    >
                        <input
                            type="file"
                            name={name}
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFileChange(file)
                            }}
                            className="hidden"
                        />

                        <div className="flex flex-col items-center gap-3 p-6 text-center">
                            <div className={`rounded-full p-3 ${isDragging ? 'bg-blue-100' : 'bg-gray-200'}`}>
                                {isDragging ? (
                                    <Upload className="h-8 w-8 text-blue-600" />
                                ) : (
                                    <ImageIcon className="h-8 w-8 text-gray-500" />
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    {isDragging ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    PNG, JPG, WEBP hasta 10MB
                                </p>
                            </div>
                        </div>
                    </motion.label>
                )}
            </AnimatePresence>
        </div>
    )
}
