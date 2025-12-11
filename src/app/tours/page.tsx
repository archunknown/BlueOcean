// src/app/tours/page.tsx
import ToursSection from '@/components/sections/Tours';
import { getAllTours } from '@/services/tours';

export const revalidate = 3600;

export default async function ToursPage() {
  const tours = await getAllTours();

  return (
    <main>
      <ToursSection tours={tours} showButton={false} />
    </main>
  );
}