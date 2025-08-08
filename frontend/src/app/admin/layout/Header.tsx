"use client";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export default function Header({
  onToggleSidebar,
  isSidebarCollapsed,
}: HeaderProps) {
  return (
    <header className="h-16 bg-background border-b border-gold-900/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left Section - Toggle Button and Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden text-gold-500 hover:bg-gold-900/20"
        >
          <i
            className={`${
              isSidebarCollapsed ? "ri-menu-line" : "ri-close-line"
            } text-xl`}
          />
        </Button>

        {/* Desktop Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hidden lg:flex text-gold-500 hover:bg-gold-900/20"
        >
          <i className="ri-menu-fold-line text-xl" />
        </Button>

        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground font-newsreader">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Center Section - Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-muted-background border border-gold-900/20 rounded-lg 
                     text-foreground placeholder-gold-500/60 focus:outline-none focus:border-gold-500 
                     focus:ring-1 focus:ring-gold-500/20 transition-colors"
          />
        </div>
      </div>

      {/* Right Section - Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gold-500 hover:bg-gold-900/20 relative"
        >
          <i className="ri-notification-line text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-gold-500 rounded-full" />
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gold-900/20">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">Admin</p>
            <p className="text-xs text-gold-500">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full bg-gold-500 text-primary-foreground hover:bg-gold-400"
          >
            <i className="ri-user-line text-lg" />
          </Button>
        </div>
      </div>
    </header>
  );
}
