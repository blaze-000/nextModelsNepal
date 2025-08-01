"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { menuItems } from "../../data/data";
import { Button } from "./ui/button";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<number | null>(null);
  const submenuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSubmenuId(null);
  };

  const toggleSubmenu = (id: number) => {
    setOpenSubmenuId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setOpenSubmenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-background px-4 sm:px-6 lg:px-8 xl:px-36 relative z-20"
    >
      <nav className="py-1">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={85} height={82} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden mdplus:flex items-center gap-20">
            <div className="flex items-center space-x-10">
              {menuItems.map((item, index) => {
                const hasSubmenu = !!item.submenu;
                const isOpen = openSubmenuId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative"
                    ref={(el) => (submenuRefs.current[index] = el)}
                  >
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
                    <AnimatePresence>
                      {hasSubmenu && isOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full left-0 mt-2 bg-muted-background rounded shadow-lg z-50 p-4 ${
                            item.submenu.columns === 2
                              ? "min-w-[400px]"
                              : "min-w-[220px]"
                          }`}
                        >
                          {item.submenu.columns === 1 && (
                            <div className="flex flex-col space-y-2 whitespace-nowrap min-w-max">
                              {item.submenu.items.map((subItem, idx) => (
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
                              ))}
                            </div>
                          )}

                          {item.submenu.columns === 2 && (
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                  <span>{item.submenu.titles?.[0]}</span>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  {item.submenu.items[0].map((subItem, idx) => (
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
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                  <span>{item.submenu.titles?.[1]}</span>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  {item.submenu.items[1].map((subItem, idx) => (
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
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <Button asChild variant="default">
              <Link href="/apply">Apply</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="mdplus:hidden flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white transition-colors"
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm z-30"
            >
              <div className="px-8 py-6">
                {menuItems.map((item) => {
                  const hasSubmenu = !!item.submenu;
                  const isOpen = openSubmenuId === item.id;

                  return (
                    <div key={item.id} className="pt-6">
                      <div className="flex items-center justify-between font-urbanist text-white transition-colors">
                        <Link
                          href={item.href}
                          onClick={() => !hasSubmenu && setIsMobileMenuOpen(false)}
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
                      {hasSubmenu && isOpen && (
                        <div className="pl-4 pt-4">
                          {item.submenu.columns === 1 && (
                            <div className="flex flex-col space-y-4 whitespace-nowrap min-w-max">
                              {item.submenu.items.map((subItem, idx) => (
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
                              ))}
                            </div>
                          )}

                          {item.submenu.columns === 2 && (
                            <div className="grid grid-cols-2 gap-6 pt-2">
                              <div>
                                <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                  <span>{item.submenu.titles?.[0]}</span>
                                </div>
                                <div className="flex flex-col space-y-4">
                                  {item.submenu.items[0].map((subItem, idx) => (
                                    <Link
                                      key={idx}
                                      href={subItem.href}
                                      className="flex items-center text-white text-sm"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <span className="underline underline-offset-2 leading-tight">
                                        {subItem.label}
                                      </span>
                                      <i className="ri-arrow-right-up-line ml-2" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                                  <span>{item.submenu.titles?.[1]}</span>
                                </div>
                                <div className="flex flex-col space-y-4">
                                  {item.submenu.items[1].map((subItem, idx) => (
                                    <Link
                                      key={idx}
                                      href={subItem.href}
                                      className="flex items-center text-white text-sm"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <span className="underline underline-offset-2 leading-tight">
                                        {subItem.label}
                                      </span>
                                      <i className="ri-arrow-right-up-line ml-2" />
                                    </Link>
                                  ))}
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
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
