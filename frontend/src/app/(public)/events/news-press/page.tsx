"use client";

import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import Dropdown from "@/components/ui/Dropdown";

export default function NewsPress() {
  const [sortBy, setSortBy] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("All");
  // const sortOptions = ["Interview", "Feature", "Announcement", "All"];
  // const years = ["2025", "2024", "2023"];
  // const eventTypes = [
  //   "All ",
  //   "Miss Nepal Peace",
  //   "Mr.Nepal",
  //   "Model Hunt Nepal",
  // ];

  const [sortOptions, setSortOptions] = useState<string[]>([]);

  const [years, setYears] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const [newsItems, setNewItems] = useState<NewsItem[] | null>(null);

  const fetchNewsItems = async () => {
    try {
      const res = await Axios.get("/api/news");
      const data = res.data.data;
      setNewItems(data);

      // Type Options
      setSortOptions([
        ...Array.from(new Set(data.map((item) => String(item.type)))),
        "All",
      ]);

      // Year Options
      setYears([
        "All",
        ...Array.from(new Set(data.map((item) => String(item.year)))).sort(
          (a, b) => Number(b) - Number(a)
        ),
      ]);

      // Event Options (filter out undefined)
      setEventTypes([
        "All",
        ...Array.from(
          new Set(
            data
              .map((item) => item.event?.name)
              .filter((name): name is string => !!name)
          )
        ),
      ]);
    } catch (error) {
      console.error("Error fetching news items:", error);
    }
  };

  useEffect(() => {
    fetchNewsItems();
  }, []);
const filteredNews = newsItems
  ?.filter((item) => {
    if (sortBy !== "All" && item.type !== sortBy) return false;
    if (selectedEvent !== "All" && item.event?.name !== selectedEvent) return false;
    if (selectedYear !== "All" && item.year !== selectedYear) return false;
    return true;
  })
  .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <>
      <Breadcrumb
        title="News and Press"
        searchPlaceholder="Search events, winners, judges"
      />
      <div className="w-full bg-background py-4 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap  justify-center gap-5 px-2 mb-6">
            <Dropdown
              label="Type"
              options={sortOptions}
              selected={sortBy}
              onSelect={(val) => setSortBy(val)}
            />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
            {filteredNews?.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <ImageBox
                  image={item.image}
                  title={item.title}
                  desc={item.description}
                  link={item.link}
                  buttonText="View News Source"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
