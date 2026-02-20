import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
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
                    <h1 className="text-3xl font-black text-blue-900 mb-2">Política de Privacidad</h1>
                    <p className="text-gray-500 mb-8 text-sm">Última actualización: 19 de Febrero, 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">1. Introducción</h2>
                            <p>
                                En <strong>BlueOcean Paracas Tours</strong>, valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos y resguardamos su información cuando utiliza nuestro sitio web y servicios de reserva.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">2. Información que Recopilamos</h2>
                            <p className="mb-2">Podemos recopilar la siguiente información cuando realiza una reserva o se pone en contacto con nosotros:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Información Personal:</strong> Nombre completo, número de documento (DNI/Pasaporte), nacionalidad.</li>
                                <li><strong>Información de Contacto:</strong> Dirección de correo electrónico y número de teléfono.</li>
                                <li><strong>Datos de la Reserva:</strong> Fechas de viaje, preferencias de tours y requisitos especiales.</li>
                                <li><strong>Datos de Pago:</strong> Los pagos son procesados de forma segura a través de Mercado Pago. Nosotros no almacenamos los datos completos de su tarjeta de crédito.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">3. Uso de la Información</h2>
                            <p className="mb-2">Utilizamos sus datos para:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Procesar y confirmar sus reservas de tours.</li>
                                <li>Enviarle su voucher electrónico y detalles importantes del viaje.</li>
                                <li>Comunicarnos con usted en caso de cambios de itinerario o emergencias.</li>
                                <li>Mejorar nuestros servicios y la funcionalidad del sitio web.</li>
                                <li>Cumplir con regulaciones locales de turismo y seguridad (ej. reportes a Capitanía de Puerto).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">4. Protección de Datos</h2>
                            <p>
                                Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra el acceso no autorizado, la pérdida o la alteración. Utilizamos protocolos de encriptación (SSL) para la transmisión de datos sensibles.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">5. Compartir Información</h2>
                            <p>
                                No vendemos ni alquilamos sus datos a terceros. Solo compartimos su información con proveedores de servicios esenciales (como operadores de lanchas o autoridades portuarias) estrictamente para la ejecución del servicio contratado.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">6. Cookies</h2>
                            <p>
                                Este sitio puede utilizar cookies para mejorar su experiencia de navegación. Puede configurar su navegador para rechazar todas las cookies, aunque esto podría limitar ciertas funcionalidades de la web.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-blue-900 mb-3">7. Contacto</h2>
                            <p>
                                Si tiene preguntas sobre esta política o desea ejercer sus derechos de acceso, rectificación o eliminación de sus datos, contáctenos en:
                                <br />
                                <strong>Email:</strong> contacto@blueoceanparacas.com
                                <br />
                                <strong>Dirección:</strong> Paracas, Ica, Perú.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
