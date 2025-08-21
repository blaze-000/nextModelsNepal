"use client";

import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useEffect, useState } from "react";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import Dropdown from "@/components/ui/Dropdown";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Image from "next/image";

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

export default function Gallery() {
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
  const [searchText, setSearchText] = useState("");

  // Fetch initial gallery + available events/years
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Axios.get<{ data: GalleryData }>(
          "/api/events/gallery/latest"
        );
        const data = res.data.data;

        setLatestGallery(data.latestGallery.gallery);
        setFilteredImages(data.latestGallery.gallery);
        setLatestEventData({
          eventName: data.latestGallery.eventName,
          year: data.latestGallery.year,
        });

        // Extract + sort years (latest first)
        const allYears = [
          ...new Set(data.eventsWithEndedSeasons.flatMap((x) => x.years)),
        ]
          .sort((a, b) => b - a)
          .map(String);
        setYears(allYears);

        // Extract events + map eventName → eventId
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

  // Fetch images when filters change
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
    <>
      <Breadcrumb
        title="Events Highlights Gallery"
        searchText={searchText}
        setSearchText={setSearchText}
        searchPlaceholder="Search events highlights"
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
          {searchText !== "" && (
            <div className="flex ">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                height={20}
                width={20}
                className="inline-block mr-2 h-5 w-5 bg-cover"
              />

              <p className=" text-2xl pb-5  font-newsreader">
                Searching for:{" "}
                <span className="text-gold-500">
                  &ldquo;{searchText}&rdquo;
                </span>
              </p>
            </div>
          )}
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
      </div>
    </>
  );
}
