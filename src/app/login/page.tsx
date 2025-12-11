'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login } from '@/app/auth/actions'
import Link from 'next/link'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegister, setIsRegister] = useState(false)

    async function handleSubmit(formData: FormData) {
        if (isRegister) return

        setIsLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-sky-50 to-orange-50 p-4 sm:p-6 lg:p-8">
            {/* Elementos decorativos oceánicos */}
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-gradient-to-br from-sky-400/30 to-blue-500/30 blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 80, 0],
                        scale: [1.1, 1, 1.1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 right-0 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-gradient-to-br from-orange-300/30 to-amber-400/30 blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -60, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 h-48 w-48 sm:h-72 sm:w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-teal-300/20 to-cyan-400/20 blur-3xl"
                />
            </div>

            {/* Ondas decorativas */}
            <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none">
                <svg className="w-full h-32 sm:h-48" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <motion.path
                        animate={{
                            d: [
                                "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                                "M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            ]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        fill="currentColor"
                        className="text-sky-600/20"
                    />
                </svg>
            </div>

            {/* Container */}
            <div className="relative z-10 w-full max-w-6xl">
                {/* Logo móvil */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8 flex justify-center lg:hidden"
                >
                    <div className="relative inline-flex">
                        {/* Glow effect reutilizado */}
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-sky-400 blur-2xl"
                        />
                        {/* Logo con diseño orgánico */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="relative"
                        >
                            {/* Círculos decorativos detrás */}
                            <div className="absolute -inset-2 bg-gradient-to-br from-sky-400/20 via-blue-500/20 to-cyan-400/20 rounded-3xl blur-md" />
                            <div className="absolute -inset-1 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl" />

                            {/* Logo principal */}
                            <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-600 shadow-xl shadow-sky-500/40 border-2 border-white/20">
                                {/* Brillo interno */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                                <svg className="h-7 w-7 sm:h-8 sm:w-8 text-white relative z-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">
                    {/* Borde decorativo superior con olas */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500">
                        <svg className="absolute top-0 w-full h-3" viewBox="0 0 1200 12" preserveAspectRatio="none">
                            <motion.path
                                animate={{
                                    d: [
                                        "M0,6 Q300,0 600,6 T1200,6 L1200,12 L0,12 Z",
                                        "M0,6 Q300,12 600,6 T1200,6 L1200,12 L0,12 Z",
                                        "M0,6 Q300,0 600,6 T1200,6 L1200,12 L0,12 Z"
                                    ]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                fill="white"
                                opacity="0.3"
                            />
                        </svg>
                    </div>

                    {/* Grid de 2 columnas */}
                    {/* Grid de 2 columnas -> Flex container for swapping */}
                    <div className={`flex flex-col ${isRegister ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                        {/* Columna Izquierda - Solo desktop */}
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:flex lg:w-1/2 flex-col justify-center bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-600 p-10 xl:p-16 relative overflow-hidden min-h-[600px] transition-all duration-700"
                        >
                            {/* Patrón de fondo reutilizado */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                                    backgroundSize: '40px 40px'
                                }} />
                            </div>

                            {/* Olas decorativas reutilizadas */}
                            <motion.div
                                animate={{ x: [0, 20, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 right-0 opacity-20"
                            >
                                <svg width="200" height="200" viewBox="0 0 200 200">
                                    <path d="M0,100 Q50,80 100,100 T200,100" fill="none" stroke="white" strokeWidth="3" />
                                    <path d="M0,120 Q50,100 100,120 T200,120" fill="none" stroke="white" strokeWidth="3" />
                                    <path d="M0,140 Q50,120 100,140 T200,140" fill="none" stroke="white" strokeWidth="3" />
                                </svg>
                            </motion.div>

                            <motion.div
                                layout="position"
                                className="relative z-10 space-y-8"
                            >
                                {/* Logo mejorado con diseño orgánico */}
                                <div>
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative mb-6 inline-flex"
                                    >
                                        {/* Glow effect múltiple reutilizado */}
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0 rounded-full bg-white blur-2xl"
                                        />
                                        <motion.div
                                            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                                            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                            className="absolute -inset-2 rounded-full bg-cyan-300 blur-3xl"
                                        />

                                        {/* Capas decorativas orgánicas */}
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                            className="absolute -inset-4 rounded-[2rem]"
                                        >
                                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-cyan-200/10 blur-sm" />
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.05, rotate: -5 }}
                                            className="relative"
                                        >
                                            {/* Círculos decorativos detrás (reutilizados del móvil) */}
                                            <div className="absolute -inset-3 bg-gradient-to-br from-white/30 via-cyan-100/20 to-blue-100/30 rounded-[2rem] blur-lg" />
                                            <div className="absolute -inset-2 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl" />

                                            {/* Logo principal con sombras orgánicas */}
                                            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md shadow-2xl border-2 border-white/40 overflow-hidden">
                                                {/* Brillo interno animado */}
                                                <motion.div
                                                    animate={{
                                                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                                                    }}
                                                    transition={{ duration: 5, repeat: Infinity }}
                                                    className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20"
                                                    style={{ backgroundSize: '200% 200%' }}
                                                />

                                                {/* Reflejo de agua */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-3xl" />

                                                <svg className="h-10 w-10 text-white relative z-10 drop-shadow-2xl" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>

                                            {/* Partículas decorativas */}
                                            <motion.div
                                                animate={{
                                                    y: [0, -10, 0],
                                                    opacity: [0.5, 1, 0.5]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                                                className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-300 rounded-full blur-sm"
                                            />
                                            <motion.div
                                                animate={{
                                                    y: [0, -8, 0],
                                                    opacity: [0.4, 0.8, 0.4]
                                                }}
                                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                                className="absolute -bottom-2 -left-2 w-2 h-2 bg-sky-200 rounded-full blur-sm"
                                            />
                                            <motion.div
                                                animate={{
                                                    y: [0, -6, 0],
                                                    opacity: [0.3, 0.7, 0.3]
                                                }}
                                                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                                className="absolute top-1/2 -right-3 w-2 h-2 bg-white rounded-full blur-sm"
                                            />
                                        </motion.div>
                                    </motion.div>

                                    <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                                        Blue Ocean<br />Paracas
                                    </h1>
                                    <p className="text-lg text-white/90 font-medium drop-shadow">
                                        Tu ventana al paraíso costero
                                    </p>
                                    <p className="mt-3 text-sm xl:text-base text-white/80">
                                        Gestiona tours, reservas y contenido desde un solo lugar
                                    </p>
                                </div>

                                {/* Features con iconos oceánicos */}
                                <div className="space-y-4">
                                    {[
                                        {
                                            icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9",
                                            text: "Tours y excursiones personalizadas",
                                            color: "from-amber-400 to-orange-400"
                                        },
                                        {
                                            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                                            text: "Control de reservas en tiempo real",
                                            color: "from-cyan-400 to-teal-400"
                                        },
                                        {
                                            icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                                            text: "Galería de momentos inolvidables",
                                            color: "from-rose-400 to-pink-400"
                                        },
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                            className="flex items-center gap-3 xl:gap-4 group"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 xl:p-3 shadow-lg border border-white/20`}
                                            >
                                                <svg className="h-5 w-5 xl:h-6 xl:w-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                                </svg>
                                            </motion.div>
                                            <p className="text-sm xl:text-base font-semibold text-white drop-shadow">{feature.text}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Decoración inferior */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="pt-6 xl:pt-8 border-t border-white/20"
                                >
                                    <div className="flex items-center gap-3 text-white/80">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Acceso seguro y encriptado</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Columna Derecha - Formulario */}
                        <motion.div
                            layout
                            className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-white to-sky-50/30"
                        >
                            <div className="mx-auto w-full max-w-md">
                                <AnimatePresence mode="wait">
                                    {isRegister ? (
                                        /* REGISTER FORM */
                                        <motion.div
                                            key="register"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                    Crea tu cuenta
                                                </h2>
                                                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                                                    Únete a nuestra comunidad
                                                </p>
                                            </div>

                                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
                                                {/* Names Grid */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Names */}
                                                    <div className="col-span-2">
                                                        <label htmlFor="first_name" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                            Nombres
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                            <input
                                                                id="first_name"
                                                                name="first_name"
                                                                type="text"
                                                                required
                                                                onFocus={() => setFocusedField('first_name')}
                                                                onBlur={() => setFocusedField(null)}
                                                                className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                                placeholder="Juan Carlos"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Paternal Surname */}
                                                    <div>
                                                        <label htmlFor="paternal_surname" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                            Apellido P.
                                                        </label>
                                                        <input
                                                            id="paternal_surname"
                                                            name="paternal_surname"
                                                            type="text"
                                                            required
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="Pérez"
                                                        />
                                                    </div>

                                                    {/* Maternal Surname */}
                                                    <div>
                                                        <label htmlFor="maternal_surname" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                            Apellido M.
                                                        </label>
                                                        <input
                                                            id="maternal_surname"
                                                            name="maternal_surname"
                                                            type="text"
                                                            required
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="Gómez"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email */}
                                                <div>
                                                    <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                        Correo Electrónico
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            autoComplete="email"
                                                            onFocus={() => setFocusedField('email')}
                                                            onBlur={() => setFocusedField(null)}
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="tucorreo@ejemplo.com"
                                                        />
                                                        {focusedField === 'email' && (
                                                            <motion.div
                                                                layoutId="focusIndicator"
                                                                className="absolute inset-0 rounded-xl border-2 border-sky-500 pointer-events-none"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Password */}
                                                <div>
                                                    <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                        Contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            autoComplete="new-password"
                                                            onFocus={() => setFocusedField('password')}
                                                            onBlur={() => setFocusedField(null)}
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="••••••••"
                                                        />
                                                        {focusedField === 'password' && (
                                                            <motion.div
                                                                layoutId="focusIndicator"
                                                                className="absolute inset-0 rounded-xl border-2 border-sky-500 pointer-events-none"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Error */}
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        className="rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2.5 sm:px-4 sm:py-3"
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs sm:text-sm font-semibold text-red-800">{error}</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Submit Button */}
                                                <motion.button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-gray-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        {isLoading ? (
                                                            <>
                                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                Registrando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Registrarse (Próximamente)
                                                            </>
                                                        )}
                                                    </span>
                                                </motion.button>
                                            </form>

                                            <div className="text-center pt-4">
                                                <p className="text-sm text-gray-600">
                                                    ¿Ya tienes cuenta?{' '}
                                                    <button onClick={() => setIsRegister(false)} className="font-bold text-sky-600 hover:text-sky-700">Inicia Sesión</button>
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        /* LOGIN FORM */
                                        <motion.div
                                            key="login"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="text-center">
                                                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-black bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                                    Bienvenido
                                                </h2>
                                                <p className="mt-1 text-xs sm:text-sm text-gray-600">
                                                    Ingresa a tu cuenta
                                                </p>
                                            </div>

                                            {/* Form */}
                                            <form action={handleSubmit} className="space-y-4">
                                                {/* Email */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                        Correo Electrónico
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                            autoComplete="email"
                                                            onFocus={() => setFocusedField('email')}
                                                            onBlur={() => setFocusedField(null)}
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="tucorreo@ejemplo.com"
                                                        />
                                                        {focusedField === 'email' && (
                                                            <motion.div
                                                                layoutId="focusIndicator"
                                                                className="absolute inset-0 rounded-xl border-2 border-sky-500 pointer-events-none"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* Password */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                                                        Contraseña
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 sm:pl-4 pointer-events-none z-10">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        </div>
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                            autoComplete="current-password"
                                                            onFocus={() => setFocusedField('password')}
                                                            onBlur={() => setFocusedField(null)}
                                                            className="block w-full rounded-xl border-2 border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3.5 pl-10 sm:pl-12 text-sm sm:text-base text-gray-900 placeholder-gray-400 transition-all focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10"
                                                            placeholder="••••••••"
                                                        />
                                                        {focusedField === 'password' && (
                                                            <motion.div
                                                                layoutId="focusIndicator"
                                                                className="absolute inset-0 rounded-xl border-2 border-sky-500 pointer-events-none"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>

                                                {/* Error */}
                                                {error && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        className="rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2.5 sm:px-4 sm:py-3"
                                                    >
                                                        <div className="flex items-center gap-2 sm:gap-3">
                                                            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-xs sm:text-sm font-semibold text-red-800">{error}</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Submit Button */}
                                                <motion.button
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.6 }}
                                                    type="submit"
                                                    disabled={isLoading}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-500"
                                                        initial={{ x: '-100%' }}
                                                        whileHover={{ x: '100%' }}
                                                        transition={{ duration: 0.6 }}
                                                    />
                                                    <span className="relative flex items-center justify-center gap-2">
                                                        {isLoading ? (
                                                            <>
                                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                </svg>
                                                                Iniciando sesión...
                                                            </>
                                                        ) : (
                                                            <>
                                                                Iniciar Sesión
                                                                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                                </svg>
                                                            </>
                                                        )}
                                                    </span>
                                                </motion.button>
                                            </form>

                                            <div className="text-center pt-4 space-y-4">
                                                <p className="text-sm text-gray-600">
                                                    ¿No tienes cuenta?{' '}
                                                    <button onClick={() => setIsRegister(true)} className="font-bold text-sky-600 hover:text-sky-700">Regístrate</button>
                                                </p>

                                                <div className="border-t border-gray-100 pt-4">
                                                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-sky-600 transition-colors">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                                        Volver al inicio
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}