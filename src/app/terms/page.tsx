import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center text-gray-500 hover:text-blue-900 transition-colors">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        <span className="font-medium">Volver al Inicio</span>
                    </Link>
                    <div className="mx-auto font-bold text-xl text-blue-900 pr-20 hidden sm:block">
                        BlueOcean Paracas
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">Términos y Condiciones</h1>
                    <p className="text-gray-500 mb-8 text-sm">Última actualización: 19 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">1. Aceptación de los Términos</h2>
                            <p>
                                Al acceder y utilizar el sitio web de <strong>BlueOcean Paracas Tours</strong> o al realizar una reserva con nosotros, usted acepta estar legalmente vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, por favor absténgase de utilizar nuestros servicios.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">2. Reservas y Pagos</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Todas las reservas están sujetas a disponibilidad.</li>
                                <li>El pago debe realizarse en su totalidad antes de la fecha del servicio para confirmar la reserva, a menos que se acuerde lo contrario.</li>
                                <li>Los precios están expresados en Soles (PEN) e incluyen los impuestos de ley aplicables.</li>
                                <li>Nos reservamos el derecho de modificar los precios en cualquier momento, pero esto no afectará a las reservas ya confirmadas.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">3. Políticas de Cancelación y Reembolso</h2>
                            <p className="mb-2">Entendemos que los planes pueden cambiar. Nuestras políticas son:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Cancelaciones con más de 48 horas de anticipación:</strong> Reembolso del 100% del monto pagado (menos gastos administrativos bancarios).</li>
                                <li><strong>Cancelaciones entre 24 y 48 horas de anticipación:</strong> Reembolso del 50% del monto pagado.</li>
                                <li><strong>Cancelaciones con menos de 24 horas o No-Show:</strong> No habrá lugar a reembolso.</li>
                                <li>En caso de cancelación por parte de la agencia debido a condiciones climáticas adversas (cierre de puerto) o fuerza mayor, se ofrecerá reprogramación o reembolso total.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">4. Responsabilidad y Seguridad</h2>
                            <p>
                                La agencia actúa como intermediaria y operadora. Si bien tomamos todas las precauciones para garantizar la seguridad de nuestros pasajeros:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 mt-2">
                                <li>Los pasajeros deben seguir estrictamente las instrucciones de los guías y capitanes.</li>
                                <li>La agencia no se hace responsable por pérdida de objetos personales durante los tours.</li>
                                <li>Es responsabilidad del cliente contar con las condiciones de salud adecuadas para realizar las actividades (ej. paseos en lancha).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">5. Modificaciones del Itinerario</h2>
                            <p>
                                Los itinerarios pueden sufrir variaciones sin previo aviso por orden de la Capitanía de Puerto, condiciones climáticas o razones operativas que garanticen la seguridad de los pasajeros. Haremos nuestro mejor esfuerzo para ofrecer alternativas de igual o mayor valor.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">6. Propiedad Intelectual</h2>
                            <p>
                                Todo el contenido de este sitio web (textos, imágenes, logos, diseño) es propiedad de BlueOcean Paracas Tours y está protegido por las leyes de derechos de autor. Queda prohibida su reproducción sin autorización expresa.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">7. Ley Aplicable</h2>
                            <p>
                                Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia será sometida a la jurisdicción de los jueces y tribunales de la ciudad de Pisco/Ica.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
