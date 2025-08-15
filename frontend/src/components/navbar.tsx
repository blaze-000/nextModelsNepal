"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import Axios from "@/lib/axios-instance";



export default function Header() {
  const [selfEvents, setSelfEvents] = useState<NavEventType[] | null>(null);
  const [partnersEvents, setPartnersEvents] = useState<NavEventType[] | null>(null);
  const [showVoting, setShowVoting] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Home", href: "/" },
    { label: "Voting", href: "/voting" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ];

  const eventCentralDropdownList = [
    { label: "Upcoming Events", href: "/events/upcoming-events" },
    { label: "Past Events & Winners", href: "/events/past-events" },
    { label: "Events Highlight Gallery", href: "/events/gallery" },
    { label: "Press & Media Coverage", href: "/events/news-press" }
  ];

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios("/api/nav/info");
        const data = res.data;
        // console.log(data.data);
        setShowVoting(data.data.showVoting);
        setSelfEvents(data.data.selfEvents);
        setPartnersEvents(data.data.partnerEvents);
      }
      catch {
        console.log("Nav info fetch failed");
      }
    })();
  }, []);

  return (
    <header className="w-full bg-background2">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Image src="/logo.png" alt="logo" width={100} height={100} />
        </div>
        <div className="flex justify-between items-center gap-16">
          <nav className="flex justify-between gap-8">
            <Link href="/">Home</Link>

            <button role="button" className="cursor-pointer flex items-center gap-1">
              Events
              <i className="ri-arrow-drop-down-line" />
            </button>

            <Link href="/events" className="cursor-pointer flex items-center gap-1">
              Events Central
              <i className="ri-arrow-drop-down-line" />
            </Link>

            <Link href="/voting">Voting</Link>

            <Link href="/about">About Us</Link>

            <Link href="/contact">Contact Us</Link>

          </nav>
          <Button>Apply</Button>
        </div>
      </div>
    </header>
  );
};