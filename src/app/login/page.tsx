'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { login } from '@/app/auth/actions'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [focusedField, setFocusedField] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 lg:p-8">
            {/* Elementos decorativos - simplificados en móvil */}
            <div className="absolute inset-0 overflow-hidden opacity-50 lg:opacity-100">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 h-full w-full rounded-full bg-blue-500/10 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-slate-500/10 blur-3xl"
                />
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 lg:opacity-100" />

            {/* Container */}
            <div className="relative z-10 w-full max-w-6xl">
                {/* Logo móvil - solo visible en pantallas pequeñas */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex justify-center lg:hidden"
                >
                    <div className="relative inline-flex">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-blue-400 blur-xl"
                        />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50">
                            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </motion.div>

                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-white/10 p-0.5 lg:p-1 shadow-2xl backdrop-blur-xl">
                    {/* Borde animado */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-500 via-slate-400 to-blue-500 opacity-60 blur-sm"
                    />

                    {/* Grid de 2 columnas */}
                    <div className="relative grid lg:grid-cols-2 gap-0 rounded-2xl lg:rounded-3xl bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95 backdrop-blur-xl overflow-hidden">

                        {/* Columna Izquierda - Solo desktop */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="hidden lg:flex flex-col justify-center p-12 lg:p-16 space-y-8"
                        >
                            {/* Logo y título */}
                            <div>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative mb-6 inline-flex"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full bg-blue-400 blur-2xl"
                                    />
                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/50">
                                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                </motion.div>

                                <h1 className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-4xl font-black text-transparent sm:text-5xl">
                                    Blue Ocean Paracas
                                </h1>
                                <p className="mt-4 text-lg text-blue-200/80">
                                    Gestiona tours, reservas y contenido desde un solo lugar
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                {[
                                    { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", text: "Administra tours y excursiones" },
                                    { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", text: "Control total de reservas" },
                                    { icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", text: "Gestión de galería y contenido" },
                                ].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-shrink-0 rounded-lg bg-blue-500/20 p-2">
                                            <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-blue-100/90">{feature.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Columna Derecha - Formulario */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col justify-center bg-gradient-to-br from-slate-800/30 to-blue-900/20 p-6 sm:p-8 lg:p-16 lg:bg-slate-800/50 lg:to-blue-900/30 backdrop-blur-sm"
                        >
                            <div className="mx-auto w-full max-w-md">
                                {/* Título del formulario */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-6 lg:mb-8 text-center"
                                >
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Iniciar Sesión</h2>
                                    <p className="mt-1.5 lg:mt-2 text-xs sm:text-sm text-blue-200/70">Ingresa tus credenciales de administrador</p>
                                </motion.div>

                                {/* Form */}
                                <form action={handleSubmit} className="space-y-4 lg:space-y-5">
                                    {/* Email */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-blue-100/90">
                                            Correo Electrónico
                                        </label>
                                        <div className="relative mt-1.5 lg:mt-2">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 lg:pl-4 pointer-events-none">
                                                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full rounded-lg lg:rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 lg:px-4 lg:py-3.5 pl-10 lg:pl-12 text-sm lg:text-base text-white placeholder-blue-200/40 transition-all focus:border-blue-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                                                placeholder="admin@blueocean.com"
                                            />
                                            {focusedField === 'email' && (
                                                <motion.div
                                                    layoutId="focusIndicator"
                                                    className="absolute inset-0 rounded-lg lg:rounded-xl border-2 border-blue-400/30 pointer-events-none"
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
                                        <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-blue-100/90">
                                            Contraseña
                                        </label>
                                        <div className="relative mt-1.5 lg:mt-2">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 lg:pl-4 pointer-events-none">
                                                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-blue-300/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                autoComplete="current-password"
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full rounded-lg lg:rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 lg:px-4 lg:py-3.5 pl-10 lg:pl-12 text-sm lg:text-base text-white placeholder-blue-200/40 transition-all focus:border-blue-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                                                placeholder="••••••••"
                                            />
                                            {focusedField === 'password' && (
                                                <motion.div
                                                    layoutId="focusIndicator"
                                                    className="absolute inset-0 rounded-lg lg:rounded-xl border-2 border-blue-400/30 pointer-events-none"
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
                                            className="rounded-lg lg:rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2.5 lg:px-4 lg:py-3"
                                        >
                                            <div className="flex items-center gap-2 lg:gap-3">
                                                <svg className="h-4 w-4 lg:h-5 lg:w-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs lg:text-sm font-medium text-red-200">{error}</span>
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
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group relative w-full overflow-hidden rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 lg:py-4 text-sm lg:text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                <>
                                                    Iniciar Sesión
                                                    <svg className="h-4 w-4 lg:h-5 lg:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </>
                                            )}
                                        </span>
                                    </motion.button>
                                </form>

                                {/* Registro */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="mt-4 lg:mt-6 text-center"
                                >
                                    <p className="text-xs lg:text-sm text-blue-200/70">
                                        ¿No tienes cuenta?{' '}
                                        <button
                                            disabled
                                            className="font-semibold text-blue-300/50 cursor-not-allowed"
                                        >
                                            Regístrate ahora
                                        </button>
                                    </p>
                                </motion.div>

                                {/* Volver */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-4 lg:mt-6 text-center"
                                >
                                    <a href="/" className="inline-flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-medium text-blue-200/80 hover:text-blue-100">
                                        <svg className="h-3.5 w-3.5 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Volver al inicio
                                    </a>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-4 lg:mt-6 text-center text-xs lg:text-sm text-blue-200/50"
                >
                    © 2025 Blue Ocean Paracas. Todos los derechos reservados.
                </motion.p>
            </div>
        </div>
    )
}