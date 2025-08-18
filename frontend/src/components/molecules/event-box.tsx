import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

type eventboxprops = {
  image: string;
  title: string;
  desc: string;
  buttonText: string;
  status: "upcoming" | "ended";
  slug: string;
  className?: string;
};

const EventBox = ({
  slug,
  image,
  title,
  desc,
  buttonText,
  status,
}: eventboxprops) => {
  return (
    <article className="h-full bg-stone-900 flex flex-col justify-between overflow-hidden hover:bg-stone-800 transition-colors duration-300 p-6 md:p-6">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Image
          width={0}
          height={0}
          src={image}
          alt={title}
          sizes="100vw"
          className="w-full h-48 md:h-72 lg:h-72 object-cover object-top scale-110 hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="pt-4 md:pt-4 pr-2 md:pr-4">
        <div className="mb-4 md:mb-6">
          <h3 className="text-5xl font-newsreader leading-relaxed mb-3 md:mb-4 tracking-tighter">
            {title}
          </h3>
          <p className="text-sm md:text-base font-light text-white/80 leading-relaxed line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
      <div>
        <div className="flex md:gap-3 flex-col md:flex-row">
          {/* CTA Button */}
          {status === "upcoming" && (
            <div className="flex gap-4">
              <Link href={`/events/${slug}`}>
                <Button variant="default">Apply Now</Button>
              </Link>

              <Link href={`/events/${slug}`}>
                <Button variant="default" className="bg-white">
                  Get Tickets
                </Button>
              </Link>
            </div>
          )}

          <Link
            href={`/events/${slug}`}
            className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="underline underline-offset-4">{buttonText}</span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventBox;
