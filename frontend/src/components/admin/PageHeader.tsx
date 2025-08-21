"use client";

import { motion } from "framer-motion";
import type React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-100 font-newsreader">
            {title}
          </h1>
          {description && <p className="text-gray-400 mt-2">{description}</p>}
        </div>

        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
    </motion.div>
  );
}
