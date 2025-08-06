"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function EventDetails() {
  const { slug } = useParams();

  const timelineData = [
    {
      date: "19th July to 2nd August",
      title: "Auditions",
      icon: "ri-mic-line",
      position: "up",
    },
    {
      date: "3rd August to 16th August",
      title: "Training",
      icon: "ri-graduation-cap-line",
      position: "down",
    },
    {
      date: "17th August",
      title: "Grand Finale",
      icon: "ri-trophy-line",
      position: "up",
    },
  ];

  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="h-[40vh] md:h-[80vh] bg-black bg-cover bg-center relative"
        style={{ backgroundImage: "url('/events_1.jpg')" }}
      >
        {/* Gradient mask */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden md:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
            <span>Miss Nepal</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span>Peace</span>
              <Image
                src="/handshake.jpg"
                alt="Handshake"
                width={160}
                height={64}
                className="h-16 w-40 rounded-full object-cover hidden md:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
            </div>
          </h2>

          <p className="mt-2 text-2xl max-w-lg text-white font-light">
            DEDICATED TO NURSING FRATERNITY
          </p>
        </div>
      </motion.section>

      {/* Texts Mobile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="flex md:hidden py-30 bg-black"
      >
        <div className="text-center px-6">
          <h2 className="text-6xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-8">
            Miss Nepal
          </h2>

          <p>DEDICATED TO NURSING FRATERNITY</p>
        </div>
      </motion.section>

      <section className="w-full pb-16 mdplus:pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2 flex justify-center items-end">
              <Image
                src="/events/miss_nepal.png"
                alt="Event Overview"
                width={400}
                height={400}
                className="w-full max-w-md h-auto rounded-lg shadow-md object-cover ml-auto"
              />
            </div>

            <div className="lg:order-1 flex flex-col justify-end gap-10">
              <div className="flex items-center gap-2">
                <Image
                  src="/small_star.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
                <h3 className="text-white text-xl font-medium font-newsreader tracking-tight">
                  Overview
                </h3>
              </div>
              <p className="text-base font-light leading-relaxed">
                Miss Nepal Peace is a national beauty pageant exclusively for
                nursing students and professionals, promoting the theme
                &rdquo;Empowered Women, Strong Nation.&rdquo; Organized by Next
                Models Nepal and supported by the Nepal Breast Cancer
                Foundation, it aims to empower women in healthcare through
                training, leadership, and public service. Winners earn
                scholarships, cash prizes, and chances to represent Nepal
                internationally.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-[#100D08] pb-12 mdplus:pt-12 ">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-6xl font-newsreader text-white text-center tracking-tighter ">
            Celebrating the strength, compassion, and leadership of women in
            healthcare — because empowered nurses nurture a nation&rsquo;s
            well-being.
          </h3>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="w-full bg-background2 pb-24 mdplus:pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image */}
            <div className="flex justify-center lg:justify-start pr-20">
              <Image
                src="/events_1.jpg"
                alt="Purpose Image"
                width={581}
                height={645}
                className="w-full h-full max-w-md lg:max-w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-12">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Image
                  src="/small_star.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
                <h3 className="text-white text-xl font-medium font-newsreader tracking-tight">
                  Purpose
                </h3>
              </div>

              {/* Description */}
              <p className="text-base font-light leading-relaxed">
                Miss Nepal Peace is a national beauty pageant exclusively for
                nursing students and professionals, promoting the theme
                &rdquo;Empowered Women, Strong Nation.&rdquo; Organized by Next
                Models Nepal and supported by the Nepal Breast Cancer
                Foundation, it aims to empower women in healthcare through
                training, leadership, and public service. Winners earn
                scholarships, cash prizes, and chances to represent Nepal
                internationally.
              </p>
            </div>
          </div>
        </div>

        {/* /* Timeline */}
        <section className="w-full pb-24 mdplus:pt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col w-full justify-center item-center space-y-8">
              <div className="flex items-center justify-center gap-2 ">
                <Image
                  src="/small_star.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
                <h3 className="text-white text-xl font-medium font-newsreader tracking-tight">
                  Event Timeline
                </h3>
              </div>
              <div className="text-base text-center flex item-center justify-center mx-auto max-w-3xl">
                A journey designed to elevate you. From auditions to the grand
                finale, each phase of this event is crafted to help you grow,
                gain exposure, and shine. It&rsquo;s more than a
                timeline—it&rsquo;s your path to becoming the next standout name
                in modeling.
              </div>
            </div>
          </div>
        </section>

        <div className="w-full relative px-4 overflow-hidden pt-40 pb-40">
          {/* Base horizontal line */}
          <div className="absolute w-full top-1/2 -translate-y-1/2 h-0.5 bg-white z-0 " />

          {/* Timeline container */}
          <div className="flex justify-center gap-4 w-full z-10 max-w-7xl mx-auto">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex justify-center flex-1">
                {/* Card */}
                <div
                  className={`absolute ${
                    item.position === "up" ? "top-[-160px]" : "top-[40px]"
                  } w-100 pt-6 px-6 pb-8 bg-muted-background shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <i className={`${item.icon} text-xl text-gold-500`}></i>

                    {/* Date and Title Stack */}
                    <div className="flex flex-col gap-2">
                      <p className="text-lg font-medium text-gold-500">
                        {item.date}
                      </p>
                      <h3 className="text-2xl font-newsreader font-normal text-white">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Dots and yellow segment */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-1">
                  {/* Left dot */}
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />

                  {/* Yellow line segment */}
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gold-500 z-0 " />

                  {/* Right dot */}
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
