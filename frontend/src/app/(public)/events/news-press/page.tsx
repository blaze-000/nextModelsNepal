"use client";

import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import Dropdown from "@/components/ui/Dropdown";
import Image from "next/image";

export default function NewsPress() {
  const [sortBy, setSortBy] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("All");

  const [sortOptions, setSortOptions] = useState<string[]>([]);

  const [years, setYears] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const [newsItems, setNewItems] = useState<NewsItem[] | null>(null);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get("/api/news");
        const data: NewsItem[] = res.data.data;
        setNewItems(data);

        console.log(data)

        // Type Options
        setSortOptions([
          "All",
          ...Array.from(new Set(data.map((item) => String(item.type)))),
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
                ?.map((item) => item.event?.name)
                .filter((name): name is string => !!name)
            )
          ),
        ]);
      } catch (error) {
        console.error("Error fetching news items:", error);
      }
    })();
  }, []);
  const filteredNews = newsItems
    ?.filter((item) => {
      if (sortBy !== "All" && item.type !== sortBy) return false;
      if (selectedEvent !== "All" && item.event?.name !== selectedEvent)
        return false;
      if (selectedYear !== "All" && item.year !== selectedYear) return false;
      return true;
    })
    .sort((a, b) => Number(b.year) - Number(a.year));

  return (
    <>
      <Breadcrumb
        searchText={searchText}
        setSearchText={setSearchText}
        title="News and Press"
        searchPlaceholder="Search news"
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

          {/* showing  search  results  for ... */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
            {filteredNews
              ?.filter(
                (x) =>
                  x.title.toLowerCase().includes(searchText.toLowerCase()) ||
                  x.description.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((item) => (
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
