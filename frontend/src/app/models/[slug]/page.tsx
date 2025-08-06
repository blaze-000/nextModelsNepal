"use client";

import { useParams } from "next/navigation";
import React from "react";
import SectionHeader from "@/components/ui/section-header";
import Image from "next/image";
import { motion } from "framer-motion";
import MasonryGallery from "@/components/molecules/masonary-gallery";

export default function ModelPage() {
  const winnerImages = [
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/handshake.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
  ];
  const { slug } = useParams();

  return (
    <main>
      <section className="w-full bg-black">
        <div className="grid border grid-cols-[1.3fr_1fr]">
          {/* Texts Desktop */}
          <div className="pl-36">
            <div className="flex-col justify-center h-full px-6">
              {/* Back Button */}
              <button className="text-gold-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer mb-8">
                <i className="ri-arrow-left-line text-lg" />
                <span className="underline underline-offset-2 text-base font-medium tracking-tight">
                  back
                </span>
              </button>
              <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
                <span>Monika Adhikary</span>
              </h2>
              <p className="mt-6  text-base text-white font-light">
                Meet Monika Adhikary, the embodiment of style and charisma.
                Monika Adhikary is a rising star in the modeling world, known
                for her captivating presence on the runway and in front of the
                camera. With a unique blend of versatility and charm, continues
                to leave a lasting impression in the fashion industry. Stay
                tuned for more from this promising talent as she paves her way
                to the top.
              </p>
            </div>
          </div>
          {/* Right Column - Full width background image */}
          <div
            className="relative col-span-1 h-auto bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/events_1.jpg')",
            }}
          ></div>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Gallery" />

          {/* Gallery using the reusable component */}
          <MasonryGallery images={winnerImages} />
        </div>
      </section>
    </main>
  );
}
