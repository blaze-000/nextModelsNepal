"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

const winnerImages = [
  "/winners/winner1.jpg",
  "/winners/winner2.jpg",
  "/winners/winner3.jpg",
  "/winners/winner4.jpg",
  "/winners/winner5.jpg",
  "/winners/winner6.jpg",
  // Add more image paths as needed
];

export const Gallery = () => {
  return (
    <div className="w-full bg-background pb-24 pt-20 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title & Sort Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 flex items-center gap-2">
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

        {/* Masonry Gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 pt-4 pb-12">
          {winnerImages.map((imagePath, index) => (
            <div
              key={index}
              className="break-inside-avoid mb-4 group cursor-pointer "
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-transform duration-300 hover:scale-105 ">
                <Image
                  src={imagePath}
                  alt={`Winner ${index + 1}`}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
                  style={{
                    // Random aspect ratios for masonry effect
                    aspectRatio:
                      index % 3 === 0 ? "3/6" : index % 3 === 1 ? "4/5" : "2/3",
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
