"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import MasonryGallery from "../molecules/masonary-gallery";
import SectionHeader from "../ui/section-header";
import Dropdown from "../ui/Dropdown";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

type EndedEvent = {
  eventId: string;
  eventName: string;
  years: number[];
};

type GalleryData = {
  latestGallery: {
    eventId: string;
    eventName: string;
    year: number;
    gallery: string[];
  };
  eventsWithEndedSeasons: EndedEvent[];
};

export const Gallery = () => {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [latestGallery, setLatestGallery] = useState<string[]>([]);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [latestEventData, setLatestEventData] = useState<{
    eventName: string;
    year: number;
  } | null>(null);

  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [eventMap, setEventMap] = useState<{ [label: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get<{ data: GalleryData }>(
          "/api/events/gallery/latest"
        );
        const data = res.data.data;
        console.log(data);

        setLatestGallery(data.latestGallery.gallery);
        setFilteredImages(data.latestGallery.gallery);
        setLatestEventData({
          eventName: data.latestGallery.eventName,
          year: data.latestGallery.year,
        });

        // Years
        const allYears = [
          ...new Set(data.eventsWithEndedSeasons.flatMap((x) => x.years)),
        ]
          .sort((a, b) => b - a)
          .map(String);
        setYears(allYears);

        // Events
        const labels = data.eventsWithEndedSeasons.map((e) => e.eventName);
        const map: { [label: string]: string } = {};
        data.eventsWithEndedSeasons.forEach((e) => {
          map[e.eventName] = e.eventId;
        });

        setEventTypes(labels);
        setEventMap(map);
      } catch (err) {
        console.error("Failed to fetch gallery data", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!selectedEvent && !selectedYear) {
        setFilteredImages(latestGallery);
        return;
      }

      try {
        let url = "/api/events/gallery";

        if (selectedEvent && selectedYear) {
          url += `/${selectedEvent}/${selectedYear}`;
        } else if (selectedEvent) {
          url += `/${selectedEvent}`;
        } else if (selectedYear) {
          url += `/year/${selectedYear}`;
        }

        const res = await Axios.get<{ data: { gallery: string[] } }>(url);
        setFilteredImages(res.data.data.gallery || []);
      } catch (err) {
        console.error("Error fetching filtered images:", err);
        setFilteredImages([]);
      }
    };

    fetchFilteredData();
  }, [selectedEvent, selectedYear, latestGallery]);

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center ">
            <SectionHeader title="Gallery" />
            <div className="pb-8 flex items-center space-x-4">
              <Dropdown
                label="Event"
                options={eventTypes}
                selected={
                  selectedEvent
                    ? Object.keys(eventMap).find(
                        (k) => eventMap[k] === selectedEvent
                      ) || ""
                    : latestEventData
                    ? `${latestEventData.eventName} `
                    : ""
                }
                onSelect={(label) => setSelectedEvent(eventMap[label] || "")}
              />

              <Dropdown
                label="Year"
                options={years}
                selected={
                  selectedYear ||
                  (latestEventData ? String(latestEventData.year) : "")
                }
                onSelect={setSelectedYear}
                maxHeight="180px"
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4 pb-10">
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
                Highlights
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-5">
              <Dropdown
                label="Event"
                options={eventTypes}
                selected={
                  selectedEvent
                    ? Object.keys(eventMap).find(
                        (k) => eventMap[k] === selectedEvent
                      ) || ""
                    : ""
                }
                onSelect={(label) => setSelectedEvent(eventMap[label] || "")}
              />
              <Dropdown
                label="Year"
                options={years}
                selected={selectedYear}
                onSelect={setSelectedYear}
                maxHeight="180px"
              />
            </div>
          </div>
        </motion.div>

        {filteredImages.length > 0 ? (
          <MasonryGallery
            images={filteredImages.map((img) => normalizeImagePath(img))}
          />
        ) : (
          <div className="text-center py-12 text-gray-400">
            No images found for the selected filters.
          </div>
        )}

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mt-12"
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
