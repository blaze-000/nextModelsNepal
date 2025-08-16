"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import Axios from "@/lib/axios-instance";

export default function Header() {
  const [showEventsDropdown, setShowEventsDropdown] = useState<boolean>(false);
  const [showEventsCentralDropdown, setShowEventsCentralDropdown] = useState<boolean>(false);

  const [selfEvents, setSelfEvents] = useState<NavEventType[] | null>(null);
  const [partnersEvents, setPartnersEvents] = useState<NavEventType[] | null>(null);
  const [showVoting, setShowVoting] = useState<boolean>(true);

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
        // console.log(data.data.showVoting);
        setShowVoting(data.data.showVoting);
        setSelfEvents(data.data.selfEvents);
        setPartnersEvents(data.data.partnerEvents);
      }
      catch {
        console.log("Nav info fetch failed");
      }
    })();
  }, []);

  const EventsDropdown = () => (
    <div className="grid grid-cols-[0.45fr_0.55fr] w-md gap-6 bg-muted-background p-6 pb-8 -ml-[30%]">

      <div className="space-y-4">
        <h4 className="text-xs text-primary">Our Events</h4>
        <div className="flex flex-col gap-3 text-sm">
          {selfEvents?.map(item => (
            <Link
              key={item.label}
              href={`/events/${item.slug}`}
            >
              <span className="underline underline-offset-4">{item.label}</span>
              <i className="ri-arrow-right-up-line ml-2 text-lg" />
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs">Managed Events</h4>
        <div className="flex flex-col gap-3 text-sm">
          {partnersEvents?.map(item => (
            <Link
              key={item.label}
              href={`/events/${item.slug}`}
            >
              <span className="underline underline-offset-4">{item.label}</span>
              <i className="ri-arrow-right-up-line ml-2 text-lg" />
            </Link>
          ))}
        </div>
      </div>
    </div >
  );

  const EventsCentralDropdown = () => (
    <div className=" bg-muted-background p-6 pt-4">
      <div className="flex flex-col gap-3 text-sm">
        {eventCentralDropdownList?.map(item => (
          <Link
            key={item.label}
            href={item.href}
          >
            <span className="underline underline-offset-4">{item.label}</span>
            <i className="ri-arrow-right-up-line ml-2 text-lg" />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <header className="w-full bg-background2">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">

        <Image
          src="/logo.png"
          alt="logo"
          width={75}
          height={100}
          className="flex items-center"
          priority={true}
        />

        {/* Desktop Navbar */}
        <div className="mdplus:flex justify-between items-center gap-16 hidden relative">
          <nav className="flex justify-between gap-8">

            {/* Home */}
            <Link className="text-nowrap" href={menuItems[0].href}>
              {menuItems[0].label}
            </Link>

            {/* Events */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                role="button"
                className="cursor-pointer flex items-center gap-1"
              >
                Events
                {showEventsDropdown ? <i className="ri-arrow-drop-up-line" /> : <i className="ri-arrow-drop-down-line" />}
              </button>
              <div className="absolute top-full z-40">
                {showEventsDropdown && <EventsDropdown />}
              </div>
            </div>


            {/* Events Central */}
            <div className="flex gap-1">
              <Link href="/events" className="cursor-pointer flex items-center gap-1 text-nowrap">
                Events Central
              </Link>
              <button
                role="button"
                onClick={() => setShowEventsCentralDropdown(!showEventsCentralDropdown)}
                className="cursor-pointer"
              >
                {showEventsCentralDropdown ? <i className="ri-arrow-drop-up-line" /> : <i className="ri-arrow-drop-down-line" />}
              </button>
              <div className="absolute top-full z-40">
                {showEventsCentralDropdown && <EventsCentralDropdown />}
              </div>
            </div>

            {/* Voting */}
            {showVoting &&
              <Link className="text-nowrap" href={menuItems[1].href}>{menuItems[1].label}</Link>
            }

            {/* About Us */}
            <Link className="text-nowrap" href={menuItems[2].href}>
              {menuItems[2].label}
            </Link>

            {/* Contact Us */}
            <Link className="text-nowrap" href={menuItems[3].href}>
              {menuItems[3].label}
            </Link>

          </nav>

          {/* Apply Button */}
          <Link href="/apply">
            <Button variant="default">Apply</Button>
          </Link>

        </div>

        {/* Vote or Apply Button and Hamburger Menu */}
        <div className="mdplus:hidden flex items-center gap-8">

          {!showVoting &&
            <Link href="/apply">
              <Button className="py-2.5" variant="default">Apply</Button>
            </Link>
          }

          {showVoting &&
            <Link href="/voting">
              <Button className="py-2.5" variant="default">Vote</Button>
            </Link>
          }

          <button
            role="button"
            className="ri-menu-line text-3xl text-foreground/90 cursor-pointer"
          />
        </div>

      </div>
    </header>
  );
};