"use client";

import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";
import MasonryGallery from "@/components/molecules/masonary-gallery";

export default function Gallery() {
  const winnerImages = [
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/events_1.jpg",
    "/news_1.jpg",
    
  ];

  return (
    <>
      <Breadcrumb
        title="Events Highlights Gallery"
        searchPlaceholder="Search events, winners, judges"
      />

      <section className="w-full bg-background2 py-16 md:py-20">
        <MasonryGallery images={winnerImages} />
      </section>
    </>
  );
}
