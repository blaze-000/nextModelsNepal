"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

type HeroData = {
  maintitle: string;
  subtitle: string;
  description: string;
  images: string[];
};

const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/hero");
        setHeroData(response.data.data[0]);
      } catch (error) {
        console.error("Failed to fetch hero data:", error);
      }
    };

    fetchHero();
  }, []);

  if (!heroData) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <section className="bg-gradient-to-b from-background2 to-background w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2 pt-8 lg:pt-20 lg:pb-[7.5rem] -mb-8 md:mb-0"
          >
            <div className="self-stretch justify-center">
              <span className="text-white text-2xl leading-loose tracking-wide">
                We are{" "}
              </span>
              <span className="text-gold-500 text-2xl font-normal leading-loose tracking-wide">
                {heroData.subtitle}
              </span>
            </div>

            <div className="space-y-2 text-6xl md:text-7xl lg:text-8xl">
              <div>
                <span className="text-white font-extralight font-newsreader tracking-tighter">
                  {heroData.maintitle}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="w-40 h-16 relative">
                  <Image
                    src="/span-image.jpg"
                    alt="badge"
                    fill
                    className="rounded-full object-cover border border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-40 h-16 rounded-full border-2 border-gold-500" />
              </div>
            </div>

            <p className="text-white text-base leading-relaxed font-light pt-6">
              {heroData.description}
            </p>

            <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-10 lg:items-center pt-4">
              <Link href="/models">
                <Button variant="default" className="px-9 py-4 group">
                  Hire a model{" "}
                  <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                </Button>
              </Link>
              <Link
                href="/events/upcoming-events"
                className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="underline underline-offset-4">
                  Upcoming Events
                </span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>

          {/* Right Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full relative overflow-hidden py-32 md:py-0"
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-6 w-[80%] max-w-[390px] aspect-square z-10 relative mx-auto">
              {heroData.images.map((imgUrl, index) => {
                // Fix Windows backslashes and prefix with backend URL
                const fixedUrl = `http://localhost:8000/${imgUrl.replace(/\\/g, "/")}`;

                return (
                  <div key={index} className="relative overflow-hidden rounded-xl">
                    <Image
                      src={fixedUrl}
                      alt={`Hero image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      unoptimized // Disable Next.js image optimization for backend images
                    />
                  </div>
                );
              })}

              {/* Decorative lines */}
              <div className="absolute -left-[50%] -top-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] top-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] -bottom-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -left-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] left-1/2 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -right-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Image
                src="/small_star.svg"
                alt="Decorative Star"
                width={25}
                height={25}
                priority
                className="h-14 w-14 object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
