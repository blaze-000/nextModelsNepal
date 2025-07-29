import HeroSection from "@/components/home/hero";
import ValuesSection from "@/components/home/value";
import EventsSection from "@/components/home/event";
import UpcomingEventSection from "@/components/home/upcoming-event";
import ModelsPortfolioSection from "@/components/home/models-portfolio";
import CTASection from "@/components/home/cta";
import NewsSection from "@/components/home/newsAndCoverage";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValuesSection />
      <EventsSection />
      <UpcomingEventSection />
      <ModelsPortfolioSection />
      <CTASection />
      <NewsSection />
    </>
  );
}