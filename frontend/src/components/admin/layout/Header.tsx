"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Axios from "@/lib/axios-instance";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen?: boolean;
}

const IconButton = ({
  icon,
  onClick,
  className = "",
  
}: {
  icon: string;
  onClick?: () => void;
  className?: string;
  
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={`text-gold-500 hover:bg-gold-900/20 relative ${className}`}
  >
    <i className={`${icon} text-xl`} />
    
  </Button>
);

const ProfileButton = () => {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await Axios.post("/api/auth/logout");
      auth?.logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still logout locally even if server request fails
      auth?.logout();
      router.push("/login");
    }
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 rounded-full bg-gold-500 text-primary-foreground hover:bg-gold-400"
      >
        <i className="ri-user-line text-lg" />
      </Button>

      {/* Dropdown menu */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-background2 border border-gold-900/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-gold-900/20 transition-colors flex items-center gap-2"
          >
            <i className="ri-logout-box-r-line" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const SearchBar = () => (
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
);

export default function Header({
  onToggleSidebar,
  isSidebarCollapsed,
  isMobileSidebarOpen = false,
}: HeaderProps) {
  // Fix the toggle icon logic to properly reflect the current state
  const ToggleIcon = isSidebarCollapsed 
    ? "ri-menu-unfold-line" 
    : "ri-menu-fold-line";

  return (
    <header className="h-16 bg-background2 border-b border-gold-900/20 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      {/* Mobile Layout */}
      <div className="flex lg:hidden items-center justify-between w-full">
        <IconButton
          icon={isMobileSidebarOpen ? "ri-close-line" : "ri-menu-line"}
          onClick={onToggleSidebar}
        />

        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <h1 className="text-lg font-semibold text-foreground font-newsreader">
            Next Models
          </h1>
        </div>

        <ProfileButton />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Fixed the toggle button to properly call onToggleSidebar */}
          <IconButton 
            icon={ToggleIcon} 
            onClick={onToggleSidebar} 
          />
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground font-newsreader">
            Dashboard
          </h1>
        </div>

        <SearchBar />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pl-3 border-l border-gold-900/20">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-gold-500">Administrator</p>
            </div>
            <ProfileButton />
          </div>
        </div>
      </div>
    </header>
  );
}
