import Hero from "@/components/Hero";
import LandingNavbar from "@/components/LandingNavbar";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <LandingNavbar />
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}