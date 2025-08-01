"use client";

import Breadcrumb from "@/components/molecules/breadcumb";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function NewsPress() {
  const winnerImages = [
    "/winners/winner1.jpg",
    "/winners/winner2.jpg",
    "/winners/winner3.jpg",
    "/winners/winner4.jpg",
    "/winners/winner5.jpg",
    "/winners/winner6.jpg",
  ];

  return (
    <>
      <Breadcrumb
        title="Events Highlights Gallery"
        searchPlaceholder="Search events, winners, judges"
      />
      <div className="w-full bg-background pb-24 mdplus:pt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Masonry Gallery */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 pt-4 pb-12">
            {winnerImages.map((imagePath, index) => (
              <motion.div
                key={index}
                className="break-inside-avoid mb-4 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-transform duration-300 hover:scale-105">
                  <Image
                    src={imagePath}
                    alt={`Winner ${index + 1}`}
                    width={400}
                    height={600}
                    className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
                    style={{
                      aspectRatio:
                        index % 3 === 0
                          ? "3/6"
                          : index % 3 === 1
                            ? "4/5"
                            : "2/3",
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="secondary" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
