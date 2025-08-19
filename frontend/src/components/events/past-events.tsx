"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { motion } from "framer-motion";
import SectionHeader from "../ui/section-header";
import EventBox from "../molecules/event-box";
import Dropdown from "../ui/Dropdown";
import Link from "next/link";
import Axios from "@/lib/axios-instance";

type PastEvents = {
  _id: string;
  eventId: { _id: string; name: string; overview: string };
  image: string;
  slug: string;
  year: string;
  startDate: string;
  latestEndedSeasonSlug: string;
};

export const PastEvents = () => {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [pastEvents, setPastEvents] = useState<PastEvents[] | null>(null);
  const sortOptions = ["Most Recent", "Oldest"];
  const sortEvents = (events: PastEvents[], sortType: string) => {
    if (!events) return [];

    return [...events].sort((a, b) => {
      switch (sortType) {
        case "Oldest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        case "Most Recent":
        default:
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
      }
    });
  };

  const sortedEvents = sortEvents(pastEvents || [], sortBy);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get("/api/season/pastevents");
        const data = res.data;
        console.log(data);
        setPastEvents(data.data);
      } catch (err) {
        console.log("Failed to fetch past events", err);
      }
    })();
  }, []);
  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
          className="text-center"
        >
          {/* Desktop Title */}
          <div className="hidden md:block font-extralight">
            <div className="text-5xl font-newsreader text-white mb-1 flex items-center justify-center gap-2.5">
              <span>Moments</span>
              <Image
                src="/span-image.jpg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-32 h-16 rounded-full border border-stone-300 mb-3"
              />
              <span>in the Making:</span>
            </div>
            <div className="text-6xl font-newsreader tracking-tighter text-gold-500">
              Past Triumphs & Upcoming
            </div>
            <div className="text-6xl font-newsreader tracking-tighter text-gold-500 mb-4">
              Experiences
            </div>
          </div>

          {/* Mobile Title */}
          <div className="block md:hidden">
            <div className="text-4xl font-light font-newsreader text-white tracking-wide">
              Moments in the
            </div>
            <div className="text-4xl font-light font-newsreader text-white mb-4 tracking-wide">
              Making:
            </div>
            <div className="text-5xl font-light font-newsreader tracking-tighter text-gold-500 mb-2">
              Past Triumphs &
            </div>
            <div className="text-5xl font-light font-newsreader tracking-tighter text-gold-500 mb-2">
              Upcoming
            </div>
            <div className="text-5xl font-light font-newsreader tracking-tighter text-gold-500">
              Experiences
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="px-2"
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center py-5">
            <SectionHeader title="Past Events" />
            <Dropdown
              label="Sort By"
              options={sortOptions}
              selected={sortBy}
              onSelect={(val) => setSortBy(val)}
            />
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="block md:hidden space-y-6 pb-5 pt-5">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-8 h-8 rounded-full"
              />
              <h3 className="text-white text-2xl font-normal font-newsreader">
                Past Events
              </h3>
            </div>
            <div className="flex justify-center">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                selected={sortBy}
                onSelect={(val) => setSortBy(val)}
              />
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {sortedEvents.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <EventBox
                status="ended"
                image={item.image}
                title={item.eventId.name}
                desc={item.eventId.overview}
                slug={item.slug}
                buttonText={`About ${item.eventId.name}`}
              />
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <div className="hidden md:flex justify-end">
          <Link
            href="/events/past-events"
            className="py-4 md:mb-8 lg:mb-0 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span className="underline underline-offset-4">
              See All Past Events
            </span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
          </Link>
        </div>
      </div>
    </div>
  );
};
