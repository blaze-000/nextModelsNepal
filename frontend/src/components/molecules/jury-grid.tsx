"use client";
import React from "react";
import Image from "next/image";
import { normalizeImagePath } from "@/lib/utils";

const JuryGrid: React.FC<JuryGridProps> = ({ winners, children }) => {
  return (
    <div className="space-y-8">
      {/* Desktop Grid */}
      <div className="hidden xl:grid lg:grid-cols-4 gap-6 ">
        {winners?.map((winner: Jury, index: number) => (
          <div
            key={index}
            className="relative bg-white overflow-hidden group transition-transform"
          >
            <Image
              src={normalizeImagePath(winner.image)}
              alt="winner"
              width={400}
              height={0}
              className="w-full h-80 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              {children(winner)}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="xl:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth">
        <div className="flex space-x-6 w-max px-6">
          {winners?.map((winner: Jury, index: number) => (
            <div
              key={index}
              className="relative overflow-hidden group w-[75vw] max-w-xs  snap-start shrink-0"
            >
              <Image
                className="w-full h-80 object-cover object-top [mask:linear-gradient(to_top,transparent_0%,black_30%)]"
                src={normalizeImagePath(winner.image)}
                alt="winner"
                width={300}
                height={0}
              />
              <div className="absolute bottom-6 left-6 right-6">
                {children(winner)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JuryGrid;
