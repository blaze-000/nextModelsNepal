"use client";

// import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EventBox from "@/components/molecules/event-box";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

type UpcomingEvent = {
  _id: string,
  eventId: { _id: string, name: string, overview: string },
  image: string,
  slug: string,
  year: string,
  startDate: string,
  latestEndedSeasonSlug: string,
};

export default function upcomingEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[] | null>(null);

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
    <>
      <Breadcrumb
        title="Upcoming Events"
        searchPlaceholder="Search upcoming Events"
      />
      <div className="w-full bg-background py-4 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {upcomingEvents?.map((item) => (
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
                status="upcoming"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
