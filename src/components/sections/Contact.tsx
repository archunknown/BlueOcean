// src/components/sections/Contact.tsx
export default function Contact() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-oceanBlue mb-8">Contáctanos</h2>
        <div className="max-w-2xl mx-auto">
          <form className="bg-white p-8 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-oceanBlue"
                placeholder="Tu nombre"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-oceanBlue"
                placeholder="tu@email.com"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-oceanBlue"
                placeholder="Escribe tu mensaje aquí..."
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-oceanBlue text-white font-bold py-3 px-6 rounded-lg hover:bg-turquoise transition-colors"
              >
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}