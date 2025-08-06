"use client";
import React from "react";
import Image from "next/image";
import ModelGrid from "../molecules/model-grid";
import { motion } from "framer-motion";
import Link from "next/link";


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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row mb-8 md:mb-16"
        >
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
        </motion.div>

        {/* Grids */}
        <div className="space-y-16 md:space-y-24">
          {/* Female Models Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-8"
          >
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
                    <span className="text-white text-sm lg:text-base font-semibold font-urbanist">
                      {model.location}
                    </span>
                  </div>
                </>
              )}
            </ModelGrid>
            <div className="flex justify-end">
              <Link
                href={"/models/#female"}
                className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <span className="underline underline-offset-4">See All Female Models</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>

          {/* Male Models Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
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
            <div className="flex justify-end">
              <Link
                href={"/models/#male"}
                className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <span className="underline underline-offset-4">See All Male Models</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModelsPortfolioSection;
