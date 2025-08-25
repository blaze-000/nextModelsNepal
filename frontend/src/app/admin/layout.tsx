"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { usePathname } from "next/navigation";

import "remixicon/fonts/remixicon.css";
import Header from "../../components/admin/layout/Header";
import Sidebar from "../../components/admin/layout/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Check if we're on the dashboard page
  const isDashboardPage = pathname === "/admin/dashboard";

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
      // Fixed the toggle logic to properly toggle the sidebar state
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const handleSidebarHover = (isHovered: boolean) => {
    if (!isMobile) setIsSidebarHovered(isHovered);
  };

  // Calculate sidebar width based on state
  // For dashboard page, auto-hide the sidebar (collapsed by default)
  const getSidebarWidth = () => {
    if (isMobile) {
      // Fixed mobile sidebar width logic
      return isMobileSidebarOpen ? 280 : 0;
    }
    
    // For dashboard page, start collapsed but allow hover expansion
    if (isDashboardPage) {
      if (isSidebarHovered) return 280;
      return 64; // Only show icons when collapsed on dashboard
    }
    
    // For other pages, use normal behavior
    if (!isSidebarCollapsed) return 280;
    return isSidebarHovered ? 280 : 64;
  };

  // Determine if sidebar should be collapsed by default
  const shouldBeCollapsed = isDashboardPage ? true : isSidebarCollapsed;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background2 flex admin-layout">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={shouldBeCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
          onHoverChange={handleSidebarHover}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <div
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: getSidebarWidth() }}
        >
          {/* Header */}
          <Header
            onToggleSidebar={toggleSidebar}
            isSidebarCollapsed={shouldBeCollapsed}
            isMobileSidebarOpen={isMobileSidebarOpen}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>

    </ProtectedRoute>
  );
}