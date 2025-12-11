import { createClient } from '@/utils/supabase/server'
import SectionHeader from '@/components/ui/SectionHeader'
import TestimonialsContent from './TestimonialsContent'

export default async function Testimonials() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  return (
    <section className="overflow-hidden bg-lightGray pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Historias Reales de Aventureros"
          subtitle={
            <>
              <span className="font-bold text-yellow-500">4.9/5</span> basado en clientes felices
            </>
          }
        />

        <TestimonialsContent testimonials={testimonials || []} />
      </div>
    </section>
  )
}