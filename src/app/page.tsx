import Contact from "@/components/sections/Contact";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import Tours from "@/components/sections/Tours";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import OurProcess from "@/components/sections/OurProcess";
import FAQ from "@/components/sections/FAQ";
import InstagramFeed from "@/components/sections/InstagramFeed";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyChooseUs />
      <Tours limit={3} showButton={true} /> {/* <-- MODIFICADO */}
      <OurProcess />
      <Gallery />
      <InstagramFeed />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
  );
}