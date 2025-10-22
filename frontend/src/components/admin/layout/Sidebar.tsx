"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuItems, type MenuItem, type MenuSection } from "./menuItems";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import Axios from "@/lib/axios-instance";

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
    onClose?: () => void;
    isMobile?: boolean;
}

interface SidebarSectionProps {
    section: MenuSection;
    isCollapsed: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

function SidebarItem({
    item,
    isCollapsed,
    isActive,
    onClose,
    isMobile,
}: SidebarItemProps) {
    const handleClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <Link href={item.href} onClick={handleClick}>
            <motion.div
                className={cn(
                    "group flex items-center gap-3 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                    "hover:bg-gold-900/30 relative",
                    isActive && "bg-gold-500/20 text-gold-600",
                    isActive &&
                        !isCollapsed &&
                        "border-r-2 border-gold-500 px-3",
                    !isActive &&
                        "text-foreground/80 hover:text-foreground px-3 ",
                    isCollapsed && "justify-center -mx-1 px-5"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
            >
                <i className={cn("flex-shrink-0 text-xl", item.icon)} />

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="flex flex-1 justify-between items-center overflow-hidden"
                        >
                            <span className="font-medium whitespace-nowrap">
                                {item.label}
                            </span>
                            {item.badge && (
                                <span className="bg-gold-500 px-2 py-0.5 rounded-full font-bold text-primary-foreground text-xs">
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

function SidebarSection({
    section,
    isCollapsed,
    onClose,
    isMobile,
}: SidebarSectionProps) {
    const pathname = usePathname();

    return (
        <div className="mb-8">
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.h3
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mb-1 px-3 font-semibold text-gold-500 text-xs uppercase tracking-wider"
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
                        onClose={onClose}
                        isMobile={isMobile}
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
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await Axios.post("/api/auth/logout");
            await auth?.logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Still logout locally even if server request fails
            await auth?.logout();
            router.push("/login");
        }
    };

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
                {isMobile && isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="lg:hidden z-40 fixed inset-0 bg-black/50"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={cn(
                    "top-0 left-0 z-40 fixed flex flex-col bg-background2 border-gold-900/20 border-r h-full overflow-hidden",
                    "lg:fixed lg:top-0 lg:z-30",
                    // Add top margin on mobile to account for header
                    "lg:mt-0",
                    isMobile && "mt-16"
                )}
                style={{
                    width: isMobile
                        ? isMobileOpen
                            ? 280
                            : 0
                        : shouldExpand
                        ? 280
                        : 64,
                    height: isMobile ? "calc(100vh - 4rem)" : "100vh", // Subtract header height on mobile
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Logo Section - Hidden on mobile since it's in header */}
                {!isMobile && (
                    <div className="flex items-center px-4 border-gold-900/20 border-b h-16">
                        <motion.div
                            className="flex justify-center items-center gap-3 w-full"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <Image
                                src={"/logo.png"}
                                alt="Logo"
                                width={48}
                                height={48}
                                className="justify-center items-center"
                            />
                            <AnimatePresence>
                                {shouldExpand && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -10,
                                            width: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            width: "auto",
                                        }}
                                        exit={{ opacity: 0, x: -10, width: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <h2 className="font-newsreader font-semibold text-foreground text-lg whitespace-nowrap">
                                            Next Models
                                        </h2>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-hide">
                    {menuItems.map((section) => (
                        <SidebarSection
                            key={section.title}
                            section={section}
                            isCollapsed={
                                isMobile ? !isMobileOpen : !shouldExpand
                            }
                            onClose={onClose}
                            isMobile={isMobile}
                        />
                    ))}

                    {/* Bottom Section */}
                    <div className="p-4 border-gold-900/20 border-t">
                        <motion.div
                            onClick={handleLogout}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                                "hover:bg-gold-900/30 text-foreground/80 hover:text-foreground relative",
                                (isMobile ? !isMobileOpen : !shouldExpand) &&
                                    "justify-center"
                            )}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="flex-shrink-0 text-xl ri-logout-box-line" />

                            <AnimatePresence>
                                {(isMobile ? isMobileOpen : shouldExpand) && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            ease: "easeInOut",
                                        }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </nav>
            </motion.aside>
        </>
    );
}
