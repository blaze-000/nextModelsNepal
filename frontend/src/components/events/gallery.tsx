"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

import MasonryGallery from "../molecules/masonary-gallery";
import SectionHeader from "../ui/section-header";

const winnerImages = [
  "/handshake.jpg",
  "/events_1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/handshake.jpg",
  "/events_1.jpg",
  "/events_1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/mr-nepal-2025-poster-1.jpg",
  "/handshake.jpg",
  "/events_1.jpg",
];

export const Gallery = () => {
  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center -mb-4">
            <SectionHeader title="Gallery" />

            <div className="pb-8">
              <Button variant="outline" className="py-2 mr-4">
                <span>Events:</span>
                <span>Miss Nepal Peace</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
              <Button variant="outline" className="py-2">
                <span>Year:</span>
                <span>2024</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/small_star.svg"
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

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="py-2 min-w-0 text-xs">
                <span>Events:</span>
                <span></span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
              <Button variant="outline" className="py-2 min-w-0 text-xs">
                <span>Year:</span>
                <span>2024</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
            </div>
          </div>
        </motion.div>

        <MasonryGallery images={winnerImages} />

        {/* See More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
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
