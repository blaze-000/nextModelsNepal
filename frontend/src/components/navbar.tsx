"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Events",
    href: "/#",
    submenu: {
      columns: 2,
      titles: ["Our Events", "Managed Events"],
      items: [
        [
          { label: "Model Hunt Nepal", href: "/events/model-hunt-nepal" },
          { label: "Mister Nepal", href: "/events/mister-nepal" },
          { label: "Miss Nepal Peace", href: "/events/miss-nepal-peace" },
        ],
        [
          {
            label: "Kathmandu Fashion Week",
            href: "/events/kathmandu-fashion-week",
          },
          {
            label: "IEC Designers Runway",
            href: "/events/iec-designers-runway",
          },
        ],
      ],
    },
  },
  {
    id: 3,
    label: "Events Central",
    href: "/events",
    submenu: {
      columns: 1,
      items: [
        { label: "Upcoming Events", href: "/events/upcoming-events" },
        { label: "Past Events & Winners", href: "/events/past-winners" },
        { label: "Events Highlights Gallery", href: "/events/gallery" },
        { label: "Press & Media Coverage", href: "/events/media" },
      ],
    },
  },
  {
    id: 4,
    label: "Voting",
    href: "/voting",
  },
  {
    id: 5,
    label: "About Us",
    href: "/about",
  },
  {
    id: 6,
    label: "Contact Us",
    href: "/contact",
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenuId, setOpenSubmenuId] = useState<number | null>(null);
  const submenuRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenSubmenuId(null);
  };

  const handleSubmenuClick = (id: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenSubmenuId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    // Removed console.log
  }, [openSubmenuId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if clicking outside both desktop submenus AND mobile menu
      const clickedInsideDesktopSubmenu = submenuRefs.current.some(
        (ref) => ref && ref.contains(event.target as Node)
      );

      const clickedInsideMobileMenu = mobileMenuRef.current &&
        mobileMenuRef.current.contains(event.target as Node);

      if (!clickedInsideDesktopSubmenu && !clickedInsideMobileMenu) {
        setOpenSubmenuId(null);
      }
    };

    // Only add the listener if we're not in mobile menu mode
    if (!isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Helper for submenu rendering
  const renderSubmenu = (item: MenuItem, closeSubmenu: () => void) => {
    if (!item.submenu) return null;
    if (item.submenu.columns === 1) {
      return (
        <div className="flex flex-col space-y-2 whitespace-nowrap min-w-max">
          {item.submenu.items.map((subItem: any, idx: number) => (
            <Link
              key={idx}
              href={subItem.href}
              className="flex items-center text-white text-sm"
              onClick={closeSubmenu}
            >
              <span className="underline underline-offset-2">{subItem.label}</span>
              <i className="ri-arrow-right-up-line ml-1" />
            </Link>
          ))}
        </div>
      );
    }
    if (item.submenu.columns === 2) {
      return (
        <div className="grid grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <div key={col}>
              <div className="flex items-center justify-between mb-3 text-white text-xs font-light">
                <span>{
                  item.submenu && item.submenu.columns === 2 && 'titles' in item.submenu
                    ? item.submenu.titles[col]
                    : ""
                }</span>
              </div>
              <div className="flex flex-col space-y-2">
                {Array.isArray(item?.submenu?.items?.[col]) &&
                  item.submenu.items[col].map((subItem: any, idx: number) => (
                    <Link
                      key={idx}
                      href={subItem.href}
                      className="flex items-center text-white text-sm"
                      onClick={closeSubmenu}
                    >
                      <span className="underline underline-offset-2 text-nowrap">{subItem.label}</span>
                      <i className="ri-arrow-right-up-line ml-1" />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-background2 relative z-20"
    >
      <nav className="py-1 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={85} height={82} className="mr-16" />
          </div>
          {/* Desktop Menu */}
          <div className="hidden mdplus:flex items-center gap-20">
            <div className="flex items-center space-x-6 lg:space-x-10 ">
              {menuItems.map((item, index) => {
                const hasSubmenu = !!item.submenu;
                const isOpen = openSubmenuId === item.id;
                // Helper to close submenu
                const closeSubmenu = () => setOpenSubmenuId(null);

                return (
                  <div
                    key={item.id}
                    className="relative"
                    ref={(el) => {
                      submenuRefs.current[index] = el;
                    }}
                  >
                    <div className="flex items-center">
                      {item.id === 2 ? (
                        // "Events" acts as toggle only (no link)
                        <button
                          onClick={(e) => handleSubmenuClick(item.id, e)}
                          className="flex items-center font-urbanist text-white transition-colors cursor-pointer"
                          aria-expanded={!!isOpen}
                          aria-controls={hasSubmenu ? `submenu-${item.id}` : ""}
                        >
                          {item.label}
                          <i
                            className={`ri-arrow-drop-down-line ml-1 transition-all duration-200 ease-in-out ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      ) : (
                        <>
                          <Link
                            href={item.href}
                            className="flex items-center font-urbanist text-white transition-colors"
                            onClick={() => closeSubmenu()}
                          >
                            {item.label}
                          </Link>
                          {hasSubmenu && (
                            <button
                              onClick={(e) => handleSubmenuClick(item.id, e)}
                              className={`${isOpen ? "rotate-180" : ""} ml-1 text-white transition-all duration-200 ease-in-out cursor-pointer`}
                              aria-label="Toggle submenu"
                              aria-expanded={!!isOpen}
                              aria-controls={hasSubmenu ? `submenu-${item.id}` : ""}
                            >
                              <i
                                className="ri-arrow-drop-down-line "
                              />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    <AnimatePresence>
                      {hasSubmenu && isOpen && (
                        <motion.div
                          id={`submenu-${item.id}`}
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute top-full left-0 mt-2 bg-muted-background rounded shadow-lg z-50 p-4 ${item?.submenu?.columns === 2 ? "min-w-[400px]" : "min-w-[220px]"}`}
                        >
                          {renderSubmenu(item, closeSubmenu)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
            <Link href="/apply">
              <Button variant="default">
                Apply
              </Button>
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="mdplus:hidden flex items-center gap-4">
            <button
              onClick={toggleMobileMenu}
              className="text-white transition-colors"
              aria-label="Toggle mobile menu"
            >
              <i
                className={`text-2xl ${isMobileMenuOpen ? "ri-close-line" : "ri-menu-line"
                  }`}
              />
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mdplus:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm z-30"
            >
              <div className="px-8 py-6">
                {menuItems.map((item) => {
                  const hasSubmenu = !!item.submenu;
                  const isOpen = openSubmenuId === item.id;

                  return (
                    <div key={item.id} className="pt-6">
                      <div className="flex items-center justify-between font-urbanist text-white transition-colors">
                        {/* Special handling for Events (id: 2) - no navigation, only toggle */}
                        {item.id === 2 ? (
                          <button
                            onClick={(e) => handleSubmenuClick(item.id, e)}
                            className="flex items-center justify-between w-full text-left"
                          >
                            <span>{item.label}</span>
                            <i
                              className={`text-xl ri-arrow-drop-down-line transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        ) : (
                          <>
                            <Link
                              href={item.href}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenSubmenuId(null);
                              }}
                            >
                              {item.label}
                            </Link>
                            {hasSubmenu && (
                              <button
                                onClick={(e) => handleSubmenuClick(item.id, e)}
                                aria-label="Toggle submenu"
                              >
                                <i
                                  className={`text-xl ri-arrow-drop-down-line transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      {/* Mobile Submenu */}
                      <AnimatePresence>
                        {hasSubmenu && isOpen && (
                          <motion.div
                            key={`submenu-${item.id}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pt-4">
                              {item?.submenu?.columns === 1 && (
                                <div className="flex flex-col space-y-4 whitespace-nowrap min-w-max">
                                  {item.submenu.items.map((subItem, idx) => (
                                    <Link
                                      key={idx}
                                      href={subItem.href}
                                      className="flex items-center text-white text-sm"
                                      onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setOpenSubmenuId(null);
                                      }}
                                    >
                                      <span className="underline underline-offset-2">
                                        {subItem.label}
                                      </span>
                                      <i className="ri-arrow-right-up-line ml-2" />
                                    </Link>
                                  ))}
                                </div>
                              )}
                              {item?.submenu?.columns === 2 && (
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
                                          onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setOpenSubmenuId(null);
                                          }}
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
                                          onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setOpenSubmenuId(null);
                                          }}
                                        >
                                          <span className="underline underline-offset-2 leading-tight">
                                            {subItem.label}
                                          </span>
                                          <i className="ri-arrow-right-up-line ml-1" />
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
