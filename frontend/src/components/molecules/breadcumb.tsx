"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  title,
  searchPlaceholder = "Search events, winners, judges",
  onSearch,
}) => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full bg-[#100d08] py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <motion.div
          className="hidden md:flex items-center justify-between"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          {/* Left: Back + Title vertical */}
          <motion.div
            className="flex flex-col items-start gap-2"
            variants={item}
          >
            <button
              onClick={handleBack}
              className="text-gold-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg" />
              <span className="underline underline-offset-2 text-base font-medium tracking-tight">
                back
              </span>
            </button>
            <h1 className="text-5xl font-newsreader font-extralight text-white">
              {title}
            </h1>
          </motion.div>

          {/* Right: Search Bar */}
          <motion.div className="w-xl" variants={item}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="ri-search-line text-lg" />
              </span>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-base"
                placeholder={searchPlaceholder}
                value={search}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Layout */}
        <motion.div
          className="md:hidden"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          {/* Back button */}
          <motion.button
            onClick={handleBack}
            className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer mb-4"
            variants={item}
          >
            <i className="ri-arrow-left-line text-lg" />
            <span className="underline text-sm font-medium">back</span>
          </motion.button>

          {/* Title */}
          <motion.h1
            className="text-2xl font-serif font-normal text-white mb-6"
            variants={item}
          >
            {title}
          </motion.h1>

          {/* Search Bar */}
          <motion.div className="relative" variants={item}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <i className="ri-search-line text-lg" />
            </span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 text-sm"
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleInputChange}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Breadcrumb;
