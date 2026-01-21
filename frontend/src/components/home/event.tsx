"use client";

import Axios from "@/lib/axios-instance";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import EventCard from "../molecules/event-card";
import Timeline from "../molecules/timeline";

// Static events data
const STATIC_EVENTS: TimelineEvent[] = [
    {
        eventName: "Miss Nepal Peace 2026",
        season: {
            slug: "miss-nepal-peace-2026",
            startDate: "2026-01-19",
            endDate: "2026-02-26",
            status: "upcoming",
        },
        overview: "Miss Nepal Peace is a prestigious national platform dedicated exclusively to empowering nurses and nursing students of Nepal. The pageant celebrates compassion, leadership, confidence, and the vital role nurses play in building a peaceful and healthy society.",
        coverImage: "/miss-nepal-peace-2026.jpg",
        managedBy: "self",
        useLocalImage: true,
    },
    {
        eventName: "IEC Designers Runway-15",
        season: {
            slug: "iec-designers-runway-15",
            startDate: "2026-01-31",
            endDate: "2026-04-10",
            status: "upcoming",
        },
        overview: "IEC Designers Runway returns with its 15th edition, continuing its legacy as one of Nepal's most prestigious fashion platforms. A celebration of creativity, innovation, and professional excellence, bringing together the country's leading designers, top models, and fashion influencers on one grand stage.",
        coverImage: "/iec-designers-runway-15.jpg",
        managedBy: "self",
        useLocalImage: true,
    },
];

const EventsSection = () => {
    const [events, SetEvents] = useState<TimelineEvent[] | null>(null);

    useEffect(() => {
        (async () => {
            const res = await Axios.get('/api/events/timeline');
            const data = res.data;
            SetEvents(data.data);
        })();
    }, [])

    // Combine static events with API events (static events first)
    const allEvents = events ? [...STATIC_EVENTS, ...events] : STATIC_EVENTS;

    const selfEvents = allEvents.filter(event => event.managedBy === "self");
    const partnerEvents = allEvents.filter(event => event.managedBy === "partner");

    return (
        <section className="bg-[#19160D] pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-6">
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
                        <div className=" relative hidden md:block">
                            <Image
                                src="/relive-the-glamour-title-image.png"
                                alt=""
                                width={160}
                                height={80}
                                className=" w-20 h-8 md:w-40 md:h-16 rounded-full object-cover border border-stone-300"
                                priority
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
                        {selfEvents?.map((event, i) => (
                            <motion.div
                                key={event.season.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                            >
                                <EventCard
                                    title={event.eventName}
                                    slug={event.season.slug}
                                    date={`${formatDate(event.season.startDate)} to ${formatDate(event.season.endDate)}`}
                                    overview={event.overview}
                                    coverImage={event.coverImage}
                                    state={event.season.status}
                                    manageBy={event.managedBy}
                                    getTicketLink={event.season.getTicketLink}
                                    timelinePosition="left"
                                    useLocalImage={event.useLocalImage}
                                    aboutLink={event.useLocalImage ? "#" : undefined}
                                />
                            </motion.div>
                        ))}
                    </Timeline>

                    {/* Timeline for partner-managed events */}
                    <Timeline position="right" title="Partner Events">
                        {partnerEvents?.map((event, i) => (
                            <motion.div
                                key={event.season.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                            >
                                <EventCard
                                    title={event.eventName}
                                    slug={event.season.slug}
                                    date={`${formatDate(event.season.startDate)} to ${formatDate(event.season.endDate)}`}
                                    overview={event.overview}
                                    coverImage={event.coverImage}
                                    state={event.season.status}
                                    manageBy={event.managedBy}
                                    timelinePosition="right"
                                    useLocalImage={event.useLocalImage}
                                    aboutLink={event.useLocalImage ? "#" : undefined}
                                />
                            </motion.div>
                        ))}
                    </Timeline>
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
