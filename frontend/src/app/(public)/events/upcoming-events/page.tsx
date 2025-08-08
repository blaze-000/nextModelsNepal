"use client";

import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function upcomingEvents() {
  const upcomingEvents = [
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
        title="Upcoming Events"
        searchPlaceholder="Search upcoming Events"
      />
      <div className="w-full bg-background py-4 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {upcomingEvents.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <article className="h-full bg-stone-900 flex flex-col justify-between overflow-hidden hover:bg-stone-800 transition-colors duration-300 p-6 md:p-6">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Image
                    width={0}
                    height={0}
                    src={item.image}
                    alt={item.title}
                    sizes="100vw"
                    className="w-full h-48 md:h-72 lg:h-72 object-cover object-top scale-110 hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="pt-4 md:pt-4 pr-2 md:pr-4">
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-base lg:text-base leading-relaxed font-semibold text-white mb-3 md:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base font-light text-white/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
