'use client'

import { motion } from 'framer-motion'
import TourForm from '@/components/admin/TourForm'

interface TourFormWrapperProps {
    mode: 'create' | 'edit'
    tour?: any
}

export default function TourFormWrapper({ mode, tour }: TourFormWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <TourForm mode={mode} tour={tour} />
        </motion.div>
    )
}
