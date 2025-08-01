"use client";

import { Winners } from "@/components/events/winners";
import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";
import { motion } from "framer-motion";

export default function PastEvents() {
  const newsItems = [
    {
      id: 1,
      image: "/news_1.jpg",
      title: "Mister. Nepal",
      description:
        "Next Models Nepal leads Nepal’s fashion and entertainment scene—discovering talent, creating iconic events, and shaping industry trends.",
      link: "#",
    },
    {
      id: 2,
      image: "/news_1.jpg",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
    {
      id: 3,
      image: "/news_1.jpg",
      title:
        "Bivash Bista and Neha Budha Crowned Winners of Model Hunt Nepal Season 9",
      description:
        "Our recent fashion show made headlines, showcasing Nepal's emerging talent pool in the modeling industry.",
      link: "#",
    },
    {
      id: 4,
      image: "/news_1.jpg",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
  ];

  return (
    <>
      <Breadcrumb
        title="Past Events"
        searchPlaceholder="Search events, winners, judges"
      />
      <div className="w-full bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
            {newsItems.map((item) => (
              <motion.div
                key={item.id}
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
                  buttonText={`About ${item.title}`}
                />
              </motion.div>
            ))}
          </div>

          {/* See All Button */}
          <div className="hidden md:flex justify-end">
            <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
              <span className="underline">See All Past Events</span>
              <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-light" />
            </button>
          </div>
        </div>

        {/* Winners Section */}
        <Winners />
      </div>
    </>
  );
}
