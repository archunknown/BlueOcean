import Contact from "@/components/sections/Contact";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import Tours from "@/components/sections/Tours";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurProcess from "@/components/sections/OurProcess";
import FAQ from "@/components/sections/FAQ";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { getGalleryImages } from "@/services/gallery";
import { getAllTours } from "@/services/tours";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [galleryImages, tours] = await Promise.all([
    getGalleryImages(),
    getAllTours()
  ]);

  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <Tours tours={tours} limit={3} showButton={true} />
      <OurProcess />
      <Gallery images={galleryImages} />
      <InstagramFeed />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}
