"use client";
import { useState, useEffect, useRef } from "react";
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
  
  // Mobile view states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [mobileEventsDropdownOpen, setMobileEventsDropdownOpen] = useState<boolean>(false);
  const [mobileEventsCentralDropdownOpen, setMobileEventsCentralDropdownOpen] = useState<boolean>(false);
  
  // Refs for dropdown containers
  const eventsDropdownRef = useRef<HTMLDivElement>(null);
  const eventsCentralDropdownRef = useRef<HTMLDivElement>(null);
  const eventsButtonRef = useRef<HTMLButtonElement>(null);
  const eventsCentralButtonRef = useRef<HTMLDivElement>(null);

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

  // Toggle functions that ensure only one dropdown is open at a time
  const toggleEventsDropdown = () => {
    const newState = !showEventsDropdown;
    setShowEventsDropdown(newState);
    if (newState && showEventsCentralDropdown) {
      setShowEventsCentralDropdown(false);
    }
  };

  const toggleEventsCentralDropdown = () => {
    const newState = !showEventsCentralDropdown;
    setShowEventsCentralDropdown(newState);
    if (newState && showEventsDropdown) {
      setShowEventsDropdown(false);
    }
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowEventsDropdown(false);
    setShowEventsCentralDropdown(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios("/api/nav/info");
        const data = res.data;
        setShowVoting(data.data.showVoting);
        setSelfEvents(data.data.selfEvents);
        setPartnersEvents(data.data.partnerEvents);
      }
      catch {
        console.log("Nav info fetch failed");
      }
    })();
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If both dropdowns are closed, do nothing
      if (!showEventsDropdown && !showEventsCentralDropdown) return;
      
      // Check if click is within any dropdown or button
      const isClickInEventsDropdown = eventsDropdownRef.current?.contains(event.target as Node);
      const isClickInEventsButton = eventsButtonRef.current?.contains(event.target as Node);
      const isClickInEventsCentralDropdown = eventsCentralDropdownRef.current?.contains(event.target as Node);
      const isClickInEventsCentralButton = eventsCentralButtonRef.current?.contains(event.target as Node);
      
      // If click is outside all dropdowns and buttons, close them
      if (
        !isClickInEventsDropdown && 
        !isClickInEventsButton && 
        !isClickInEventsCentralDropdown && 
        !isClickInEventsCentralButton
      ) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEventsDropdown, showEventsCentralDropdown]);

  // Responsive dropdowns - same for desktop and mobile
  const EventsDropdown = () => (
    <div 
      ref={eventsDropdownRef}
      className="grid grid-cols-[0.45fr_0.55fr] w-full mdplus:w-md gap-6 bg-muted-background p-6 pb-8 mdplus:-ml-[30%] rounded-lg mdplus:rounded-none"
    >
      <div className="space-y-4">
        <h4 className="text-xs text-primary">Our Events</h4>
        <div className="flex flex-col gap-3 text-sm">
          {selfEvents?.map(item => (
            <Link
              key={item.label}
              href={`/events/${item.slug}`}
              onClick={() => {
                setIsMobileMenuOpen(false);
                closeAllDropdowns();
              }}
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
              onClick={() => {
                setIsMobileMenuOpen(false);
                closeAllDropdowns();
              }}
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
    <div 
      ref={eventsCentralDropdownRef}
      className="bg-muted-background p-6 pt-4 w-full mdplus:w-auto rounded-lg mdplus:rounded-none"
    >
      <div className="flex flex-col gap-3 text-sm">
        {eventCentralDropdownList?.map(item => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => {
              setIsMobileMenuOpen(false);
              closeAllDropdowns();
            }}
          >
            <span className="underline underline-offset-4">{item.label}</span>
            <i className="ri-arrow-right-up-line ml-2 text-lg" />
          </Link>
        ))}
      </div>
    </div>
  );

  // Toggle mobile dropdowns with only one open at a time
  const toggleMobileEventsDropdown = () => {
    if (mobileEventsCentralDropdownOpen) {
      setMobileEventsCentralDropdownOpen(false);
    }
    setMobileEventsDropdownOpen(!mobileEventsDropdownOpen);
  };

  const toggleMobileEventsCentralDropdown = () => {
    if (mobileEventsDropdownOpen) {
      setMobileEventsDropdownOpen(false);
    }
    setMobileEventsCentralDropdownOpen(!mobileEventsCentralDropdownOpen);
  };

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
            <Link 
              className="text-nowrap" 
              href={menuItems[0].href}
              onClick={closeAllDropdowns}
            >
              {menuItems[0].label}
            </Link>
            {/* Events */}
            <div className="flex gap-2">
              <button
                ref={eventsButtonRef}
                onClick={toggleEventsDropdown}
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
            <div ref={eventsCentralButtonRef} className="flex gap-1">
              <Link 
                href="/events" 
                className="cursor-pointer flex items-center gap-1 text-nowrap"
                onClick={closeAllDropdowns}
              >
                Events Central
              </Link>
              <button
                role="button"
                onClick={toggleEventsCentralDropdown}
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
              <Link 
                className="text-nowrap" 
                href={menuItems[1].href}
                onClick={closeAllDropdowns}
              >
                {menuItems[1].label}
              </Link>
            }
            {/* About Us */}
            <Link 
              className="text-nowrap" 
              href={menuItems[2].href}
              onClick={closeAllDropdowns}
            >
              {menuItems[2].label}
            </Link>
            {/* Contact Us */}
            <Link 
              className="text-nowrap" 
              href={menuItems[3].href}
              onClick={closeAllDropdowns}
            >
              {menuItems[3].label}
            </Link>
          </nav>
          {/* Apply Button */}
          <Link href="/apply" onClick={closeAllDropdowns}>
            <Button variant="default">Apply</Button>
          </Link>
        </div>
        {/* Mobile : Apply/Vote Button and Hamburger */}
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
            className={`${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-3xl text-foreground/90 cursor-pointer`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mdplus:hidden bg-background2 border-t border-foreground/40">
          <div className="px-6 py-4 flex flex-col gap-3 divide-y-[1px] divide-foreground/20">
            {/* Home */}
            <Link
              href={menuItems[0].href}
              className="py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItems[0].label}
            </Link>
            {/* Events */}
            <div className="py-2">
              <button
                onClick={toggleMobileEventsDropdown}
                className="flex justify-between items-center w-full"
              >
                <span>Events</span>
                {mobileEventsDropdownOpen ?
                  <i className="ri-arrow-up-s-line text-lg" /> :
                  <i className="ri-arrow-down-s-line text-lg" />
                }
              </button>
              {mobileEventsDropdownOpen && <EventsDropdown />}
            </div>
            {/* Events Central */}
            <div className="py-2">
              <div className="flex justify-between items-center">
                <Link
                  href="/events"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Events Central
                </Link>
                <button
                  onClick={toggleMobileEventsCentralDropdown}
                  className="ml-2"
                >
                  {mobileEventsCentralDropdownOpen ?
                    <i className="ri-arrow-up-s-line text-lg" /> :
                    <i className="ri-arrow-down-s-line text-lg" />
                  }
                </button>
              </div>
              {mobileEventsCentralDropdownOpen && <EventsCentralDropdown />}
            </div>
            {/* About Us */}
            <Link
              href={menuItems[2].href}
              className="py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItems[2].label}
            </Link>
            {/* Contact Us */}
            <Link
              href={menuItems[3].href}
              className="py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {menuItems[3].label}
            </Link>
            {/* Apply - Normal menu item in mobile */}
            {showVoting &&
              <Link
                href="/apply"
                className="py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Apply
              </Link>
            }
          </div>
        </div>
      )}
    </header>
  );
};