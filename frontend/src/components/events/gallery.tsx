"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import MasonryGallery from "../molecules/masonary-gallery";
import SectionHeader from "../ui/section-header";
import Dropdown from "../ui/Dropdown";

const winnerImages = [
  "/handshake.jpg",
  "/events_1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/handshake.jpg",
  "/events_1.jpg",
  "/events_1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/handshake.jpg",
  "/events_1.jpg",
];

export const Gallery = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedEvent, setSelectedEvent] = useState("All Events");

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

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center -mb-4">
            <SectionHeader title="Gallery" />

            <div className="pb-8 flex items-center space-x-4 ml-[-20px]">
              <div className="">
                <Dropdown
                  label="Event"
                  options={eventTypes}
                  selected={selectedEvent}
                  onSelect={setSelectedEvent}
                />
              </div>
              <div className="">
                <Dropdown
                  label="Year"
                  options={years}
                  selected={selectedYear}
                  onSelect={setSelectedYear}
                  maxHeight="180px"
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4">
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
                Gallery
              </h3>
            </div>

            <div className="flex flex-wrap justify-center space-x-4">
              <div className="w-36">
                <Dropdown
                  label="Event"
                  options={eventTypes}
                  selected={selectedEvent}
                  onSelect={setSelectedEvent}
                />
              </div>
              <div className="w-28">
                <Dropdown
                  label="Year"
                  options={years}
                  selected={selectedYear}
                  onSelect={setSelectedYear}
                  maxHeight="500px"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <MasonryGallery images={winnerImages} />

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <Link
            href={"/events/gallery"}
            className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="underline underline-offset-4">
              See More of our gallery
            </span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
