"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "../../data/data";
import { Button } from "./ui/button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 relative z-20">
      <nav className="py-1">
        <div className="flex items-center justify-between w-full">
          {/* Logo  */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={98} height={82} />
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center gap-20">
            {/* Navigation Links */}
            <div className="flex items-center space-x-10">
              {menuItems.map((item) => {
                const showIcon =
                  item.label === "Events" || item.label === "Event Details";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center font-urbanist text-white hover:text-yellow-500 transition-colors"
                  >
                    {item.label}
                    {showIcon && <i className="ml-1 w-4 h-4 ri-arrow-drop-down-line" />}
                  </Link>
                );
              })}
            </div>

            {/* Apply Button */}
            <Button asChild variant="default">
              <Link href="/apply">Apply</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Apply Button */}
            
            
            {/* Hamburger Menu */}
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-yellow-500 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <i className={`text-2xl ${isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm border-t border-gray-800 z-30">
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => {
                const showIcon =
                  item.label === "Events" || item.label === "Event Details";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center justify-between font-urbanist text-white hover:text-yellow-500 transition-colors py-2 border-b border-gray-800 last:border-b-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {showIcon && <i className="w-4 h-4 ri-arrow-drop-down-line" />}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;