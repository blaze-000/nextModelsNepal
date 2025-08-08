"use client";
import Image from "next/image";
import React from "react";
import PartnerScroller from "./../molecules/scroller";
import { motion } from "framer-motion";

const partners = [
  { name: "1", image: "/partners/img1.png" },
  { name: "2", image: "/partners/img2.png" },
  { name: "3", image: "/partners/img3.png" },
  { name: "4", image: "/partners/img4.png" },
  { name: "5", image: "/partners/img5.png" },
  { name: "6", image: "/partners/img6.png" },
  { name: "7", image: "/partners/img7.png" },
  { name: "8", image: "/partners/img8.png" },
  { name: "9", image: "/partners/img9.png" },
];

const OurPartners = () => {
  return (
    <section className="w-full py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 pb-10"
      >
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start gap-3 font-newsreader">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-tight text-center md:text-left relative">
            Our Strategic
            <Image
              src="/star.svg"
              alt=""
              width={30}
              height={0}
              className=" absolute w-5 h-5 animate-bounce-slow -right-6 top-0"
            />
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src="/handshake.jpg"
              alt=""
              width={187}
              height={80}
              className="rounded-[38px] w-36 h-16 object-cover hidden md:flex"
            />
            <p className="text-gold-500 text-5xl md:text-6xl font-light tracking-tighter">
              Partners
            </p>
          </div>
        </div>

        {/* Right Description */}
        <p className="text-base md:text-right text-center max-w-md font-light font-urbanist">
          The Creative Forces Behind Iconic Campaigns: Celebrating the Partners Who
          Drive Success for Leading Brands
        </p>
      </motion.div>

      {/* Scrolling Logos */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
      >
        <PartnerScroller partners={partners} speed={200} />
      </motion.div>
    </section>

  );
};

export default OurPartners;
