"use client";

import Image from "next/image";
import  { useState, useEffect } from "react";
import type React from "react";
import { motion } from "framer-motion";
import ImageBox from "../molecules/image-box";
import SectionHeader from "../ui/section-header";
import Axios from "@/lib/axios-instance";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils";
import Dropdown from "@/components/ui/Dropdown";

export const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[] | null>(null);
  const [sortBy, setSortBy] = useState("Most Recent");
  const sortOptions = ["Most Recent", "Oldest"];

  const sortNews = (items: NewsItem[], sortType: string) => {
    if (!items) return [];

    return [...items].sort((a, b) => {
      switch (sortType) {
        case "Oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "Most Recent":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/api/news");
        console.log(response.data);
        const sortedNews = sortNews(response.data.data, sortBy);
        setNewsItems(sortedNews.slice(0, 2));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    })();
  }, [sortBy]);

  return (
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center px-2">
            <SectionHeader title="News and Coverage" />

            <div className="pb-6">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                selected={sortBy}
                onSelect={setSortBy}
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4 px-2">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/svg-icons/small_star.svg"
                alt=""
                width={1}
                height={0}
                sizes="100vw"
                className="w-4 h-4 rounded-full"
              />
              <h3 className="text-white text-xl font-normal font-newsreader">
                News and Coverage
              </h3>
            </div>

            <div className="flex justify-center pb-10 pt-5">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                selected={sortBy}
                onSelect={setSortBy}
              />
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {newsItems?.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              viewport={{ once: true }}
            >
              <ImageBox
                image={normalizeImagePath(item.image)}
                title={item.title}
                desc={item.description}
                link={item.link}
                buttonText="Visit News Source"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            href="/events/news-press"
            className="py-4 md:mb-8 lg:mb-0 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span className="underline underline-offset-4">View All News</span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
