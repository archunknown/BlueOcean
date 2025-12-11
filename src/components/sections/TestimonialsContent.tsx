'use client';
import { motion } from 'framer-motion';
import TestimonialsClient from './TestimonialsClient';
import TestimonialForm from './TestimonialForm';
import { ReactNode } from 'react';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    content: string;
    rating: number;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1] as const,
        },
    },
};

export default function TestimonialsContent({ testimonials }: { testimonials: Testimonial[] }) {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            {/* Carousel */}
            <motion.div variants={itemVariants}>
                <TestimonialsClient testimonials={testimonials} />
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants} className="mt-20">
                <TestimonialForm />
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-2 gap-6 sm:mt-16 sm:grid-cols-4 sm:gap-8">
                {[
                    { label: 'Tours Realizados', value: '1,500+' },
                    { label: 'Clientes Felices', value: '1,000+' },
                    { label: 'Años de Experiencia', value: '3+' },
                    { label: 'Rating Promedio', value: '4.9/5' },
                ].map((stat, index) => (
                    <div key={index} className="text-center">
                        <p className="text-2xl font-black text-blue-900 sm:text-3xl lg:text-4xl">
                            {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-gray-500 sm:text-base">{stat.label}</p>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );
}
