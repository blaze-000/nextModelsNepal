"use client";

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../ui/section-header";
import Dropdown from "../ui/Dropdown";
import Axios from "@/lib/axios-instance";
import WinnerGrid from "../molecules/winners-grid";
import { Spinner } from "../ui/spinner";

export const Winners = () => {
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("All Events");
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await Axios.get("/api/events/past-winners");
        const data = res.data;
        console.log(data);
        setWinners(data.data.slice(0,4) || []);
      } catch (err) {
        console.log("Failed to fetch winners data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  
  const years = useMemo(() => {
    const uniqueYears = [...new Set(winners.map(winner => winner.year))].sort((a, b) => b - a);
    return ["All", ...uniqueYears.map(year => year.toString())];
  }, [winners]);

  const events = useMemo(() => {
    const uniqueEvents = [...new Set(winners.map(winner => winner.eventName))].sort();
    return ["All Events", ...uniqueEvents];
  }, [winners]);

  
  const filteredWinners = useMemo(() => {
    let filtered = [...winners];

    // Filter by year
    if (selectedYear !== "All") {
      filtered = filtered.filter(winner => winner.year.toString() === selectedYear);
    }

    // Filter by event
    if (selectedEvent !== "All Events") {
      filtered = filtered.filter(winner => winner.eventName === selectedEvent);
    }

  
    filtered.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      
      
      const rankOrder = { "Winner": 1, "1st Runner Up": 2, "2nd Runner Up": 3 };
      const aRank = rankOrder[a.rank as keyof typeof rankOrder] || 4;
      const bRank = rankOrder[b.rank as keyof typeof rankOrder] || 4;
      
      return aRank - bRank;
    });

    return filtered;
  }, [winners, selectedYear, selectedEvent]);

  if (loading) {
    return (
      <div className="w-full bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white">
            <Spinner size={100} color="#ffaa00"/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          <div className="hidden md:flex justify-between items-center">
            <SectionHeader title="Winners from Past Events" />

            <div className="pb-8 flex items-center space-x-4 ml-[-20px]">
              <div className="">
                <Dropdown
                  label="Event"
                  options={events}
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
            {/* Title - Centered */}
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-4 h-4 rounded-full"
              />
              <h3 className="text-white text-xl font-normal font-newsreader tracking-wide">
                Winners from Past Events
              </h3>
            </div>

            {/* Mobile Dropdowns */}
            <div className="flex flex-wrap justify-center gap-4 pb-10 pt-5">
              <Dropdown
                label="Event"
                options={events}
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
          </div>
        </motion.div>

        {/* Winner Grid */}
        {filteredWinners.length > 0 ? (
          <WinnerGrid winners={filteredWinners}>
            {(winner) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {winner.rank && (
                  <div
                    className={`${
                      winner.rank.toLowerCase() === "winner"
                        ? "text-gold-500"
                        : "text-white"
                    } text-base font-bold flex items-center gap-1 pb-2`}
                  >
                    <i
                      className={`ri-vip-crown-line text-base ${
                        winner.rank === "Winner" ? "text-gold-500" : "text-white"
                      }`}
                    />
                    {winner.rank}
                  </div>
                )}
                <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                  {winner.name}
                </h4>
                <p className="text-white text-base font-light tracking-wider">
                  {winner.eventName} • {winner.year}
                </p>
              </motion.div>
            )}
          </WinnerGrid>
        ) : (
          <div className="text-center text-white py-8">
            No winners found for the selected criteria
          </div>
        )}
      </div>
    </div>
  );
};
