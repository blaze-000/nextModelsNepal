"use client";
import {useState, useEffect} from "react";

import type React from "react";


import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "@/components/ui/section-header";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import WinnerGrid from "@/components/molecules/winners-grid";
import JuryGrid from "@/components/molecules/jury-grid";
import Dropdown from "@/components/ui/Dropdown";
import NotFound from "@/app/not-found";
import { Spinner } from "@/components/ui/spinner";

export default function EventDetails() {
  const { slug } = useParams();
  const [data, setData] = useState<SeasonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Reusable motion props
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.2 },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.2 },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 30 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.2 },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
    viewport: { once: true, amount: 0.2 },
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await Axios.get(`/api/season/slug/${slug}`);
        const responseData = res.data;

        if (responseData.success) {
          setData(responseData.data);
        } else {
          setError(responseData.message || "Season not found");
        }
      } catch (err:any) {
        console.error("Error fetching season:", err);
        if (err.response?.data?.message === "Season not found") {
          setError("Season not found");
        } else {
          setError("Failed to load season data");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleYearChange = (year: string) => {
    const season = data?.eventId.seasons.find((season) => season.year.toString() === year);
    if (season) {
      router.push(`/events/${season.slug}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size={100} color="#ffaa00" />
          <p className="text-white text-lg">Loading event details...</p>
        </div>
      </main>
    );
  }

  // Show not found page if season not found
  if (error === "Season not found" || !data) {
    return <NotFound />;
  }

  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        {...fadeInUp}
        className="h-[40vh] md:h-[60vh] lg:h-[80vh] bg-black bg-cover relative bg-center"
        style={{ backgroundImage: `url('${normalizeImagePath(data?.eventId.coverImage)}')` }}
      >
        {/* Gradient mask */}
        <div className="hidden mdplus:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="mdplus:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden mdplus:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
            <span>{data?.eventId.name.split(" ").slice(0, -1).join(" ")}</span>
            <div className="flex items-baseline gap-3 mt-2">
              <span>{data?.eventId.name.split(" ").slice(-1)}</span>
              <Image
                src={normalizeImagePath(data?.eventId.titleImage)}
                alt=""
                width={160}
                height={64}
                className="h-16 w-40 rounded-full object-cover hidden mdplus:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
            </div>
          </h2>
          <p className="mt-2 text-2xl max-w-lg text-white font-light mb-8">
            {data?.eventId.subtitle}
          </p>
          <div>
            <Dropdown
              options={data?.eventId.seasons.map((season) => season.year.toString()) || []}
              label="Year "
              selected={data?.year?.toString() || ""}
              onSelect={handleYearChange}
              maxHeight="200px"
            />
          </div>

        </div>
      </motion.section>

      {/* Texts Mobile */}
      <motion.section {...fadeInUp} className="block mdplus:hidden py-30 bg-black">
        <div className="text-center px-6">
          <h2 className="text-6xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-8">
            {data?.eventId.name}
          </h2>
          <p className="mb-8">{data?.eventId.subtitle}</p>

          <Dropdown
            options={data?.eventId.seasons.map((season) => season.year.toString()) || []}
            label="Year "
            selected={data?.year?.toString() || ""}
            onSelect={handleYearChange}
            maxHeight="200px"
          />
        </div>
      </motion.section>

      {/* Overview Section */}
      <section className="w-full pb-16 mdplus:pt-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 mdplus:grid-cols-2 gap-8 items-center">
            <motion.div
              {...fadeInRight}
              className="mdplus:order-2 flex justify-center items-center"
            >
              <Image
                src={normalizeImagePath(data?.image)}
                alt="Event Overview"
                width={400}
                height={400}
                className="w-full max-w-md h-auto rounded-lg object-cover mx-auto"
              />
            </motion.div>
            <motion.div
              {...fadeInLeft}
              className="mdplus:order-1 flex flex-col justify-end gap-10"
            >
              <motion.div
                {...staggerItem}
                className="flex items-center gap-2 mx-auto mdplus:mx-0"
              >
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
              </motion.div>
              <motion.p
                {...staggerItem}
                className="text-base font-light leading-relaxed max-w-xl mx-auto mdplus:mx-0 text-center mdplus:text-left"
              >
                {data?.eventId.overview}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <motion.section
        {...fadeInUp}
        className="w-full bg-[#100D08] py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-newsreader text-white text-center tracking-tighter">
            {data?.eventId.quote}
          </h3>
        </div>
      </motion.section>

      {/* Purpose Section */}
      <section className="w-full bg-background2 pb-24 mdplus:pt-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 mdplus:grid-cols-2 gap-8 mdplus:gap-16 items-center">
            {/* Image */}
            <motion.div
              {...fadeInLeft}
              className="flex justify-center mdplus:justify-start"
            >
              <Image
                src={normalizeImagePath(data?.eventId.purposeImage)}
                alt="Purpose"
                width={581}
                height={645}
                className="w-full h-full max-w-md mdplus:max-w-full object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              {...fadeInRight}
              className="flex flex-col items-center mdplus:items-start"
            >
              <motion.div {...staggerItem}>
                <SectionHeader title="Purpose" />
              </motion.div>
              <motion.p
                {...staggerItem}
                className="text-base font-light leading-relaxed max-w-xl mx-auto mdplus:mx-0 text-center mdplus:text-left"
              >
                {data?.eventId.purpose}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Intro */}
      <motion.section
        {...fadeInUp}
        className="w-full pb-12 mdplus:pb-24 bg-background2 mdplus:pt-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...staggerItem}>
            <SectionHeader title="Event Timeline" centered />
          </motion.div>
          <motion.div
            {...staggerItem}
            className="text-base text-center flex item-center justify-center mx-auto max-w-3xl"
          >
            {data?.eventId.timelineSubtitle}
          </motion.div>
        </div>
      </motion.section>

      {/* Desktop Timeline Visual */}
      <motion.section
        {...fadeInUp}
        className="hidden xl:flex w-full relative bg-background2 overflow-hidden pt-40 pb-40"
      >
        <div className="absolute w-full top-1/2 -translate-y-1/2 h-0.5 bg-white z-0" />
        <div className="flex justify-center gap-4 w-full z-10 max-w-7xl mx-auto px-6">
          {data?.timeline.map((item, index) => (
            <motion.div
              key={index}
              className="relative flex justify-center flex-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <div
                className={`absolute ${index % 2 === 0 ? "top-[-160px]" : "top-[40px]"
                  } w-96 pt-6 px-6 pb-8 bg-muted-background shadow-md overflow-hidden`}
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={normalizeImagePath(item.icon)}
                    alt={item.label}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium text-gold-500">
                      {item.datespan}
                    </p>
                    <h3 className="text-2xl font-newsreader font-normal text-white">
                      {item.label}
                    </h3>
                  </div>
                </div>
                {/* Crown SVG - only show on last card */}
                {index === data?.timeline.length - 1 && (
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
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mobile Timeline Visual */}
      <section
        className="xl:hidden flex w-full bg-background2 overflow-hidden pt-40 pb-20"
      >
        <div className="flex flex-col justify-center gap-36 w-full z-10 relative max-w-7xl mx-auto ml-6 mr-3 mb-36">
          <div className="absolute h-[125%] w-0.5 left-0 bg-white z-0" />
          {data?.timeline.map((item, index) => (
            <motion.div
              key={index}
              className="relative flex justify-center flex-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.04 }}
              viewport={{ once: true, amount: 0.6 }}
            >
              <div className="w-full py-6 px-6 mx-6 sm:mx-12 bg-muted-background shadow-md relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <Image
                    src={normalizeImagePath(item.icon)}
                    alt={item.label}
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div className="flex flex-col gap-2 z-10">
                    <p className="text-lg font-medium text-gold-500">
                      {item.datespan}
                    </p>
                    <h3 className="text-2xl font-newsreader font-normal text-white">
                      {item.label}
                    </h3>
                  </div>

                  {/* Crown SVG - only show on last card */}
                  {index === data?.timeline.length - 1 && (
                    <div className="absolute -right-3 -bottom-3 z-0">
                      <Image
                        width={20}
                        height={0}
                        src="/svg-icons/crown.svg"
                        alt="Crown"
                        className="w-16 h-16 md:w-24 md:h-24 z-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bg-gold-500 w-1 left-0 h-[150%] -top-[25%]  flex flex-col justify-between items-center">
                <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
                <div className="w-4 h-4 bg-white rounded-full border-4 border-gold-500 z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Big Event Timeline Text with continuous scroll */}
      <div className="hidden xl:flex w-full relative bg-background2 overflow-hidden items-center select-none">
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
      <motion.section
        {...fadeInUp}
        className="w-full bg-background2 pb-16 md:py-2"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...staggerItem}
            className="flex flex-start items-start"
          >
            <SectionHeader title={`Winners from ${data?.year}`} />
          </motion.div>
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
      </motion.section>

      {/* Juries Section */}
      <motion.section
        {...fadeInUp}
        className="w-full bg-background2 py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...staggerItem}
            className="flex flex-start items-start"
          >
            <SectionHeader title={`Juries for ${data?.eventId.name} ${data?.year}`} />
          </motion.div>
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
      </motion.section>

      {/* Gallery */}
      <section
        className="w-full bg-background2 py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title={`Highlights from ${data?.year}`} />
          {/* Gallery using the reusable component */}
          <MasonryGallery images={data?.gallery?.map((image) => normalizeImagePath(image)) || []} />
        </div>
      </section>

      {/* Sponsors */}
      <motion.section
        {...fadeInUp}
        className="w-full bg-background2 py-16"
      >
        <div className="max-w-7xl mx-auto px-6 ">
          <motion.div
            {...staggerItem}
            className="flex flex-start items-start"
          >
            <SectionHeader title="Our Sponsors" className="pb-6 " />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8"
          />
          <motion.div
            className="flex flex-wrap items-center justify-evenly gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
          >
            {data?.sponsors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Image
                  src={normalizeImagePath(item.image)}
                  alt={item.image}
                  width={120}
                  height={56}
                  className="object-contain h-16"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* More <Event's name> Events */}
      <motion.section
        {...fadeInUp}
        className="w-full bg-background2 py-16 pb-24"
      >
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex">
            <SectionHeader title={`More ${data?.eventId.name} Events`} />
          </div>

          <Dropdown
            options={data?.eventId.seasons.map((season) => season.year.toString()) || []}
            label="Year "
            selected={data?.year?.toString() || ""}
            onSelect={handleYearChange}
            maxHeight="200px"
          />
          <div className="absolute  top-full left-64 hidden md:flex">
            <Image
              src="/svg-icons/bent-arrow.svg"
              alt=""
              width={50}
              height={20}
              className="w-24 h-[20px] object-cover"
            />
            <p className="max-w-3xs px-6">Select a year to view the
              event details for that year</p>
          </div>
        </div>

      </motion.section>
    </main>
  );
};