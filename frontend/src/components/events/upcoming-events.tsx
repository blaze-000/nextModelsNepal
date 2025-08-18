"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import SectionHeader from "../ui/section-header";
import EventBox from "../molecules/event-box";
import Dropdown from "../ui/Dropdown";
import Axios from "@/lib/axios-instance";

type UpcomingEvent = {
  _id: string;
  eventId: { _id: string; name: string; overview: string };
  image: string;
  slug: string;
  year: string;
  startDate: string;
  latestEndedSeasonSlug: string;
  description: string;
  title: string;
};

export const UpcomingEvents = () => {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[] | null>(
    null
  );
  const sortOptions = ["Most Recent", "Oldest"];
  const sortEvents = (events: UpcomingEvent[], sortType: string) => {
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

  const sortedEvents = sortEvents(upcomingEvents || [], sortBy);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get("/api/season/upcoming");
        const data = res.data;
        console.log(data);
        setUpcomingEvents(data.data);
      } catch (err) {
        console.log("Failed to fetch upcoming events", err);
      }
    })();
  }, []);

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center px-2">
            <SectionHeader title="Upcoming Events" />

            <Dropdown
              label="Sort By"
              options={sortOptions}
              selected={sortBy}
              onSelect={(val) => setSortBy(val)}
            />
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4 px-2">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-4 h-4 rounded-full"
              />
              <h3 className="text-white text-xl font-normal font-newsreader">
                Upcoming Events
              </h3>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="py-2 min-w-0">
                <span>Sort By:</span>
                <span>Most Recent</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {sortedEvents?.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <EventBox
                slug={item.slug}
                image={item.image}
                title={item.title}
                desc={item.description}
                buttonText={`About ${item.title}`}
                status="upcoming"
              />
            </motion.div>
          ))}
        </div>

        {/* See All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end mt-8"
        >
          <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <span className="underline">See All Upcoming Events</span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-light" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
