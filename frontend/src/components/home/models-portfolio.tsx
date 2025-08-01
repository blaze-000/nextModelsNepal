"use client";
import React from "react";
import Image from "next/image";
import ModelGrid from "../molecules/model-grid";


const ModelsPortfolioSection = () => {
  const femaleModels = [
    {
      name: "Monika Adhikary",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monika",
    },
    {
      name: "Pratista",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/pratista",
    },
    {
      name: "Kristina",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
    {
      name: "Aayushma Poudel",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
  ];

  const maleModels = [
    {
      name: "Model Name 1",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/male1",
    },
    {
      name: "Model Name 2",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
    {
      name: "Model Name 3",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
    {
      name: "Model Name 4",
      location: "Kathmandu, Nepal",
      image: "/bro_1.png",
    },
  ];

  return (
    <section className="bg-stone-950 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row mb-8 md:mb-16">
          {/* Mobile Title */}
          <div className="md:hidden flex flex-col gap-2">
            <h2 className="text-white text-4xl font-light font-newsreader">Find a Face</h2>
            <h2 className="text-gold-500 text-5xl font-light tracking-tight font-newsreader">
              For Your Brand!
            </h2>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-3xl lg:text-5xl font-light font-newsreader">Find a</h2>
              <Image
                className="w-24 h-12 lg:w-36 lg:h-16 rounded-full border border-stone-300 mb-3"
                width={32}
                height={0}
                src="https://placehold.co/187x80"
                alt=""
              />
              <h2 className="text-white text-4xl lg:text-5xl font-light font-newsreader">Face</h2>
            </div>
            <h2 className="text-gold-500 text-5xl lg:text-6xl font-light font-newsreader">
              For Your Brand!
            </h2>
          </div>

          {/* Description */}
          <p className="hidden md:block text-white text-md lg:text-lg font-light font-['Urbanist'] max-w-md lg:ml-auto lg:mt-auto">
            Explore our portfolio of diverse and talented models, each ready to
            redefine the world of fashion and entertainment.
          </p>
        </div>

        {/* Grids */}
        <div className="space-y-16 md:space-y-24">
          {/* Female Models Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Image src="/small_star.svg" alt="" width={20} height={20} className="w-8 h-8" />
              <h3 className="text-white text-xl lg:text-2xl font-medium font-newsreader tracking-tight">
                Female Models
              </h3>
            </div>
            <ModelGrid models={femaleModels}>
              {(model) => (
                <>
                  <h4 className="text-gold-500 text-xl lg:text-2xl font-medium font-newsreader tracking-tight mb-2">
                    {model.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <i className="w-4 h-4 ri-map-pin-line" />
                    <span className="text-white text-sm lg:text-base font-semibold font-['Urbanist']">
                      {model.location}
                    </span>
                  </div>
                </>
              )}
            </ModelGrid>
          </div>

          {/* Male Models Grid */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <Image src="/small_star.svg" alt="" width={20} height={20} className="w-8 h-8" />
              <h3 className="text-white text-xl lg:text-2xl font-medium font-newsreader tracking-tight">
                Male Models
              </h3>
            </div>
            <ModelGrid models={maleModels}>
              {(model) => (
                <>
                  <h4 className="text-gold-500 text-xl lg:text-2xl font-medium font-newsreader tracking-tight mb-2">
                    {model.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <i className="w-4 h-4 ri-map-pin-line" />
                    <span className="text-white text-sm lg:text-base font-semibold font-['Urbanist']">
                      {model.location}
                    </span>
                  </div>
                </>
              )}
            </ModelGrid>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModelsPortfolioSection;
