"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import ModelGrid from "@/components/molecules/model-grid";
import PartnerScroller from "@/components/molecules/scroller";
import SectionHeader from "@/components/ui/section-header";
import MasonryGallery from "@/components/molecules/masonary-gallery";

export default function EventDetails() {
  const { slug } = useParams();

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

  const winnerImages = [
    "/winners/winner1.jpg",
    "/winners/winner2.jpg",
    "/winners/winner3.jpg",
    "/winners/winner4.jpg",
    "/winners/winner5.jpg",
    "/winners/winner6.jpg",
  ];

  const models = [
    {
      tag: "Winner",
      name: "Monika Adhikary",
      designation: "Miss Nepal Peace 2024",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monika",
    },
    {
      tag: "1st Runner Up",
      name: "Anisha Parajuli",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/anisha",
    },
    {
      tag: "2nd Runner Up",
      name: "Pala Regmi",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/pala",
    },
    {
      tag: "Nurse With a purpose",
      name: "Monika Thapa Magar",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monikathapa",
    },
    {
      tag: "2nd Runner Up",
      name: "Pala Regmi",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/pala",
    },
    {
      tag: "Nurse With a purpose",
      name: "Monika Thapa Magar",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monikathapa",
    },
  ];

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

  // Reusable motion props
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.6 },
  };

  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        {...fadeInUp}
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
        {...fadeInUp}
        className="flex justify-center md:hidden py-12 bg-black"
      >
        <div className="text-center px-6">
          <h2 className="text-6xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-2">
            <div>Miss Nepal</div>
            <div>Peace</div>
          </h2>
          <p>DEDICATED TO NURSING FRATERNITY</p>
        </div>
      </motion.section>

      {/* Overview Section */}
      <section className="w-full py-12 lg:pb-16 mdplus:pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="lg:order-2 flex justify-center items-end">
              <Image
                src="/events/miss_nepal.png"
                alt="Event Overview"
                width={400}
                height={400}
                className="w-full max-w-md h-auto rounded-lg shadow-md object-cover lg:ml-auto"
              />
            </div>
            <div className="lg:order-1 flex flex-col justify-end gap-6 lg:gap-10">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
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
              <p className="text-base font-light leading-relaxed text-center lg:text-left">
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

      {/* Quote Section */}
      <section className="w-full bg-[#100D08] py-12 mdplus:pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl md:text-6xl font-newsreader text-white text-center tracking-tighter">
            Celebrating the strength, compassion, and leadership of women in
            healthcare — because empowered nurses nurture a nation&rsquo;s
            well-being.
          </h3>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="w-full bg-background2 py-12 mdplus:pt-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:pb-30">
            {/* Image */}
            <div className="flex justify-center lg:justify-start lg:pr-20">
              <Image
                src="/events_1.jpg"
                alt="Purpose Image"
                width={581}
                height={645}
                className="w-full h-full max-w-md lg:max-w-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="flex flex-col gap-6 lg:gap-12">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
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
              <p className="text-base font-light leading-relaxed text-center lg:text-left">
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

      {/* Timeline Intro */}
      <section className="w-full py-12 lg:pb-24 bg-background2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Event Timeline" centered />
          <div className="text-base text-center flex item-center justify-center mx-auto max-w-3xl">
            A journey designed to elevate you. From auditions to the grand
            finale, each phase of this event is crafted to help you grow, gain
            exposure, and shine. It&rsquo;s more than a timeline—it&rsquo;s your
            path to becoming the next standout name in modeling.
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="w-full relative px-4 bg-background2 overflow-hidden py-12 lg:pt-40 lg:pb-40">
        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          <div className="absolute w-full top-1/2 -translate-y-1/2 h-0.5 bg-white z-0" />
          <div className="flex justify-center gap-4 w-full z-10 max-w-7xl mx-auto">
            {timelineData.map((item, index) => (
              <div key={index} className="relative flex justify-center flex-1">
                <div
                  className={`absolute ${
                    item.position === "up" ? "top-[-160px]" : "top-[40px]"
                  } w-100 pt-6 px-6 pb-8 bg-muted-background shadow-md`}
                >
                  <div className="flex items-start gap-3">
                    <i className={`${item.icon} text-xl text-gold-500`}></i>
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
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-1">
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gold-500 z-0" />
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden max-w-md mx-auto">
          <div className="relative pl-2">
            {/* Main vertical line */}
            <div className="absolute left-2 -top-5 -bottom-5 w-0.5 bg-white z-0" />

            {timelineData.map((item, index) => (
              <div key={index} className="relative mb-20 last:mb-0">
                {/* Content card */}
                <div className="ml-6">
                  <div className="bg-muted-background p-6 shadow-md w-full relative">
                    <div className="flex items-start gap-3">
                      <i className={`${item.icon} text-xl text-gold-500`}></i>
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
                </div>

                {/* Timeline circles and connecting line - matching desktop pattern */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-center w-4 transform -translate-x-1/2">
                  {/* Top circle */}
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />

                  {/* Connecting line between circles (gold) */}
                  <div className="flex-1 w-1 bg-gold-500" />

                  {/* Bottom circle */}
                  <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Event Timeline Title */}
      <div className="hidden w-full relative bg-background2 overflow-hidden md:flex items-center justify-center">
        <h2 className="text-stone-800 text-center text-[120px] md:text-[160px] lg:text-[200px] font-bold font-newsreader whitespace-nowrap transform scale-x-[1.2]">
          Event Timeline
        </h2>
      </div>

      {/* Winners from 2024 */}
      <section className="w-full bg-background2 py-16 md:py-2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Winners from 2024" />
          <ModelGrid models={models.slice(0, 4)}>
            {(model) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {model.tag && (
                  <div
                    className={`${
                      model.tag.toLowerCase() === "winner"
                        ? "text-gold-500"
                        : "text-white"
                    } text-base font-bold flex items-center gap-1 pb-2`}
                  >
                    <i
                      className={`ri-vip-crown-line text-base ${
                        model.tag === "Winner" ? "text-gold-500" : "text-white"
                      }`}
                    />
                    {model.tag}
                  </div>
                )}
                <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                  {model.name}
                </h4>
                <p className="text-white text-base font-light tracking-wider">
                  {model.designation}
                </p>
              </motion.div>
            )}
          </ModelGrid>
        </div>
      </section>

      {/* Juries Section */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Juries for Miss Nepal Peace 2024" />
          <ModelGrid models={models}>
            {(model) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                  {model.name}
                </h4>
                <p className="text-white text-base font-light tracking-wider">
                  {model.designation}
                </p>
              </motion.div>
            )}
          </ModelGrid>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Gallery" />

          {/* Gallery using the reusable component */}
          <MasonryGallery images={winnerImages} />
        </div>
      </section>

      {/* Sponsors */}
      <section className="w-full bg-background2 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Our Sponsors" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            <PartnerScroller partners={partners} speed={200} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
