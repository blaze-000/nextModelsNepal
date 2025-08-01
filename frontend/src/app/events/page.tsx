import { Gallery } from "@/components/events/gallery";
import EventHero from "@/components/events/hero";
import { NewsSection } from "@/components/events/news-section";
import { PastEvents } from "@/components/events/past-events";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { Winners } from "@/components/events/winners";

export default function Events() {
  return (
    <main>
      <EventHero />
      <PastEvents />
      <Winners />
      <Gallery />
      <UpcomingEvents />
      <NewsSection />
    </main>
  );
}
