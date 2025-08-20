import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

const HeroSection = () => {
  const [data, setData] = useState<HeroData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get("/api/hero");
        const data = res.data;
        setData(data.data[0]);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

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
            {/* We are Next Models Nepal */}
            <div className="self-stretch justify-center text-xl xs:text-2xl leading-loose tracking-wide">
              <span className="text-foreground">We are </span>
              <span className="text-gold-500 font-normal">
                Next Models Nepal
              </span>
            </div>
            {/* Nepal's No.1 <Image> Modeling Agency <box> */}
            <div className="space-y-2 text-5xl xs:text-6xl md:text-7xl lg:text-8xl">
              <div>
                <span className="text-white font-extralight font-newsreader tracking-tighter">
                  Nepal&rsquo;s{" "}
                </span>
                <span className="text-gold-500 font-extralight font-newsreader tracking-tighter">
                  No.1
                </span>
              </div>
              <div className="flex items-center gap-4 pt-4">
                {/* Badge image with soft layered shadow */}
                <div className=" relative">
                    <Image
                      src={normalizeImagePath(data?.titleImage)}
                      alt=""
                      priority
                      width={160}
                      height={64}
                      className="w-20 p400:w-24 sm:w-40 h-16 rounded-full object-cover border border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
                    />
                </div>
                {/* Label */}
                <span className="text-white font-extralight font-newsreader tracking-tighter leading-px">
                  Modeling
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-extralight font-newsreader tracking-tighter italic pt-4 pr-2">
                  Agency
                </span>
                {/* Empty oval outline */}
                <div className="w-40 h-16 rounded-full border-2 border-gold-500" />
              </div>
            </div>
            {/* Description */}
            <p className="text-white text-base leading-relaxed font-light pt-6">
              Next Models Nepal is a team of seasoned professionals dedicated to
              talent management, elite training, and launching aspiring models.
            </p>
            {/* Buttons */}
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-10 lg:items-center pt-4">
              <Link href="/models">
                <Button variant="default" className="px-9 py-4 group">
                  Hire a model{" "}
                  <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
                </Button>
              </Link>
              <Link
                href="/events/upcoming-events"
                className="px-4 py-4 md:mb-8 lg:mb-0 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="underline underline-offset-4">
                  Upcoming Events
                </span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full relative overflow-x-hidden overflow-y-hidden py-32 md:py-0"
          >
            {/* 2x2 image grid */}
            <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-6 w-[80%] max-w-[390px] aspect-square z-10 relative">
              {[data?.image_1, data?.image_2, data?.image_3, data?.image_4].map(
                (imageSource, index) =>
                  imageSource ? (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl"
                    >
                      <Image
                        src={normalizeImagePath(imageSource)}
                        alt="Featured Images"
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl bg-gray-700 flex items-center justify-center"
                    >
                      <i className="ri-image-line text-gray-500 text-lg"></i>
                    </div>
                  )
              )}

              {/* Background grid lines */}
              <div className="absolute -left-[50%] -top-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] top-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] -bottom-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -left-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] left-1/2 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -right-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            </div>

            {/* Center decorative element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
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
