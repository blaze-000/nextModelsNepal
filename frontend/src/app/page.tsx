import HeroSection from "@/components/home/hero";
import ValuesSection from "@/components/home/value";
import EventsSection from "@/components/home/event";
import UpcomingEventSection from "@/components/home/upcoming-event";
import ModelsPortfolioSection from "@/components/home/models-portfolio";
import CTASection from "@/components/home/cta";
import NewsSection from "@/components/home/newsAndCoverage";
import ContactForm from "@/components/home/contact-form";
import Testimonials from "@/components/home/testimonials";
import OurPartners from "@/components/home/our-partners";

export default function Home() {
  return (
    <main>
      {/* <HeroSection /> */}
      <ValuesSection />
      <EventsSection />
      <UpcomingEventSection />
      <ModelsPortfolioSection />
      <CTASection />
      <Testimonials />
      <OurPartners />
      <ContactForm />
      <NewsSection />
    </main>
  );
}