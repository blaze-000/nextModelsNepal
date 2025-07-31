"use client";
import Image from "next/image";
import React, { useState } from "react";

const ModelsPortfolioSection = () => {
  const femaleModels = [
    {
      name: "Monika Adhikary",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
    { name: "Pratista", location: "Kathmandu, Nepal", image: "/bro_1.png" },
    { name: "Kristina", location: "Kathmandu, Nepal", image: "/bro_1.png" },
    {
      name: "Aayushma Poudel",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
  ];

  const maleModels = [
    { name: "Model Name 2", location: "Kathmandu, Nepal", image: "/bro_1.png" },
    { name: "Model Name 3", location: "Kathmandu, Nepal", image: "/bro_1.png" },
    { name: "Model Name 1", location: "Kathmandu, Nepal", image: "/bro_1.png" },
    { name: "Model Name 4", location: "Kathmandu, Nepal", image: "/bro_1.png" },
  ];

  const ModelGrid = ({ models, title, viewAllText }) => {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <div>
            <Image src="/small_star.svg" alt="" width={20} height={20}
              className="w-8 h-8" />
          </div>
          <h3 className="text-white text-xl lg:text-2xl font-medium font-newsreader tracking-tight">
            {title}
          </h3>
        </div>

        {/* Desktop Grid - Original Layout */}
        <div className="hidden lg:grid max-w-7xl lg:grid-cols-4 gap-6">
          {models.map(
            (
              model: { name: string; location: string; image: string },
              index: number
            ) => (
              <div
                key={index}
                className="relative bg-white overflow-hidden group hover:scale-105 transition-transform"
              >
                <img
                  className="w-full h-96 object-cover "
                  src={model.image}
                  alt={model.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h4 className="text-gold-500 text-xl lg:text-2xl font-medium font-newsreader tracking-tight mb-2">
                    {model.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <i className="w-4 h-4 ri-map-pin-line" />
                    <span className="text-white text-sm lg:text-base font-semibold font-['Urbanist']">
                      {model.location}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <i className="w-6 h-6 text-gold-400 rounded ri-arrow-right-up-line text-2xl" />
                </div>
              </div>
            )
          )}
        </div>

        {/* Mobile Slider - Same as testimonials but with px-6 initially */}
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth">
          <div className="flex space-x-6 w-max px-6">
            {models.map(
              (
                model: { name: string; location: string; image: string },
                index: number
              ) => (
                <div
                  key={index}
                  className="relative overflow-hidden group w-[80vw] min-w-[80vw] max-w-[80vw] snap-start shrink-0"
                >
                  <Image

                    className="w-full h-80 object-cover [mask:linear-gradient(to_top,transparent_0%,black_30%)]"
                    src={model.image}
                    alt={model.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" /> */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-gold-500 text-lg font-medium font-newsreader tracking-tight mb-2">
                      {model.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <i className="w-4 h-4 ri-map-pin-line" />
                      <span className="text-white text-sm font-semibold font-['Urbanist']">
                        {model.location}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <i className="w-5 h-5 text-gold-400 rounded ri-arrow-right-up-line" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Original Button Layout */}
        <div className="flex justify-end">
          <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <span className="underline">{viewAllText}</span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-2xl font-light" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-stone-950 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row mb-8 md:mb-16">
          {/* Mobile Title */}
          <div className="md:hidden flex flex-col gap-2">
            <h2 className="text-white text-4xl md:text-3xl font-light font-newsreader">
              Find a Face
            </h2>
            <h2 className="text-gold-500 text-5xl md:text-4xl font-light tracking-tight font-newsreader">
              For Your Brand!
            </h2>
          </div>

          {/* Desktop Title - Find a Face for your brand */}
          <div className="hidden lg:flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-3xl lg:text-5xl font-light font-newsreader">
                Find a
              </h2>
              <Image
                className="w-24 h-12 lg:w-36 lg:h-16 rounded-full border border-stone-300 mb-3"
                width={32}
                height={0}
                src="https://placehold.co/187x80"
                alt=""
              />
              <h2 className="text-white text-4xl lg:text-5xl font-light font-newsreader">
                Face
              </h2>
            </div>
            <h2 className="text-gold-500 text-5xl lg:text-6xl font-light font-newsreader">
              For Your Brand!
            </h2>
          </div>

          {/* Description */}
          <p className="hidden md:block text-white text-md lg:text-lg font-light font-['Urbanist'] leading- tracking-tight max-w-md lg:ml-auto lg:mt-auto">
            Explore our portfolio of diverse and talented models, each ready to
            redefine the world of fashion and entertainment.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
          <ModelGrid
            models={femaleModels}
            title="Female Models"
            viewAllText="See All Female Models"
          />
          <ModelGrid
            models={maleModels}
            title="Male Models"
            viewAllText="See All Male Models"
          />
        </div>
      </div>
    </section>
  );
};

export default ModelsPortfolioSection;
