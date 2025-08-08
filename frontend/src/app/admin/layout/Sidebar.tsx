"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems, type MenuItem, type MenuSection } from "../data/menuItems";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
  onHoverChange?: (isHovered: boolean) => void;
  isMobile?: boolean;
}

interface SidebarItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
}

interface SidebarSectionProps {
  section: MenuSection;
  isCollapsed: boolean;
}

function SidebarItem({ item, isCollapsed, isActive }: SidebarItemProps) {
  return (
    <Link href={item.href}>
      <motion.div
        className={cn(
          "group flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-gold-900/30 relative",
          isActive && "bg-gold-500/20 text-gold-600",
          isActive && isCollapsed && "bg-gold-500/20 pr-8",
          isActive && !isCollapsed && "border-r-2 border-gold-500",
          !isActive && "text-foreground/80 hover:text-foreground"
        )}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <i className={cn("text-xl flex-shrink-0", item.icon)} />

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <span className="font-medium whitespace-nowrap">
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-gold-500 text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

function SidebarSection({ section, isCollapsed }: SidebarSectionProps) {
  const pathname = usePathname();

  return (
    <div className="mb-8">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-1 px-3"
          >
            {section.title}
          </motion.h3>
        )}
      </AnimatePresence>

      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            isActive={pathname === item.href}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  onHoverChange,
  isMobile = false,
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  // On mobile, always expand when open. On desktop, expand on hover when collapsed
  const shouldExpand = isMobile
    ? isMobileOpen
    : !isCollapsed || (isCollapsed && isHovered);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
      onHoverChange?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      onHoverChange?.(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full bg-background2 border-r border-gold-900/20 z-40 flex flex-col overflow-hidden",
          "lg:fixed lg:top-0 lg:z-30",
          // Add top margin on mobile to account for header
          "lg:mt-0",
          isMobile && "mt-16"
        )}
        style={{
          width: isMobile ? (isMobileOpen ? 280 : 0) : shouldExpand ? 280 : 64,
          height: isMobile ? "calc(100vh - 4rem)" : "100vh", // Subtract header height on mobile
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Logo Section - Hidden on mobile since it's in header */}
        {!isMobile && (
          <div className="h-16 flex items-center border-b border-gold-900/20 px-4">
            <motion.div
              className="flex items-center gap-3 w-full"
              animate={{
                justifyContent: shouldExpand ? "flex-start" : "center",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-crown-line text-primary-foreground text-lg" />
              </div>
              <AnimatePresence>
                {shouldExpand && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -10, width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <h2 className="font-bold text-lg text-foreground font-newsreader whitespace-nowrap">
                      Next Models
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {menuItems.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              isCollapsed={isMobile ? !isMobileOpen : !shouldExpand}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gold-900/20">
          <motion.div
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
              "hover:bg-gold-900/30 text-foreground/80 hover:text-foreground relative"
            )}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="ri-logout-box-line text-xl flex-shrink-0" />

            <AnimatePresence>
              {(isMobile ? isMobileOpen : shouldExpand) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-medium whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
