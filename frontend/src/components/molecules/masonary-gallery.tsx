"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface GalleryImage {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface MasonryGalleryProps {
  images: GalleryImage[] | string[];
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  animationDelay?: number;
  animationDuration?: number;
  gap?: number;
  defaultImageWidth?: number;
  defaultImageHeight?: number;
  maxImageHeight?: number;
  hoverScale?: number;
  hoverBrightness?: number;
  loading?: "lazy" | "eager";
  quality?: number;
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  images,
  className = "",
  imageClassName = "",
  containerClassName = "max-w-7xl mx-auto px-6",
  animationDelay = 0.05,
  animationDuration = 0.5,
  gap = 4,
  defaultImageWidth = 300,
  defaultImageHeight = 225,
  maxImageHeight = 600,
  hoverScale = 1.02,
  hoverBrightness = 105,
  loading = "lazy",
  quality = 75,
}) => {
  const normalizedImages: GalleryImage[] = images.map((img, index) => {
    if (typeof img === "string") {
      return {
        src: img,
        alt: `Gallery image ${index + 1}`,
        width: defaultImageWidth,
        height: defaultImageHeight,
      };
    }
    return {
      alt: `Gallery image ${index + 1}`,
      width: defaultImageWidth,
      height: defaultImageHeight,
      ...img,
    };
  });

  const getGapClass = (gapSize: number) => {
    const gapMap: Record<number, string> = {
      1: "gap-1 space-y-1",
      2: "gap-2 space-y-2",
      3: "gap-3 space-y-3",
      4: "gap-4 space-y-4",
      5: "gap-5 space-y-5",
      6: "gap-6 space-y-6",
      8: "gap-8 space-y-8",
    };
    return gapMap[gapSize] || "gap-4 space-y-4";
  };

  const getAnimationDelay = (index: number) => index * animationDelay;

  const renderImage = (img: GalleryImage, index: number) => (
    <motion.div
      key={index}
      className={`break-inside-avoid group cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: animationDuration,
        delay: getAnimationDelay(index),
      }}
    >
      <div
        className={`relative overflow-hidden rounded-lg bg-gray-200 transition-all duration-300 hover:shadow-lg ${imageClassName}`}
        style={
          {
            transform: `scale(1)`,
            "--hover-scale": hoverScale,
          } as React.CSSProperties & { "--hover-scale": number }
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(${hoverScale})`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Image
          src={img.src}
          alt={img.alt || `Gallery image ${index + 1}`}
          width={img.width || defaultImageWidth}
          height={img.height || defaultImageHeight}
          className="w-full h-auto object-cover transition-all duration-300 group-hover:brightness-105"
          style={{
            maxHeight: `${maxImageHeight}px`,
            filter: `brightness(100%)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = `brightness(${hoverBrightness}%)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "brightness(100%)";
          }}
          sizes="100vw"
          loading={loading}
          quality={quality}
        />
      </div>
    </motion.div>
  );

  const gapClass = getGapClass(gap);

  return (
    <section className={className}>
      <div className={containerClassName}>
        <div className="pt-4 pb-12">
          {/* Mobile: 1 column */}
          <div className={`block sm:hidden columns-1 ${gapClass}`}>
            {normalizedImages.map((img, index) => renderImage(img, index))}
          </div>

          {/* Tablet: 3 columns */}
          <div className={`hidden sm:block md:hidden columns-3 ${gapClass}`}>
            {normalizedImages.map((img, index) => renderImage(img, index))}
          </div>

          {/* Desktop: 4 columns */}
          <div className={`hidden md:block columns-4 ${gapClass}`}>
            {normalizedImages.map((img, index) => renderImage(img, index))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MasonryGallery;
