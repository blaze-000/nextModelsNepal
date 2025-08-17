"use client";

// import ImageBox from "@/components/molecules/image-box";
import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";
import { motion } from "framer-motion";
import EventBox from "@/components/molecules/event-box";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function upcomingEvents() {
  const upcomingEvents = [
    {
      id: 1,
      image: "/news_1.jpg",
      title: "Mister. Nepal",
      description:
        "Next Models Nepal leads Nepal’s fashion and entertainment scene—discovering talent, creating iconic events, and shaping industry trends.",
      slug: "#",
    },
    {
      id: 2,
      image: "/news_1.jpg",
      title: "Miss Nepal",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      slug: "#",
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
              <EventBox
                slug={item.slug}
                image={item.image}
                title={item.title}
                desc={item.description}
                buttonText="Learn More"
                status="upcoming"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
