"use client";
import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import NewsLetterBox from "./molecules/newsleterbox";
import Link from "next/link";
import Axios from "@/lib/axios-instance";
import { useState, useEffect } from "react";

interface SocialData {
  _id: string;
  instagram: string;
  x: string;
  fb: string;
  linkdln: string;
  phone: string[];
  mail: string;
  location: string;
  __v: number;
}

interface SocialApiResponse {
  success: boolean;
  social: SocialData[];
}

const Footer = ({ events }: { events: NavEventType[] }): ReactNode => {
  const [socialData, setSocialData] = useState<SocialData | null>(null);
  // const [events, setEvents] = useState<NavEvent[]>([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const currentYear: number = new Date().getFullYear();

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const response = await Axios.get<SocialApiResponse>("/api/social");
        if (response.data.success && response.data.social.length > 0) {
          setSocialData(response.data.social[0]);
        }
      } catch (err) {
        console.error("Error fetching social data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, []);

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/apply" },
    { label: "Contact", href: "/contact" }
  ];

  // events will be populated from /api/nav/info

  // Variants
  const container = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <div className="w-full bg-background2 border-t border-white/20 text-white relative p-6">Loading...</div>;
  }

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full bg-background2 border-t border-white/20 text-white relative"
      variants={container}
    >
      <div className="px-6 pt-9 max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <motion.div variants={item} className="flex justify-center">
          <NewsLetterBox />
        </motion.div>

        {/* Main Footer Content */}
        <motion.div variants={item} className="py-10 px-4">
          <div className="grid grid-cols-[1fr_1.4fr] md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] gap-12 lg:gap-8">
            {/* Company Info */}
            <motion.div
              variants={item}
              className="text-center md:text-left col-span-2 md:col-span-1"
            >
              <Image
                width={116}
                height={86}
                alt="Next Models Nepal Logo"
                src="/logo.png"
                className="mx-auto md:mx-0"
              />
              <p className="text-base tracking-normal leading-loose">
                Nepal&rsquo;s No.1 Modeling Agency
              </p>
              <div className="flex items-center gap-4 pt-3 justify-center md:justify-start">
                {socialData && (
                  <>
                    <Link
                      href={socialData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                      <i className="ri-instagram-line" />
                    </Link>
                    <Link
                      href={socialData.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                      <i className="ri-twitter-x-line" />
                    </Link>
                    <Link
                      href={socialData.fb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                      <i className="ri-facebook-circle-line" />
                    </Link>
                    <Link
                      href={socialData.linkdln}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gold-500 w-8 h-8 p-1.5 text-black rounded-full hover:opacity-80 transition-opacity flex items-center justify-center"
                    >
                      <i className="ri-linkedin-box-line" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={item} className="space-y-8 md:space-y-6 col-span-1">
              <h3 className="text-base font-semibold">Quick Links</h3>
              <nav >
                <ul className="space-y-6 flex flex-col">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-base font-light hover:text-gold-400 transition-colors cursor-pointer tracking-wider"
                      >
                        {link.label}
                      </Link>
                    </li>

                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* Events */}
            <motion.div variants={item} className="space-y-8 md:space-y-6 col-span-1">
              <h3 className="text-base font-semibold">Events</h3>
              <nav>
                <ul className="space-y-4 flex flex-col">
                  {(events || []).map((event) => (
                    <li key={event.label}>
                      <Link
                        href={`events/${event.slug}`}
                        className="text-base font-light hover:text-gold-400 transition-colors cursor-pointer underline underline-offset-4 tracking-wider"
                      >
                        {event.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* Contact */}
            <motion.div
              id="footer-contact"
              variants={item}
              className="space-y-8 md:space-y-6 col-span-2 md:col-span-1 outline-none"
            >
              <h3 className="text-base font-semibold">Contact</h3>
              <ul className="flex flex-col gap-4">
                {/* Fixed phone number handling for array */}
                {socialData?.phone && socialData.phone.length > 0 && (
                  socialData.phone.map((phoneNumber, index) => (
                    <li key={index}>
                      <Link
                        href={`tel:+977${phoneNumber.replace(/\D/g, '')}`}
                        className="group/phone hover:text-gold-400"
                      >
                        <i className="w-5 h-5 text-white flex-shrink-0 ri-phone-line group-hover/phone:text-gold-400 mr-3" />
                        <span className="text-base font-light transition-colors">
                          {phoneNumber}
                        </span>
                      </Link>
                    </li>
                  ))
                )}

                <li>
                  <Link
                    href={`mailto:${socialData?.mail || 'info@nextmodelsnepal.com'}`}
                    className="group/mail"
                  >
                    <i className="w-5 h-5 text-white flex-shrink-0 ri-mail-line group-hover/mail:text-gold-400 mr-3" />
                    <span className="text-base font-light group-hover/mail:text-gold-400 transition-colors">
                      {socialData?.mail || 'info@nextmodelsnepal.com'}
                    </span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="w-5 h-5 text-white flex-shrink-0 ri-map-pin-line mr-3" />
                    <span className="text-base font-light transition-colors cursor-default">
                      {socialData?.location || 'Putalisadak, Kathmandu, Nepal'}
                    </span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div variants={item} className="border-t border-white/20 py-7">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm font-light opacity-65 text-center mdplus:text-center">
              Copyright © 2013 - {currentYear} Next Models Nepal. All Rights Reserved. Empowered by <Link href="https://protozoahost.com" rel="noopener noreferrer" target="_blank" className="font-bold text-nowrap hover:underline underline-offset-1">Protozoa Host</Link>
            </div>
          </div>
        </motion.div>
      </div >
    </motion.footer >
  );
};

export default Footer;