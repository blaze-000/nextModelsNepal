"use client";
import HireModelForm from "@/components/hire-model-form";
import Image from "next/image";
import { motion } from "framer-motion";
import ModelGrid from "@/components/molecules/model-grid";
// import Link from "next/link";

const femaleModels = [
  {
    name: "Monika Adhikary",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "monika-adhikary",
  },
  {
    name: "Pratista",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "pratista",
  },
  {
    name: "Kristina",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "kristina",
  },
  {
    name: "Aayushma Poudel",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "aayushma-poudel",
  },
  {
    name: "Monika Adhikary",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "monika-adhikary",
  },
  {
    name: "Pratista",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "pratista",
  },
  {
    name: "Kristina",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "kristina",
  },
  {
    name: "Aayushma Poudel",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "aayushma-poudel",
  },
];

const maleModels = [
  {
    name: "Model Name 1",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "male-model-1",
  },
  {
    name: "Model Name 2",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "male-model-2",
  },
  {
    name: "Model Name 3",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "male-model-3",
  },
  {
    name: "Model Name 4",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "male-model-4",
  },
  {
    name: "Model Name 1",
    location: "Kathmandu, Nepal",
    image: "/bro_1.png",
    slug: "male-model-1",
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

export default function HireModel() {
  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="h-[40vh] md:h-[80vh] bg-black bg-cover bg-center relative"
        style={{ backgroundImage: "url('/events_1.jpg')" }}
      >
        {/* Gradient mask */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden md:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
            <span>Hire a </span>
            <div className="flex items-baseline gap-3 mt-2">
              <Image
                src="/handshake.jpg"
                alt="Handshake"
                width={160}
                height={64}
                className="h-16 w-40 rounded-full object-cover hidden md:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
              <span>Model</span>
            </div>
          </h2>

          <p className="mt-6 text-base max-w-lg text-white font-light">
            Are you ready to step into the spotlight and showcase your talent?
            Contact us today to schedule your audition with Next Models Nepal.
          </p>
        </div>
      </motion.section>

      {/* Texts Mobile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="flex md:hidden py-30 bg-black"
      >
        <div className="text-center px-6">
          <h2 className="text-6xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-8">
            Hire a model
          </h2>
          <p>
            Are you ready to step into the spotlight and showcase your talent?
            Contact us today to schedule your audition with Next Models Nepal.
          </p>
        </div>
      </motion.section>

      <HireModelForm />

      <section className="bg-background2 py-16 lg:py-24">
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
              <h2 className="text-white text-4xl font-light font-newsreader">
                Find a Face
              </h2>
              <h2 className="text-gold-500 text-5xl font-light tracking-tight font-newsreader">
                For Your Brand!
              </h2>
            </div>

            {/* Desktop Title */}
            <div className="hidden lg:flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h2 className="text-white text-3xl lg:text-5xl font-light font-newsreader">
                  Explore
                </h2>
                <Image
                  className="w-24 h-12 lg:w-36 lg:h-16 rounded-full border border-stone-300 mb-3"
                  width={32}
                  height={0}
                  src="/events_1.jpg"
                  alt=""
                />
                <h2 className="text-white text-4xl lg:text-5xl font-light font-newsreader">
                  Models
                </h2>
              </div>
              <h2 className="text-gold-500 text-5xl lg:text-6xl font-light font-newsreader tracking-tighter">
                Find a face for Your Brand!
              </h2>
            </div>
          </motion.div>

          {/* Grids */}
          <div className="space-y-16 md:space-y-24">
            {/* Female Models Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="space-y-8"
              id="female"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/small_star.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-8 h-8"
                />
                <h3 className="text-white text-xl lg:text-2xl font-medium font-newsreader tracking-tight">
                  Female Models
                </h3>
              </div>
              <ModelGrid models={femaleModels}>
                {(model) => (
                  <>
                    <h4 className=" text-gold-500 text-xl lg:text-2xl font-medium font-newsreader tracking-tight mb-2">
                      {model.name}
                    </h4>
                    <div className="flex gap-2">
                      <i className="w-4 h-4 ri-map-pin-line" />
                      <span className="text-white text-sm lg:text-base font-semibold font-urbanist">
                        {model.location}
                      </span>
                    </div>
                  </>
                )}
              </ModelGrid>
            </motion.div>

            {/* Male Models Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="space-y-8"
              id="male"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/small_star.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-8 h-8"
                />
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
                    <div className="flex gap-2 ">
                      <i className="w-4 h-4 ri-map-pin-line" />
                      <span className="text-white text-sm lg:text-base font-semibold font-urbanist">
                        {model.location}
                      </span>
                    </div>
                  </>
                )}
              </ModelGrid>
              {/* <div className="flex justify-end">
                <Link
                  href={"#"}
                  className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <span className="underline underline-offset-4">See All Male Models</span>
                  <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
                </Link>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
