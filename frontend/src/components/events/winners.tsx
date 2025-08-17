"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ModelGrid from "../molecules/model-grid";
import { motion } from "framer-motion";
import SectionHeader from "../ui/section-header";
import Dropdown from "../ui/Dropdown";

export const Winners = () => {
  const [sortBy, setSortBy] = useState("Most Recent");

  const sortOptions = ["Popularity", "Most Recent", "Oldest"];
  const models = [
    {
      tag: "Winner",
      name: "Monika Adhikary",
      designation: "Miss Nepal Peace 2024",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monika",
    },
    {
      tag: "1st Runner Up",
      name: "Anisha Parajuli",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/anisha",
    },
    {
      tag: "2nd Runner Up",
      name: "Pala Regmi",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/pala",
    },
    {
      tag: "Nurse With a purpose",
      name: "Monika Thapa Magar",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monikathapa",
    },
  ];

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          {/* Desktop Layout - No Changes */}
          <div className="hidden md:flex justify-between items-center">
            <SectionHeader title="Winners from Past Events" />

            <div className="flex  pb-5 gap-4">
              <Dropdown
                options={sortOptions}
                selected={sortBy}
                onSelect={(val) => setSortBy(val)}
              />
              <Dropdown
                options={sortOptions}
                selected={sortBy}
                onSelect={(val) => setSortBy(val)}
              />
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

            {/* Responsive Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="py-2 min-w-0 text-xs">
                <span>Sort By:</span>
                <span></span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
              <Button variant="outline" className="py-2 min-w-0 text-xs">
                <span>Sort By:</span>
                <span>Most </span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Model Grid */}
        <ModelGrid models={models}>
          {(model) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {model.tag && (
                <div
                  className={`${
                    model.tag.toLowerCase() === "winner"
                      ? "text-gold-500"
                      : "text-white"
                  } text-base font-bold flex items-center gap-1 pb-2`}
                >
                  <i
                    className={`ri-vip-crown-line text-base ${
                      model.tag === "Winner" ? "text-gold-500" : "text-white"
                    }`}
                  />
                  {model.tag}
                </div>
              )}
              <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                {model.name}
              </h4>
              <p className="text-white text-base font-light tracking-wider">
                {model.designation}
              </p>
            </motion.div>
          )}
        </ModelGrid>
      </div>
    </div>
  );
};
