import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="bg- w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 ">
          {/* Left Content */}
          <div className="space-y-2 pt-20 pb-30">
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
                <span className="text-gold-500 text-8xl font-extralight font-newsreader tracking-tighter">
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
                <span className="text-white text-8xl font-extralight font-newsreader tracking-tighter italic pt-4 pr-2">
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
            <div className="flex items-center gap-10 pt-4">
              <Button variant="default" className="px-9 py-4 group">
                Hire a model <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
              </Button>
              <button className="text-gold-500 text-lg font-semibold  underline">
                Upcoming Events <i className="ml-1 w-4 h-4 ri-arrow-right-up-line" />
              </button>
            </div>
          </div>


          {/* Right side*/}
          <div className="w-full h-full relative">
            {/* 2x2 centered image grid */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-4 w-[60%] aspect-square z-10">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="relative">
                  <Image
                  src="/news_1.jpg"
                    // src={`/model${n}.jpg`}
                    alt={`Model ${n}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>

            {/* Grid overlays (keep your existing ones) */}
            <Image
              src="/small_star.svg"
              alt=""
              width={25}
              height={0}
              priority
              className="object-cover w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            />
            <div className="absolute left-0 top-1/4 w-[125%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            <div className="absolute left-0 top-1/2 w-[105%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            <div className="absolute left-0 bottom-1/5 w-[105%] h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            <div className="absolute bottom-0 left-1/5 h-[105%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            <div className="absolute bottom-0 left-1/2 h-[105%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
            <div className="absolute bottom-0 right-1/5 h-[105%] w-[1px] bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;