// src/app/tours/page.tsx
import ToursSection from '@/components/sections/Tours';
import { ToursService } from '@/services/tours';

export default async function ToursPage() {
  const tours = await ToursService.getAll();

  return (
    <main>
      <ToursSection tours={tours} showButton={false} />
    </main>
  );
}