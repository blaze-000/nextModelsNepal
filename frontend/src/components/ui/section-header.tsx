import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SectionHeaderProps {
  title: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  title,
  centered = false,
  className = "",
}: SectionHeaderProps) {
  const sectionHeaderMotion = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true, amount: 0.6 },
  };

  return (
    <motion.div {...sectionHeaderMotion} className={`pb-6 ${className}`}>
      {/* Desktop Layout */}
      <div
        className={`hidden md:flex ${
          centered ? "justify-center" : "justify-between"
        } items-center`}
      >
        {centered ? (
          <div className="flex items-center gap-2">
            <Image
              src="/small_star.svg"
              alt=""
              width={1}
              height={0}
              sizes="100vw"
              className="w-6 h-6 rounded-full"
            />
            <h3 className="text-white text-xl font-normal font-newsreader tracking-wide">
              {title}
            </h3>
          </div>
        ) : (
          <div className="flex-1 flex gap-2">
            <Image
              src="/small_star.svg"
              alt=""
              width={1}
              height={0}
              sizes="100vw"
              className="w-6 h-6 rounded-full"
            />
            <h3 className="text-white text-xl font-normal font-newsreader tracking-wide">
              {title}
            </h3>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/small_star.svg"
            alt=""
            width={1}
            height={0}
            sizes="100vw"
            className="w-4 h-4 rounded-full"
          />
          <h3 className="text-white text-xl font-normal font-newsreader tracking-wide">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}
