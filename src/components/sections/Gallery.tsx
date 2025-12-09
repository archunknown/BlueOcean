'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface GalleryImage {
    id: string;
    src: string;
    category: string;
    title: string;
}

interface GalleryProps {
    images: GalleryImage[];
}

const filters = ['Todas', 'Islas', 'Reserva', 'Desierto', 'Aventura'];

export default function Gallery({ images }: GalleryProps) {
    const [activeFilter, setActiveFilter] = useState('Todas');
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const safeImages = images || [];

    const filteredImages = activeFilter === 'Todas'
        ? safeImages
        : safeImages.filter((image) => image.category === activeFilter);

    return (
        <section className="bg-white pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:mb-12 lg:mb-16">
                    <motion.h2 className="text-4xl font-black text-oceanBlue sm:text-5xl lg:text-6xl">
                        Galería de Aventuras
                    </motion.h2>
                    <motion.p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">
                        Descubre la belleza natural de Paracas
                    </motion.p>
                </div>

                <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3 lg:mb-12">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-warmYellow text-oceanBlue shadow-lg'
                                    : 'bg-lightGray text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((image) => (
                            <motion.div
                                layout
                                key={image.id || image.src}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl shadow-lg"
                                onClick={() => setSelectedImg(image.src)}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.title}
                                    width={800}
                                    height={1200}
                                    className="w-full transform transition-transform duration-500 group-hover:scale-110"
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
