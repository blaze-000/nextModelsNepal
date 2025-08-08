"use client";

// import { useParams } from "next/navigation";
import React from "react";
import SectionHeader from "@/components/ui/section-header";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ModelPage() {
  const winnerImages = [
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/events_1.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
    "/handshake.jpg",
    "/mr-nepal-2025-poster-1.jpg",
    "/handshake.jpg",
  ];
  // const { slug } = useParams();

  return (
    <main>
      <section className=" w-full bg-black">
        <div className="grid grid-cols-[1fr_1fr]">
          {/* Texts Desktop */}
          <div className="relative pl-30">
            <div className="flex-col justify-center h-full px-6 p-30">
              {/* Back Button */}
              <button className="text-gold-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <i className="ri-arrow-left-line text-lg" />
                <span className="underline underline-offset-2 text-base font-medium tracking-tight">
                  back
                </span>
              </button>
              <h2 className="text-[84px] font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
                <span>Monika Adhikary</span>
              </h2>
              <p className=" text-base text-white font-light">
                Meet Monika Adhikary, the embodiment of style and charisma.
                Monika Adhikary is a rising star in the modeling world, known
                for her captivating presence on the runway and in front of the
                camera. With a unique blend of versatility and charm, continues
                to leave a lasting impression in the fashion industry. Stay
                tuned for more from this promising talent as she paves her way
                to the top.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="default">
                  <span>Hire Monika</span>
                  <i className="ri-arrow-right-up-line ml-2" />
                </Button>
                <Link
                  href="/#"
                  className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="underline underline-offset-4">
                    Contact Us
                  </span>
                  <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
                </Link>
              </div>
            </div>
          </div>
          {/* Right Column - Full width background image */}
          <div className="relative col-span-1 min-h-screen">
            <Image
              src="/monika.png"
              alt="Monika Adhikary"
              fill
              quality={100}
              priority
              sizes="50vw"
              className="object-cover object-top [mask:linear-gradient(to_right,transparent_0%,black_40%,black_100%)]"
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Gallery" />

          {/* Gallery using the reusable component */}
          <MasonryGallery images={winnerImages} />
        </div>
      </section>
    </main>
  );
}