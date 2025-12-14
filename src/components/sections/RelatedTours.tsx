'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Tour } from '@/types/tour-schemas';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface RelatedToursProps {
  allTours: Tour[];
  currentTourSlug: string;
}

export default function RelatedTours({ allTours, currentTourSlug }: RelatedToursProps) {
  const relatedTours = allTours.filter((tour) => tour.slug !== currentTourSlug);

  if (relatedTours.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-oceanBlue mb-8 text-center">
          También te puede interesar...
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: true,
            }}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="!pb-12" // Add padding bottom for pagination
          >
            {relatedTours.map((tour) => (
              <SwiperSlide key={tour.slug}>
                <Link href={`/tours/${tour.slug}`} passHref>
                  <motion.div
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                    whileHover={{ y: -8 }}
                  >
                    {/* Imagen */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={tour.image_url}
                        alt={tour.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 -right-10 z-10">
                        <div className="relative w-48 h-8 flex justify-center items-center transform rotate-45 bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-xl border-b-2 border-yellow-600">
                          <span className="font-black text-lg tracking-wider text-red-700 [text-shadow:1px_1px_2px_rgba(0,0,0,0.2)]">{tour.price}</span>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-oceanBlue backdrop-blur-sm sm:text-sm">
                        {tour.category}
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="mb-2 text-xl font-bold text-oceanBlue transition-colors group-hover:text-turquoise sm:text-2xl truncate">
                        {tour.title}
                      </h3>
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
                        {tour.short_description}
                      </p>
                      <div className="mt-4 text-center border-t pt-4">
                        <span className="font-bold text-oceanBlue group-hover:text-turquoise transition-colors">
                          Ver Detalles
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Custom Navigation */}
          <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-10 cursor-pointer p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all -ml-4 hidden lg:block">
            <ChevronLeftIcon className="h-6 w-6 text-oceanBlue" />
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-10 cursor-pointer p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition-all -mr-4 hidden lg:block">
            <ChevronRightIcon className="h-6 w-6 text-oceanBlue" />
          </div>
          {/* Custom Pagination */}
          <div className="swiper-pagination-custom text-center mt-4"></div>
        </div>
      </div>
    </section>
  );
}
