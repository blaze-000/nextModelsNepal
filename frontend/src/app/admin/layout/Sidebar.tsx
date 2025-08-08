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
          "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
          "hover:bg-gold-900/30 relative",
          isActive && "bg-gold-500/20 text-gold-400 border-r-2 border-gold-500",
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
              transition={{ duration: 0.2 }}
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

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div
            className="absolute left-full ml-2 px-2 py-1 bg-background2 text-foreground text-sm 
                         rounded-md shadow-lg border border-gold-900/20 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
          >
            {item.label}
            {item.badge && (
              <span className="ml-2 bg-gold-500 text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}

function SidebarSection({ section, isCollapsed }: SidebarSectionProps) {
  const pathname = usePathname();

  return (
    <div className="mb-6">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-semibold text-gold-500 uppercase tracking-wider mb-3 px-3"
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
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  // On desktop, expand on hover when collapsed
  const shouldExpand = !isCollapsed || (isCollapsed && isHovered);

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
          "fixed top-0 left-0 h-full bg-background border-r border-gold-900/20 z-50 flex flex-col",
          "lg:sticky lg:top-0 lg:z-30",
          // Mobile styles
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        animate={{
          width: shouldExpand ? 280 : 64,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gold-900/20 px-4">
          <motion.div
            className="flex items-center gap-3"
            animate={{
              justifyContent: shouldExpand ? "flex-start" : "center",
            }}
          >
            <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-crown-line text-primary-foreground text-lg" />
            </div>
            <AnimatePresence>
              {shouldExpand && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              isCollapsed={!shouldExpand}
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
              {shouldExpand && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {!shouldExpand && (
              <div
                className="absolute left-full ml-2 px-2 py-1 bg-background2 text-foreground text-sm 
                             rounded-md shadow-lg border border-gold-900/20 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
              >
                Logout
              </div>
            )}
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
