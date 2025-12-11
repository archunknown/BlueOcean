'use client';
import { motion } from 'framer-motion';

interface Props {
    title: string;
    subtitle?: React.ReactNode;
    center?: boolean;
}

export default function SectionHeader({ title, subtitle, center = true }: Props) {
    return (
        <div className={`mb-12 ${center ? 'text-center' : ''} sm:mb-16 lg:mb-20`}>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-black tracking-tight text-oceanBlue sm:text-5xl lg:text-6xl"
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
