"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems } from "../../data/data";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 relative z-10">
      <nav className="py-1">
        <div className="flex items-center justify-between w-full">
          {/* Logo  */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={98} height={82} />
          </div>

          {/* Menu Items */}
          <div className="flex items-center gap-20">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-10">
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
        </div>
      </nav>
    </header>
  );
};

export default Header;