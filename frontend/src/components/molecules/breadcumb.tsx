"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface BreadcrumbProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
}

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

  return (
    <div className="w-full bg-[#181511] py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left: Back + Title vertical */}
          <div className="flex flex-col items-start gap-2">
            <button
              onClick={handleBack}
              className="text-gold-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <i className="ri-arrow-left-line text-xl" />
              <span className="underline text-xl font-medium tracking-tight">back</span>
            </button>
            <h1 className="text-4xl font-serif font-normal text-white">
              {title}
            </h1>
          </div>
          {/* Right: Search Bar */}
          <div className="w-[400px]">
            <div className="relative">
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
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer mb-4"
          >
            <i className="ri-arrow-left-line text-lg" />
            <span className="underline text-sm font-medium">back</span>
          </button>
          {/* Title */}
          <h1 className="text-2xl font-serif font-normal text-white mb-6">
            {title}
          </h1>
          {/* Search Bar */}
          <div className="relative">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
