import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 pb-30">
      <div className="pt-20 relative">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left Content */}
          <div className="space-y-2">
            {/* We are Next Models Nepal */}
            <div className="self-stretch justify-center">
              <span className=" text-white text-2xl leading-loose tracking-wide">
                We are{" "}
              </span>
              <span className="text-primary text-2xl font-normal leading-loose tracking-wide">
                Next Models Nepal
              </span>
            </div>

            {/* Main Title with Badge */}
            <div className="space-y-2">
              <div>
                <span className="text-white text-8xl font-extralight font-newsreader tracking-tighter">
                  Nepal&rsquo;s{" "}
                </span>
                <span className="text-orange-400 text-8xl font-extralight font-newsreader tracking-tighter">
                  No.1
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                {/* Badge image with soft layered shadow */}
                <div className="w-40 h-16 relative">
                  <Image
                    src="/span-image.jpg"
                    alt="Badge"
                    fill
                    className="rounded-full object-cover border border-stone-300"
                  />
                </div>
                {/* Label */}
                <span className="text-white text-8xl font-extralight font-newsreader tracking-tighter leading-px">
                  Modeling
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-white text-8xl font-extralight font-newsreader tracking-tighter italic">
                  Agency
                </span>
                {/* Empty oval outline */}
                <div className="w-36 h-16 rounded-full border-2 border-orange-400"></div>
              </div>
            </div>

            {/* Description */}
            <p className="text-white text-base leading-relaxed font-light pt-6">
              Next Models Nepal is a team of seasoned professionals dedicated to
              <br />
              talent management, elite training, and launching aspiring models.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-10 pt-4">
              <Button>Hire a Model</Button>
              <button className="text-primary text-lg font-semibold  underline">
                Upcoming Events ↗
              </button>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Row */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://placehold.co/206x207"
                  alt="Model 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://placehold.co/206x207"
                  alt="Model 2"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Row */}
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://placehold.co/206x207"
                  alt="Model 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://placehold.co/206x207"
                  alt="Model 4"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Orange Diamond - positioned between the 4 images */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-400 rotate-45"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
