import Contact from "@/components/sections/Contact";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import Tours from "@/components/sections/Tours";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurProcess from "@/components/sections/OurProcess";
import FAQ from "@/components/sections/FAQ";
import InstagramFeed from "@/components/sections/InstagramFeed";
import { ToursService, GalleryService } from "@/services/tours";

export default async function Home() {
  // Fetch data on the server
  const tours = await ToursService.getAll();
  const galleryImages = await GalleryService.getAll();

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