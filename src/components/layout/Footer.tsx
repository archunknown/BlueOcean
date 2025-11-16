// src/components/layout/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-oceanBlue text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Blue Ocean Adventure Tours. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}