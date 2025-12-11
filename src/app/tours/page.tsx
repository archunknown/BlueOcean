// src/app/tours/page.tsx
import ToursSection from '@/components/sections/Tours';
import { getAllTours } from '@/services/tours';

export const dynamic = 'force-dynamic';

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <main>
      <ToursSection tours={tours} showButton={false} />
    </main>
  );
}