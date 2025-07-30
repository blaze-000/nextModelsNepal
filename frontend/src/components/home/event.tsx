"use client";

import Image from "next/image";
import Timeline from "../molecules/timeline";
import EventCard from "../molecules/event-card";

const EventsSection = () => {
  // Sample event data
  const events = [
    {
      id: "miss-nepal-peace-2024",
      title: "Miss Nepal Peace",
      dateSpan: "19th July to 6th September",
      briefInfo:
        "Miss Nepal Peace is a pageant for honest, celebrating their role in care and peace while empowering them to represent Nepal on global stage.",
      imageSrc: "/events_1.jpg",
      state: "ongoing" as const,
      columnPosition: "left" as const,
      managedBy: "self" as const,
      getTicketLink: "https://example.com/tickets",
      aboutLink: "https://example.com/about",
    },
    {
      id: "fashion-week-2024",
      title: "Nepal Fashion Week",
      dateSpan: "15th August to 20th August",
      briefInfo:
        "A spectacular showcase of Nepalese fashion talent, bringing together designers, models, and fashion enthusiasts from across the region.",
      imageSrc: "/events_1.jpg",
      state: "completed" as const,
      columnPosition: "right" as const,
      managedBy: "partner" as const,
      getTicketLink: "https://example.com/fashion-tickets",
      aboutLink: "https://example.com/fashion-about",
    },
  ];

  return (
    <section className="bg-gold-500/5 py-20 md:py-16  w-full lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="md:space-y-2">
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
              <p className="text-white text-base  font-normal md:font-light md:tracking-tight">
                Step into the spotlight of our most recent event — where talent
                <br className="hidden md:block" />
                <span className="md:hidden"> </span>
                meets opportunity and dreams take center stage
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div> {/* Timeline with Events - Left Position */}
        <Timeline position="left" title="Events by Next Models Nepal">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              dateSpan={event.dateSpan}
              briefInfo={event.briefInfo}
              imageSrc={event.imageSrc}
              state={event.state}
              columnPosition={event.columnPosition}
              timelinePosition="left"
              managedBy={event.managedBy}
              getTicketLink={event.getTicketLink}
              aboutLink={event.aboutLink}
            />
          ))}
        </Timeline></div>

       <div> {/* Example of Right-positioned Timeline */}
        <Timeline position="right" title="Partner Events">
          <EventCard
            id="partner-event-1"
            title="International Beauty Contest"
            dateSpan="1st October to 15th October"
            briefInfo="A global beauty pageant featuring contestants from around the world."
            imageSrc="/events_1.jpg"
            state="ongoing"
            columnPosition="right"
            timelinePosition="right"
            managedBy="partner"
            getTicketLink="https://partner.com/tickets"
            aboutLink="https://partner.com/about"
          />
        </Timeline></div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
