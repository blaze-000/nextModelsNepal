import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:pl-36 ">
      <div className="relative">
        <div className="grid lg:grid-cols-[0.40fr_0.60fr] items-start">
          {/* Left Content */}
          <div className="space-y-2 pt-20 pb-40">
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
              <Button variant="default" className="px-9 py-4 group">
                Hire a model <i className="group-hover:scale-1.2 ri-arrow-right-up-line" />
              </Button>
              <button className="text-primary text-lg font-semibold  underline">
                Upcoming Events <i className="ml-1 w-4 h-4 ri-arrow-right-up-line" />
              </button>
            </div>
          </div>

          {/* Right side*/}
          <div className="relative w-full h-full -mt-16 border">
            {/* Background Image */}
            <Image
              src="/hero_bg.png"
              alt="Hero background"
              fill
              className="object-contain"
              priority
            />

            {/* Center Star */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <Image src="/hero_star.svg" alt="" width={71} height={74} />
            </div>

            {/* 4x4 Grid Overlay */}
            <div className="z-10 absolute inset-0 grid grid-cols-4 grid-rows-4 space-x-4 p-4">
              {/* Area 6 */}
              <div className="col-start-2 row-start-2">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/news_1.jpg"
                    alt=""
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>

              {/* Area 7 */}
              <div className="col-start-3 row-start-2">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/news_1.jpg"
                    alt=""
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>

              {/* Area 10 */}
              <div className="col-start-2 row-start-3">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/news_1.jpg"
                    alt=""
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>

              {/* Area 11 */}
              <div className="col-start-3 row-start-3">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/news_1.jpg"
                    alt=""
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;