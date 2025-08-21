"use client";

import Image from "next/image";
import  { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/section-header";
import EventBox from "../molecules/event-box";
import Dropdown from "../ui/Dropdown";
import Axios from "@/lib/axios-instance";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils";

type UpcomingEvent = {
  _id: string;
  eventId: { _id: string; name: string; overview: string };
  image: string;
  slug: string;
  year: string;
  startDate: string;
  latestEndedSeasonSlug: string;
};

export const UpcomingEvents = ({ searchText }: { searchText: string }) => {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[] | null>(
    null
  );
  const sortOptions = ["Most Recent", "Oldest"];
  const sortEvents = (events: UpcomingEvent[], sortType: string) => {
    if (!events) return [];

    // Filter events based on search text
    const filtered = events.filter((event) => {
      if (!searchText) return true;

      const nameMatch = event.eventId.name?.toLowerCase().includes(searchText.toLowerCase());
      const overviewMatch = event.eventId.overview?.toLowerCase().includes(searchText.toLowerCase());
      const yearMatch = event.year?.toString().includes(searchText);

      return nameMatch || overviewMatch || yearMatch;
    });

    return [...filtered].sort((a, b) => {
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
        console.log(data.data);
        // Show all upcoming events when searching, otherwise limit to 2
        setUpcomingEvents(searchText ? data.data : data.data.slice(0, 2));
      } catch (err) {
        console.log("Failed to fetch upcoming events", err);
      }
    })();
  }, [searchText]);

  // Don't render the section if searching and no results
  if (searchText && sortedEvents.length === 0) {
    return null;
  }

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
            <div className="flex items-center justify-center gap-2 pb-5">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-4 h-4 rounded-full"
              />
              <h3 className="text-white text-xl font-normal font-newsreader ">
                Upcoming Events
              </h3>
            </div>

            <div className="flex justify-center pb-5">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                selected={sortBy}
                onSelect={setSortBy}
              />
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        {sortedEvents.length > 0 && (
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
                  slug={item.latestEndedSeasonSlug}
                  image={normalizeImagePath(item.image)}
                  title={item.eventId.name}
                  desc={item.eventId.overview}
                  buttonText={`About ${item.eventId.name}`}
                  status="upcoming"
                  seasonId={item._id}
                />
              </motion.div>
            ))}
          </div>
        )}



        {/* See All Button */}
        {!searchText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-end mt-8"
          >
            <Link
              href="/events/upcoming-events"
              className="py-4 md:mb-8 lg:mb-0 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-auto"
            >
              <span className="underline underline-offset-4">
                See All Upcoming events
              </span>
              <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};
