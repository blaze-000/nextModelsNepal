"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface AdminLayoutClientProps {
    children: React.ReactNode;
}

export default function AdminLayoutClient({
    children,
}: AdminLayoutClientProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

    const handleSidebarHover = (isHovered: boolean) => {
        if (!isMobile) setIsSidebarHovered(isHovered);
    };

    // Calculate sidebar width based on state
    const getSidebarWidth = () => {
        if (isMobile) return 0;
        if (!isSidebarCollapsed) return 280;
        return isSidebarHovered ? 280 : 64;
    };

    return (
        <div className="flex bg-background2 min-h-screen">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                isMobileOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
                onHoverChange={handleSidebarHover}
                isMobile={isMobile}
            />

            {/* Main Content Area */}
            <div
                className="flex flex-col flex-1 transition-all duration-300 ease-in-out"
                style={{ marginLeft: getSidebarWidth() }}
            >
                {/* Header */}
                <Header
                    onToggleSidebar={toggleSidebar}
                    isSidebarCollapsed={isSidebarCollapsed}
                    isMobileSidebarOpen={isMobileSidebarOpen}
                />

                {/* Page Content */}
                <main className="flex-1 bg-background overflow-auto">
                    <div className="p-4 lg:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
