"use client";
import Image from "next/image";
import React from "react";
import PartnerScroller from "./../molecules/scroller";

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

const OurPartners = () => {
  return (
    <section className="w-full py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section */}
        <div className="flex flex-col gap-3 font-newsreader">
          <h2 className="text-5xl font-extralight tracking-tight">
            Our Strategic
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src="/handshake.jpg"
              alt=""
              width={187}
              height={80}
              className="rounded-[38px] w-36 h-16 object-cover"
            />
            <span className="text-gold-500 text-6xl font-light tracking-tighter">
              Partners
            </span>
          </div>
        </div>

        {/* Right Description */}
        <p className="text-base md:text-right text-center max-w-md font-light font-urbanist">
          The Creative Forces Behind Iconic Campaigns: Celebrating the Partners
          Who Drive Success for Leading Brands
        </p>
      </div>

      {/* Scrolling Logos */}
      <PartnerScroller partners={partners} speed={200}/>
    </section>
  );
};

export default OurPartners;
