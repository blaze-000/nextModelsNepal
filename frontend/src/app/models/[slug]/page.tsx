"use client";

import { useParams } from "next/navigation";
import React from "react";
import SectionHeader from "@/components/ui/section-header";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ModelPage() {
  const winnerImages = [
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/events_1.jpg",
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

          {/* Pinterest-Style Responsive Masonry Gallery */}
          <div className="pt-4 pb-12">
            {/* Mobile: Single column */}
            <div className="block sm:hidden space-y-4">
              {winnerImages.map((imagePath, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    <Image
                      src={imagePath}
                      alt={`Gallery image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-105"
                      sizes="100vw"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tablet: 2 columns */}
            <div className="hidden sm:block lg:hidden">
              <div className="columns-2 gap-4">
                {winnerImages.map((imagePath, index) => (
                  <motion.div
                    key={index}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                      <Image
                        src={imagePath}
                        alt={`Gallery image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-105"
                        style={{ maxHeight: "800px" }}
                        sizes="50vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Desktop: 3 columns */}
            <div className="hidden lg:block xl:hidden">
              <div className="columns-3 gap-4">
                {winnerImages.map((imagePath, index) => (
                  <motion.div
                    key={index}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.03 }}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                      <Image
                        src={imagePath}
                        alt={`Gallery image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-105"
                        style={{ maxHeight: "800px" }}
                        sizes="33vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Large Desktop: 4 columns */}
            <div className="hidden xl:block">
              <div className="columns-4 gap-4">
                {winnerImages.map((imagePath, index) => (
                  <motion.div
                    key={index}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.02 }}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
                      <Image
                        src={imagePath}
                        alt={`Gallery image ${index + 1}`}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-105"
                        style={{ maxHeight: "800px" }}
                        sizes="25vw"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
