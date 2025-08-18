"use client";

import { Winners } from "@/components/events/winners";
import EventBox from "@/components/molecules/event-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Dropdown from "@/components/ui/Dropdown";

type PastEvents = {
  _id: string;
  eventId: { _id: string; name: string; overview: string };
  image: string;
  slug: string;
  year: string;
  startDate: string;
  latestEndedSeasonSlug: string;
};

export default function PastEvents() {
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
    <>
      <Breadcrumb title="Past Events" searchPlaceholder="Search past events" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mt-5 items-center mb-10">
          <h2 className="hidden md:block text-xl md:text-3xl font-Newsreader mb-4 md:mb-0 md:ml-12">
            Events
          </h2>
          <div className="w-full md:w-50 flex justify-center md:justify-end mr-0 md:mr-12">
            <Dropdown
              label="Sort By"
              options={sortOptions}
              selected={sortBy}
              onSelect={setSortBy}
            />
          </div>
        </div>

        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {sortedEvents?.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <EventBox
                slug={item.latestEndedSeasonSlug}
                image={normalizeImagePath(item.image)}
                title={item.eventId.name}
                desc={item.eventId.overview}
                buttonText={`About ${item.eventId.name}`}
                status="ended"
              />
            </motion.div>
          ))}
        </div>

        {/* Winners always visible */}
        <Winners />
      </div>
    </>
  );
}
