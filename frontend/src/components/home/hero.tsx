import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="bg-background w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8">
          {/* Left Content */}
          <div className="space-y-2 pt-8 lg:pt-20 lg:pb-[7.5rem] -mb-8 mg:mb-0">
            {/* We are Next Models Nepal */}
            <div className="self-stretch justify-center">
              <span className="text-white text-2xl leading-loose tracking-wide">
                We are{" "}
              </span>
              <span className="text-gold-500 text-2xl font-normal leading-loose tracking-wide">
                Next Models Nepal
              </span>
            </div>
            {/* Main Title with Badge */}
            <div className="space-y-2 text-6xl lg:text-8xl">
              <div>
                <span className="text-white font-extralight font-newsreader tracking-tighter">
                  Nepal&rsquo;s{" "}
                </span>
                <span className="text-gold-500 font-extralight font-newsreader tracking-tighter">
                  No.1
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                {/* Badge image with soft layered shadow */}
                <div className="w-40 h-16 relative">
                  <Image
                    src="/span-image.jpg"
                    alt=""
                    fill
                    className="rounded-full object-cover border border-stone-300  shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)] "
                  />
                </div>
                {/* Label */}
                <span className="text-white font-extralight font-newsreader tracking-tighter leading-px">
                  Modeling
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-extralight font-newsreader tracking-tighter italic pt-4 pr-2">
                  Agency
                </span>
                {/* Empty oval outline */}
                <div className="w-40 h-16 rounded-full border-2 border-gold-500"></div>
              </div>
            </div>
            {/* Description */}
            <p className="text-white text-base leading-relaxed font-light pt-6">
              Next Models Nepal is a team of seasoned professionals dedicated to
              <br />
              talent management, elite training, and launching aspiring models.
            </p>
            {/* Buttons */}
            <div className="flex flex-col items-start gap-4 lg:flex-row lg:gap-10 lg:items-center pt-4">
              <Button variant="default" className="px-9 py-4 group">
                Hire a model <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
              </Button>
              <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <span className="underline underline-offset-4">Upcoming Events</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </button>
            </div>
          </div>

          {/* Right side */}
          <div className="w-full relative overflow-x-hidden overflow-y-hidden py-32 md:py-0">

            {/* 2x2 image grid */}
            <div className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-6 w-[80%] max-w-[390px] aspect-square z-10 relative">
              {/* Image 1 - Award ceremony */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/news_1.jpg"
                  alt="Award ceremony"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Image 2 - Pageant */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/news_1.jpg"
                  alt="Beauty pageant"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Image 3 - Group photo */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/news_1.jpg"
                  alt="Models group photo"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Image 4 - Runway show */}
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/news_1.jpg"
                  alt="Runway show"
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Background grid lines */}
              <div className="absolute -left-[50%] -top-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] top-1/2 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -left-[50%] -bottom-5 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -left-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] left-1/2 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
              <div className="absolute -bottom-[50%] -right-5 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            </div>

            {/* Center decorative element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Image
                src="/small_star.svg"
                alt=""
                width={25}
                height={25}
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;