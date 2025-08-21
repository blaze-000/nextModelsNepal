"use client";

import { Winners } from "@/components/events/winners";
import EventBox from "@/components/molecules/event-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Dropdown from "@/components/ui/Dropdown";
import Image from "next/image";

type PastEvents = {
  _id: string;
  name: string;
  overview?: string;
  season: { year: number; endDate: string; slug: string };
  image: string;

  latestEndedSeasonSlug: string;
};

export default function PastEvents() {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [pastEvents, setPastEvents] = useState<PastEvents[] | null>(null);
  const [searchText, setSearchText] = useState("");
  const sortOptions = ["Most Recent", "Oldest"];

  const sortEvents = (events: PastEvents[], sortType: string) => {
    if (!events) return [];

    const filtered = events.filter((event) => {
      const nameMatch = `${event.name} ${event.season.year}`
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      const overviewMatch = event.overview
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      return nameMatch || overviewMatch;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.season.endDate).getTime();
      const dateB = new Date(b.season.endDate).getTime();

      return sortType === "Oldest" ? dateA - dateB : dateB - dateA;
    });
  };

  const sortedEvents = sortEvents(pastEvents || [], sortBy);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get("/api/events/past-events");
        const data = res.data;
        console.log("Past Events:", data.data);
        setPastEvents(data.data);
      } catch (err) {
        console.log("Failed to fetch past events", err);
      }
    })();
  }, []);

  return (
    <>
      <Breadcrumb
        title="Past Events"
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Search past events"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between mt-5 items-center mb-10">
          <h2 className="hidden md:block text-xl md:text-3xl font-newsreader mb-4 md:mb-0 md:ml-12">
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

        {/* Search indicator */}
        {searchText !== "" && (
          <div className="flex items-center mb-6">
            <Image
              src="/svg-icons/small_star.svg"
              alt=""
              height={20}
              width={20}
              className="inline-block mr-2 h-5 w-5 bg-cover"
            />
            <p className="text-2xl font-newsreader">
              Searching for:{" "}
              <span className="text-gold-500">&ldquo;{searchText}&rdquo;</span>
            </p>
          </div>
        )}

        {/* Events List */}
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
                slug={item.season.slug}
                image={normalizeImagePath(item.image)}
                title={item.name}
                desc={item.overview || ""}
                buttonText={`About ${item.name}`}
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
