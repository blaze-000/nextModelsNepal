"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import WinnerGrid from "@/components/molecules/winners-grid";
import JuryGrid from "@/components/molecules/jury-grid";

export default function EventDetails() {
  const { slug } = useParams();

  const [data, setData] = useState<SeasonDetails | null>(null);


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

  useEffect(() => {
    (async () => {
      const res = await Axios.get(`/api/season/slug/${slug}`);
      const data = res.data;
      setData(data.data);
    })();
  }, [slug]);

  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        {...fadeInUp}
        className="h-[40vh] md:h-[80vh] bg-black bg-cover bg-center relative"
        style={{ backgroundImage: `url('${normalizeImagePath(data?.eventId.coverImage)}')` }}
      >
        {/* Gradient mask */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden md:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
            <span>{data?.eventId.name.split(" ").slice(0, -1).join(" ")}</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span>{data?.eventId.name.split(" ").slice(-1)}</span>
              <Image
                src={normalizeImagePath(data?.eventId.titleImage)}
                alt=""
                width={160}
                height={64}
                className="h-16 w-40 rounded-full object-cover hidden md:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
            </div>
          </h2>
          <p className="mt-2 text-2xl max-w-lg text-white font-light">
            {data?.eventId.subtitle}
          </p>
        </div>
      </motion.section>

      {/* Texts Mobile */}
      <motion.section {...fadeInUp} className="flex md:hidden py-30 bg-black">
        <div className="text-center px-6">
          <h2 className="text-6xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-8">
            {data?.eventId.name}
          </h2>
          <p>{data?.eventId.subtitle}</p>
        </div>
      </motion.section>

      {/* Overview Section */}
      <section className="w-full pb-16 mdplus:pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2 flex justify-center items-end">
              <Image
                src={normalizeImagePath(data?.image)}
                alt="Event Overview"
                width={400}
                height={400}
                className="w-full max-w-md h-auto rounded-lg object-cover ml-auto"
              />
            </div>
            <div className="lg:order-1 flex flex-col justify-end gap-10">
              <div className="flex items-center gap-2">
                <Image
                  src="/svg-icons/small_star.svg"
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
                {data?.eventId.overview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="w-full bg-[#100D08] pb-12 mdplus:pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-6xl font-newsreader text-white text-center tracking-tighter">
            {data?.eventId.quote}
          </h3>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="w-full bg-background2 pb-24 mdplus:pt-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image */}
            <div className="flex justify-center lg:justify-start pr-20">
              <Image
                src={normalizeImagePath(data?.eventId.purposeImage)}
                alt="Purpose"
                width={581}
                height={645}
                className="w-full h-full max-w-md lg:max-w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col">
              <SectionHeader title="Purpose" />
              <p className="text-base font-light leading-relaxed">
                {data?.eventId.purpose}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Intro */}
      <section className="w-full pb-24 bg-background2 mdplus:pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Event Timeline" centered />
          <div className="text-base text-center flex item-center justify-center mx-auto max-w-3xl">
            {data?.eventId.timelineSubtitle}
          </div>
        </div>
      </section>

      {/* Timeline Visual */}
      <section className="w-full relative px-4 bg-background2 overflow-hidden pt-40 pb-40">
        <div className="absolute w-full top-1/2 -translate-y-1/2 h-0.5 bg-white z-0" />
        <div className="flex justify-center gap-4 w-full z-10 max-w-7xl mx-auto px-6">
          {timelineData.map((item, index) => (
            <div key={index} className="relative flex justify-center flex-1">
              <div
                className={`absolute ${item.position === "up" ? "top-[-160px]" : "top-[40px]"
                  } w-100 pt-6 px-6 pb-8 bg-muted-background shadow-md overflow-hidden`}
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
                {/* Crown SVG - only show on last card */}
                {index === timelineData.length - 1 && (
                  <div className="absolute right-0 -bottom-3">
                    <Image
                      width={100}
                      height={0}
                      src="/svg-icons/crown.svg"
                      alt="Crown"
                      className="w-24 h-24"
                    />
                  </div>
                )}
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-0.5 bg-gold-500 z-0" />
                <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big Event Timeline Text with continuous scroll */}
      <div className="w-full relative bg-background2 overflow-hidden flex items-center select-none">
        <div className="marquee-wrapper">
          <div className="marquee-text text-[#0e0e0e] font-semibold tracking-tighter font-newsreader text-[140px] md:text-[180px] lg:text-[250px]">
            Event Timeline Event Timeline Event Timeline
          </div>
          <div className="marquee-text text-[#0e0e0e] font-semibold tracking-tighter font-newsreader text-[140px] md:text-[180px] lg:text-[250px]">
            Event Timeline Event Timeline Event Timeline
          </div>
        </div>
      </div>

      {/* Winners from <YEAR> */}
      <section className="w-full bg-background2 py-16 md:py-2">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={`Winners from ${data?.year}`} />
          <WinnerGrid winners={data?.winners}>
            {(winner) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {winner.rank && (
                  <div
                    className={`text-base font-bold flex items-center gap-1 pb-2 text-primary`}
                  >
                    <i
                      className={`ri-vip-crown-line text-base ${winner.rank === "Winner" ? "text-gold-500" : "hidden"
                        }`}
                    />
                    {winner.rank}
                  </div>
                )}
                <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                  {winner.name}
                </h4>
                <p className="text-white text-base font-light tracking-wider">
                  {data?.eventId.name}{" "}{data?.year}
                </p>
              </motion.div>
            )}
          </WinnerGrid>
        </div>
      </section>

      {/* Juries Section */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Juries for Miss Nepal Peace 2024" />
          <JuryGrid winners={data?.jury}>
            {(jury) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                  {jury.name}
                </h4>
                <p className="text-white text-base font-light tracking-wider">
                  {jury.designation}
                </p>
              </motion.div>
            )}
          </JuryGrid>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Gallery" />

          {/* Gallery using the reusable component */}
          <MasonryGallery images={data?.gallery?.map((image) => normalizeImagePath(image)) || []} />
        </div>
      </section>

      {/* Sponsors */}
      <section className="w-full bg-background2 py-16">
        <div className="max-w-7xl mx-auto px-6 ">
          <SectionHeader title="Our Sponsors" className="pb-6" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8"
          />
          <motion.div
            className="flex flex-wrap items-center gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {data?.sponsors.map((item, index) => (
              <Image
                key={index}
                src={normalizeImagePath(item.image)}
                alt={item.image}
                width={120}
                height={56}
                className="object-contain h-16"
              />
            ))}
          </motion.div>
        </div>
      </section>


    </main>
  );
}
