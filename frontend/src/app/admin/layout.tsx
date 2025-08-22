"use client";

import { useState, useEffect } from "react";
import type React from "react";

import "remixicon/fonts/remixicon.css";
import Header from "../../components/admin/layout/Header";
import Sidebar from "../../components/admin/layout/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <ProtectedRoute>
      <div className="min-h-screen bg-background2 flex admin-layout">
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
          className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
          style={{ marginLeft: getSidebarWidth() }}
        >
          {/* Header */}
          <Header
            onToggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
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
