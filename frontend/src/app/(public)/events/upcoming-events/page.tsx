"use client";

import Breadcrumb from "@/components/molecules/breadcumb";
import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import EventBox from "@/components/molecules/event-box";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Dropdown from "@/components/ui/Dropdown";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

type UpcomingEvent = {
  _id: string;
  eventId: { _id: string; name: string; overview: string, coverImage: string};
  image: string;
  slug: string;
  year: string;
  startDate: string;
  latestEndedSeasonSlug: string;
};

export default function UpcomingEvent() {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [searchText, setSearchText] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[] | null>(
    null
  );
  const sortOptions = ["Most Recent", "Oldest"];
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const sortEvents = (events: UpcomingEvent[], sortType: string) => {
    if (!events) return [];

    const filtered = events.filter(
      (event) =>
        event.eventId.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (event.eventId.overview &&
          event.eventId.overview
            .toLowerCase()
            .includes(searchText.toLowerCase()))
    );

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
        setIsLoading(false)
        console.log(data);
        setUpcomingEvents(data.data);
      } catch (err) {
        console.log("Failed to fetch upcoming events", err);
      }
    })();
  }, []);

  return (
    <>
      <Breadcrumb
        title="Upcoming Events"
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Search upcoming Events"
      />
      {isLoading ? (
        <div className=" h-[40vh]">
          <Spinner size={48} color="#ffaa00" />
        </div>
      ) : (
        <div className="w-full bg-background py-4 md:py-20">
          <div className="max-w-7xl mx-auto  px-6">
            {searchText !== "" && (
              <div className="flex items-center mb-6">
                <Image
                  src="/svg-icons/small_star.svg"
                  alt=""
                  height={20}
                  width={20}
                  className="inline-block mr-2 h-5 w-5 bg-cover"
                />

                <p className="text-xl sm:text-2xl font-newsreader">
                  Searching for:{" "}
                  <span className="text-gold-500">
                    &ldquo;{searchText}&rdquo;
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-wrap  justify-center gap-5 px-2 mb-6">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                selected={sortBy}
                onSelect={setSortBy}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
              {sortedEvents && sortedEvents.length > 0 ? (
                sortedEvents.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <EventBox
                      slug={item.latestEndedSeasonSlug}
                      image={normalizeImagePath(item.eventId.coverImage)}
                      title={item.eventId.name}
                      desc={item.eventId.overview}
                      buttonText={`About ${item.eventId.name}`}
                      status="upcoming"
                      seasonId={item._id}
                      className="h-full"
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-7">
                  <p className="text-2xl font-semibold">
                    No results found for &ldquo;{searchText}&rdquo;
                  </p>
                  <p className="mt-1 text-gray-400">
                    Try searching for different keywords.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
