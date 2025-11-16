import Contact from "@/components/sections/Contact";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import Testimonials from "@/components/sections/Testimonials";
import Tours from "@/components/sections/Tours";

export default function Home() {
  return (
    <main>
      <Hero />
      <Tours />
      <Gallery />
      <Testimonials />
      <Contact />
    </main>
  );
}