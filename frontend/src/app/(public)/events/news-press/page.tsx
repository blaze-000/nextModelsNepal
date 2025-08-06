"use client";

import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";
import { motion } from "framer-motion";

export default function NewsPress() {
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
        title="News and Press"
        searchPlaceholder="Search events, winners, judges"
      />
      <div className="w-full bg-background py-4 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
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
      </div>
    </>
  );
}
