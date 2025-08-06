"use client";

import Image from "next/image";
import Timeline from "../molecules/timeline";
import EventCard from "../molecules/event-card";
import { motion } from "framer-motion";

const EventsSection = () => {
  // Sample event data (aligned with new EventCard)
  const events = [
    {
      id: "1",
      title: "Miss Nepal Peace",
      slug: 'dummy',
      startDate: "19th July",
      endDate: "6th September",
      briefInfo:
        "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
      imageSrc: "/events_1.jpg",
      state: "ongoing" as const,
      managedBy: "self" as const,
      getTicketLink: "https://example.com/tickets",
      aboutLink: "https://example.com/about",
    },
    {
      id: "2",
      title: "Nepal Fashion Week",
      slug: 'dummy',
      startDate: "15th August",
      endDate: "20th August",
      briefInfo:
        "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
      imageSrc: "/events_1.jpg",
      state: "ended" as const,
      managedBy: "partner" as const,
      getTicketLink: "https://example.com/fashion-tickets",
      aboutLink: "https://example.com/fashion-about",
    },
    {
      id: "3",
      title: "International Beauty Contest",
      slug: 'dummy',
      startDate: "1st October",
      endDate: "15th October",
      briefInfo: "A global beauty pageant featuring contestants from around the world.",
      imageSrc: "/events_1.jpg",
      state: "ongoing" as const,
      managedBy: "partner" as const,
      getTicketLink: "https://partner.com/tickets",
      aboutLink: "https://partner.com/about",
    },
    {
      id: "4",
      title: "National Model Hunt",
      slug: 'dummy',
      startDate: "10th June",
      endDate: "30th June",
      briefInfo:
        "Discovering the next faces of fashion through a competitive and glamorous national talent hunt.",
      imageSrc: "/events_1.jpg",
      state: "ended" as const,
      managedBy: "self" as const,
      getTicketLink: "https://example.com/model-tickets",
      aboutLink: "https://example.com/model-about",
    },
  ];

  const selfEvents = events.filter(event => event.managedBy === "self");
  const partnerEvents = events.filter(event => event.managedBy === "partner");

  return (
    <section className="bg-gold-500/5 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
          className="mb-16 md:space-y-2">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
            <span className="text-white text-4xl md:text-5xl font-extralight font-newsreader md:tracking-tight">
              Relive the
            </span>
            <div className="w-20 h-8 md:w-40 md:h-16 relative hidden md:block">
              <Image
                src="/span-image.jpg"
                alt="Badge"
                fill
                className="rounded-full object-cover border border-stone-300"
              />
            </div>
            <span className="text-white text-4xl md:text-5xl font-extralight font-newsreader md:tracking-tight">
              Glamour:
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <h3 className="text-primary text-5xl md:text-6xl font-extralight font-newsreader tracking-tight">
              with Our Recent Events
            </h3>
            <p className="text-white text-base font-normal md:font-light md:tracking-tight">
              Step into the spotlight of our most recent event — where talent
              <br className="hidden md:block" />
              <span className="md:hidden"> </span>
              meets opportunity and dreams take center stage
            </p>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Timeline for self-managed events */}
          <Timeline position="left" title="Events by Next Models Nepal">
            {selfEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <EventCard {...event} timelinePosition="left" />
              </motion.div>
            ))}
          </Timeline>

          {/* Timeline for partner-managed events */}
          <Timeline position="right" title="Partner Events">
            {partnerEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
              >
                <EventCard {...event} timelinePosition="right" />
              </motion.div>
            ))}
          </Timeline>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
