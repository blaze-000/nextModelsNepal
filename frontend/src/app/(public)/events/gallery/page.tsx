"use client";

import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useState } from "react";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import Dropdown from "@/components/ui/Dropdown";
import { motion } from "framer-motion";

export default function Gallery() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedEvent, setSelectedEvent] = useState("Mr.Nepal");

  const years = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
  ];
  const eventTypes = ["Miss Nepal Peace", "Mr.Nepal", "Model Hunt Nepal"];

  const winnerImages = [
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/events_1.jpg",
    "/news_1.jpg",
  ];

  return (
    <>
      <Breadcrumb
        title="Events Highlights Gallery"
        searchPlaceholder="Search events, winners, judges"
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center pb-5 pt-5 md:space-x-4 space-y-4 md:space-y-0">
            <Dropdown
              label="Event"
              options={eventTypes}
              selected={selectedEvent}
              onSelect={setSelectedEvent}
            />
            <Dropdown
              label="Year"
              options={years}
              selected={selectedYear}
              onSelect={setSelectedYear}
              maxHeight="180px"
            />
          </div>
        </motion.div>

        <MasonryGallery images={winnerImages} />
      </div>
    </>
  );
}
