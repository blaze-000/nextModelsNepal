"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/section-header";
import MasonryGallery from "@/components/molecules/masonary-gallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

export default function ModelDetailsPage() {

  const { slug } = useParams();
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    (async () => {
      const res = await Axios.get(`/api/models/${slug}`);
      const data = res.data.data;
      console.log(data);
      setModel(data);
    })();
  }, [slug]);

  return (
    <main>
      {/* Hero Section Desktop */}
      <section className="hidden xl:block w-full bg-black">
        <div className="grid grid-cols-[1fr_1fr]">
          {/* Texts Desktop */}
          <div className="relative pl-30">
            <div className="flex-col justify-center px-6 p-30">
              {/* Back Button */}
              <button className="text-gold-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <i className="ri-arrow-left-line text-lg" />
                <Link href="/models" className="underline underline-offset-2 text-base font-medium tracking-tight">
                  back
                </Link>
              </button>
              <h2 className="text-[84px] font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
                <span>{model?.name}</span>
              </h2>
              <p className=" text-base text-white font-light">
                {model?.intro}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="default">
                  <span>Hire {model?.name.split(" ")[0]}</span> {/* First name only */}
                  <i className="ri-arrow-right-up-line ml-2" />
                </Button>
                <Link
                  href="/contact"
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
          <div className="relative col-span-1 h-[80vh]">
            <Image
              src={normalizeImagePath(model?.coverImage || "")}
              alt={model?.name || ""}
              fill
              quality={100}
              priority
              sizes="50vw"
              className="object-cover object-top [mask:linear-gradient(to_right,transparent_0%,black_40%,black_100%)]"
            />
          </div>
        </div>
      </section>

      {/* Hero Section Mobile */}
      <section className="flex xl:hidden h-[50vh] md:h-[70vh] bg-black bg-cover relative bg-no-repeat bg-center">
        {/* Background Image */}
        <Image
          src={normalizeImagePath(model?.coverImage) || ""}
          alt={model?.name || ""}
          fill
          quality={100}
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </section>

      {/* Mobile Content Section */}
      <section className="flex xl:hidden py-30 bg-black">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h2 className="text-5xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter pb-8">
            {model?.name}
          </h2>
          <p className="text-lg px-3">
            {model?.intro}
          </p>
          <div className="flex flex-col items-center gap-4 mt-8">
            <Button variant="default" className="w-full max-w-xs">
              <span>Hire {model?.name.split(" ")[0]}</span>
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
      </section>

      {/* Gallery */}
      <section className="w-full bg-background2 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Gallery" />

          {/* Gallery using the reusable component */}
          <MasonryGallery images={model?.images.map((image) => normalizeImagePath(image)) || []} />
        </div>
      </section>
    </main>
  );
}