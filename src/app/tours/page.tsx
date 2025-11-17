// src/app/tours/page.tsx
import ToursSection from '@/components/sections/Tours';

export default function ToursPage() {
  return (
    <main>
      <ToursSection showButton={false} /> {/* <-- MODIFICADO */}
    </main>
  );
}