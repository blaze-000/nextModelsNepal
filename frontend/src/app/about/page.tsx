"use client";

import Image from "next/image";
import { motion } from 'framer-motion';
import NewsSection from "@/components/home/newsAndCoverage";

export default function About() {
  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="h-[40vh] mdplus:h-[70vh] bg-black bg-cover bg-center relative"
        style={{ backgroundImage: "url('/events_1.jpg')" }}
      >
        {/* Gradient mask */}
        <div className="hidden mdplus:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="mdplus:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden mdplus:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-light tracking-tighter leading-tighter">
            <div className="flex items-center gap-4 mt-2">
              <span>About</span>
              <Image
                src="/handshake.jpg"
                alt="Handshake"
                width={160}
                height={64}
                className="h-16 w-24 rounded-full object-cover hidden md:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <div className="w-56 h-14 rounded-full border-2 border-gold-500" />
              <span>Us</span>
            </div>
          </h2>

          <p className="mt-6 text-base max-w-xl text-white font-light">
            Next Models Nepal" stands as a dynamic force in Nepal's entertainment and fashion industry, offering comprehensive event management, model management, and talent management services. Established as a pioneering entity in the Nepalese market, it serves as a one-stop destination for individuals and organizations seeking top-notch solutions in the realms of modeling, talent representation, and event planning.
          </p>
        </div>
      </motion.section>

      {/* Texts Mobile - ABOUT US */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="flex mdplus:hidden py-30 bg-black">
        <div className="text-center px-6">
          <h2 className="text-6xl flex flex-col font-newsreader text-primary font-extralight tracking-tighter leading-tighter pb-8">
            <span>About</span>
            <span>Us</span>
          </h2>
          <p className="text-lg px-8">
            Next Models Nepal" stands as a dynamic force in Nepal's entertainment and fashion industry, offering comprehensive event management, model management, and talent management services. Established as a pioneering entity in the Nepalese market, it serves as a one-stop destination for individuals and organizations seeking top-notch solutions in the realms of modeling, talent representation, and event planning.
          </p>
        </div>
      </motion.section>

      {/* Intro Section */}
      <section className="w-full pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <h2 className="font-newsreader text-5xl mdplus:text-6xl font-light text-center mdplus:text-left tracking-tighter">
            <div className="flex flex-col mdplus:flex-row mdplus:gap-2.5">
              <span>We are  </span>
              <span>Next Models Nepal</span>
            </div>
            <div className="text-primary">And we're here to empower talent,</div>
            <div className="hidden mdplus:flex text-primary items-center gap-4">
              <span>one</span>
              <Image
                src="/spotlight.png"
                alt=""
                width={150}
                height={0}
                className="hidden mdplus:flex w-28 h-14 rounded-full border-stone-300 border-[1px] object-cover"
              />
              <span> spotlight at a time.</span>
            </div>
            <div className="text-primary mdplus:hidden">one spotlight at a time.</div>
          </h2>

          <div className="flex justify-end">
            <p className="text-center mdplus:text-right mdplus:max-w-3xl font-light text-base">
              As an event management powerhouse, 'Next Models Nepal' excels in conceptualizing, planning, and executing a diverse range of events, from fashion shows and product launches to corporate gatherings and cultural extravaganzas. With a team of experienced professionals at the helm, the company ensures seamless coordination, impeccable execution, and memorable experiences that exceed client expectations.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-24 hidden mdplus:flex">
          <Image
            src="/about.png"
            alt=""
            width={600}
            height={400}
            className="w-full h-auto max-h-96 object-cover object-top"
          />
        </div>
      </section>

      {/* List of [title, paragraph, image] */}
      <section className="w-full">
        <div className="max-w-7xl mx-auto px-4 space-y-36">

          {/* A Home for Diverse Talent */}
          <article className="grid mdplus:grid-cols-[1fr_0.8fr] gap-6 mdplus:gap-20">
            <Image
              src="/events_1.jpg"
              alt=""
              width={500}
              height={0}
              className="object-cover w-full h-86"
            />
            <div className="flex flex-col gap-4 justify-center h-full ">
              <h3 className="text-5xl text-primary font-newsreader font-light max-w-lg">
                <span className="text-white">A Home for </span>Diverse Talent
              </h3>
              <p>
                Next Models Nepal is proud to represent a vibrant roster of models and artists of all ages, sizes, and backgrounds. With a sharp eye for discovering emerging talent, we offer the support, guidance, and platform needed to thrive in the competitive world of fashion and entertainment.
              </p>
            </div>
          </article>

          {/* Beyond Modeling: Full-Spectrum Talent Management */}
          <article className="grid mdplus:grid-cols-[0.8fr_1fr] gap-6 mdplus:gap-20">
            <Image
              src="/events_1.jpg"
              alt=""
              width={500}
              height={0}
              className="object-cover w-full h-86 mdplus:order-2"
            />
            <div className="flex flex-col gap-4 justify-center h-full mdplus:order-1 text-right mdplus:text-left">
              <h3 className="text-5xl text-primary font-newsreader font-light ml-20 mdplus:ml-0">
                <span className="text-white">Beyond Modeling: </span> <br className="hidden mdplus:flex" />Full-Spectrum Talent Management
              </h3>
              <p>
                We’re more than just a modeling agency. From actors and dancers to musicians and influencers, we manage a wide array of creative professionals. Through career planning, brand partnerships, and exclusive networking opportunities, we help each individual reach their full potential.
              </p>
            </div>
          </article>

          {/* A Reputation Built on Professionalism */}
          <article className="grid mdplus:grid-cols-[1fr_0.8fr] gap-6 mdplus:gap-20">
            <Image
              src="/events_1.jpg"
              alt=""
              width={500}
              height={0}
              className="object-cover w-full h-86"
            />
            <div className="flex flex-col gap-4 justify-center h-full ">
              <h3 className="text-5xl text-primary font-newsreader font-light max-w-xl">
                <span className="text-white">A Reputation </span><br className="hidden mdplus:flex" />Built on Professionalism
              </h3>
              <p>
                At the heart of everything we do is a commitment to integrity, excellence, and trust. Whether managing major events or representing rising stars, we uphold the highest standards of quality, reliability, and ethical conduct—earning the respect of clients and industry leaders alike.
              </p>
            </div>
          </article>

          {/* Shaping the Future of Nepal's Creative Scene */}
          <article className="grid mdplus:grid-cols-[0.8fr_1fr] gap-6 mdplus:gap-20">
            <Image
              src="/events_1.jpg"
              alt=""
              width={500}
              height={0}
              className="object-cover w-full h-86 mdplus:order-2"
            />
            <div className="flex flex-col gap-4 justify-center h-full order-1 mdplus:order-1 text-right mdplus:text-left">
              <h3 className="text-5xl text-primary font-newsreader font-light ml-20 mdplus:ml-0">
                <span className="text-white">Shaping the Future of</span> Nepal's Creative Scene
              </h3>
              <p>
                We’re more than just a modeling agency. From actors and dancers to musicians and influencers, we manage a wide array of creative professionals. Through career planning, brand partnerships, and exclusive networking opportunities, we help each individual reach their full potential.
              </p>
            </div>
          </article>

        </div>
      </section>

      <NewsSection />

    </main>
  );
}