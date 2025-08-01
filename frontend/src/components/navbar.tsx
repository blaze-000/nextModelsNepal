"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { menuItems, SubmenuItem } from "../../data/data";
import { Button } from "./ui/button";

// Add CSS for slide-down animation
const styles = `
@keyframes slideDownFromTop {
  0% {
    opacity: 0;
    transform: translateY(-100vh);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.submenu-slide-down {
  animation: slideDownFromTop 0.3s ease forwards;
}
`;

// Inject styles into the page (you can move this to global CSS if preferred)
const StyleInjector = () => (
  <style dangerouslySetInnerHTML={{ __html: styles }} />
);

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<number | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSubmenuId(null);
  };

  const toggleSubmenu = (id: number) => {
    setOpenSubmenuId((prev) => (prev === id ? null : id));
  };

  // Type guard to check if items is a single array
  const isSingleColumnItems = (
    items: SubmenuItem[] | SubmenuItem[][]
  ): items is SubmenuItem[] => {
    return items.length > 0 && !Array.isArray(items[0]);
  };

  // Type guard to check if items is a multi-dimensional array
  const isMultiColumnItems = (
    items: SubmenuItem[] | SubmenuItem[][]
  ): items is SubmenuItem[][] => {
    return items.length > 0 && Array.isArray(items[0]);
  };

  return (
    <>
      <StyleInjector />
      <header className="w-full bg-background px-4 sm:px-6 lg:px-8 xl:px-36 relative z-20">
        <nav className="py-1">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={85} height={82} />
            </div>

            {/* Desktop Menu Items */}
            <div className="hidden md:flex items-center gap-20">
              <div className="flex items-center space-x-10">
                {menuItems.map((item) => {
                  const hasSubmenu = !!item.submenu;
                  const isOpen = openSubmenuId === item.id;

                  return (
                    <div key={item.id} className="relative">
                      <div className="flex items-center space-x-1">
                        <Link
                          href={item.href}
                          className="flex items-center font-urbanist text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                        {hasSubmenu && (
                          <button
                            onClick={() => toggleSubmenu(item.id)}
                            className="text-white"
                            aria-label="Toggle submenu"
                          >
                            <i
                              className={`w-4 h-4 ri-arrow-drop-down-line cursor-pointer transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Desktop Submenu */}
                      {hasSubmenu && isOpen && item.submenu && (
                        <div
                          className={`absolute top-full left-0 mt-2 bg-muted-background rounded shadow-lg z-50 p-4 submenu-slide-down ${
                            item.submenu.columns === 2
                              ? "min-w-[400px]"
                              : "min-w-[220px]"
                          }`}
                        >
                          {item.submenu.columns === 1 &&
                            isSingleColumnItems(item.submenu.items) && (
                              <div className="flex flex-col space-y-2 whitespace-nowrap min-w-max">
                                {item.submenu.items.map(
                                  (subItem: SubmenuItem, idx: number) => (
                                    <Link
                                      key={idx}
                                      href={subItem.href}
                                      className="flex items-center text-white text-sm"
                                    >
                                      <span className="underline underline-offset-2">
                                        {subItem.label}
                                      </span>
                                      <i className="ri-arrow-right-up-line ml-2" />
                                    </Link>
                                  )
                                )}
                              </div>
                            )}

                          {item.submenu.columns === 2 &&
                            isMultiColumnItems(item.submenu.items) && (
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                    <span>{item.submenu.titles?.[0]}</span>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    {item.submenu.items[0].map(
                                      (subItem: SubmenuItem, idx: number) => (
                                        <Link
                                          key={idx}
                                          href={subItem.href}
                                          className="flex items-center text-white text-sm"
                                        >
                                          <span className="underline underline-offset-2">
                                            {subItem.label}
                                          </span>
                                          <i className="ri-arrow-right-up-line ml-2" />
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                    <span>{item.submenu.titles?.[1]}</span>
                                  </div>
                                  <div className="flex flex-col space-y-2">
                                    {item.submenu.items[1].map(
                                      (subItem: SubmenuItem, idx: number) => (
                                        <Link
                                          key={idx}
                                          href={subItem.href}
                                          className="flex items-center text-white text-sm"
                                        >
                                          <span className="underline underline-offset-2 text-nowrap">
                                            {subItem.label}
                                          </span>
                                          <i className="ri-arrow-right-up-line ml-2" />
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
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
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:text-yellow-500 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <i
                  className={`text-2xl ${
                    isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm z-30">
              <div className="px-8 py-6">
                {menuItems.map((item) => {
                  const hasSubmenu = !!item.submenu;
                  const isOpen = openSubmenuId === item.id;

                  return (
                    <div key={item.id} className="pt-6">
                      <div className="flex items-center justify-between font-urbanist text-white transition-colors">
                        <Link
                          href={item.href}
                          onClick={() =>
                            !hasSubmenu && setIsMobileMenuOpen(false)
                          }
                        >
                          {item.label}
                        </Link>
                        {hasSubmenu && (
                          <button
                            onClick={() => toggleSubmenu(item.id)}
                            aria-label="Toggle submenu"
                          >
                            <i
                              className={`text-xl ri-arrow-drop-down-line transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Mobile Submenu */}
                      {hasSubmenu && isOpen && item.submenu && (
                        <div className="pl-4 pt-4">
                          {item.submenu.columns === 1 &&
                            isSingleColumnItems(item.submenu.items) && (
                              <div className="flex flex-col space-y-4 whitespace-nowrap min-w-max">
                                {item.submenu.items.map(
                                  (subItem: SubmenuItem, idx: number) => (
                                    <Link
                                      key={idx}
                                      href={subItem.href}
                                      className="flex items-center text-white text-sm"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <span className="underline underline-offset-2">
                                        {subItem.label}
                                      </span>
                                      <i className="ri-arrow-right-up-line ml-2" />
                                    </Link>
                                  )
                                )}
                              </div>
                            )}

                          {item.submenu.columns === 2 &&
                            isMultiColumnItems(item.submenu.items) && (
                              <div className="grid grid-cols-2 gap-6 pt-2">
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                    <span>{item.submenu.titles?.[0]}</span>
                                  </div>
                                  <div className="flex flex-col space-y-4">
                                    {item.submenu.items[0].map(
                                      (subItem: SubmenuItem, idx: number) => (
                                        <Link
                                          key={idx}
                                          href={subItem.href}
                                          className="flex items-center text-white text-sm"
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                        >
                                          <span className="underline underline-offset-2 leading-tight">
                                            {subItem.label}
                                          </span>
                                          <i className="ri-arrow-right-up-line ml-2" />
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                    <span>{item.submenu.titles?.[1]}</span>
                                  </div>
                                  <div className="flex flex-col space-y-4">
                                    {item.submenu.items[1].map(
                                      (subItem: SubmenuItem, idx: number) => (
                                        <Link
                                          key={idx}
                                          href={subItem.href}
                                          className="flex items-center text-white text-sm"
                                          onClick={() =>
                                            setIsMobileMenuOpen(false)
                                          }
                                        >
                                          <span className="underline underline-offset-2 leading-tight">
                                            {subItem.label}
                                          </span>
                                          <i className="ri-arrow-right-up-line ml-2" />
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
