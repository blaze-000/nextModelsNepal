"use client";
import ContactForm from "@/components/home/contact-form";
import Image from "next/image";
import { motion } from 'framer-motion';

export default function ContactUs() {
  return (
    <main>
      {/* Hero image and text */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="h-[40vh] md:h-[80vh] bg-black bg-[url('/contact-us-cover.jpg')] bg-cover bg-center relative"
      >
        {/* Gradient mask */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        {/* Texts Desktop */}
        <div className="max-w-7xl mx-auto relative z-10 hidden md:flex flex-col justify-center h-full px-6">
          <h2 className="text-8xl font-newsreader text-primary font-extralight tracking-tighter leading-tighter">
            <span>Contact</span>
            <div className="flex items-baseline gap-3 mt-2">
              <Image
                src="/handshake.jpg"
                alt="Handshake"
                width={160}
                height={64}
                className="h-16 w-40 rounded-full object-cover hidden md:flex border-stone-300 shadow-[-10px_8px_20px_10px_rgba(179,131,0,0.19)]"
              />
              <span>Us</span>
            </div>
          </h2>

          <p className="mt-6 text-base max-w-lg text-white font-light">
            Are you ready to step into the spotlight and showcase your talent? Contact us today to schedule your audition with Next Models Nepal.
          </p>
        </div>
      </motion.section>

      {/* Texts Mobile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.6 }}
        className="flex md:hidden py-30 bg-black">
        <div className="text-center px-6">
          <h2 className="text-5xl font-newsreader text-primary font-extralight tracking-tighter leading-tight pb-8">
            Contact Us
          </h2>
          <p>
            Are you ready to step into the spotlight and showcase your talent? Contact us today to schedule your audition with Next Models Nepal.
          </p>
        </div>
      </motion.section>

      <ContactForm />
    </main>
  );
}
