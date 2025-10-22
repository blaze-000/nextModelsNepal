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
            await auth?.logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            // Still logout locally even if server request fails
            await auth?.logout();
            router.push("/login");
        }
    };

    return (
        <div className="group relative">
            <Button
                variant="ghost"
                size="icon"
                className="bg-gold-500 hover:bg-gold-400 rounded-full w-8 h-8 text-primary-foreground"
            >
                <i className="text-lg ri-user-line" />
            </Button>

            {/* Dropdown menu */}
            <div className="invisible group-hover:visible top-full right-0 z-50 absolute bg-background2 opacity-0 group-hover:opacity-100 shadow-lg mt-2 border border-gold-900/20 rounded-lg w-48 transition-all duration-200">
                <div className="py-2">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 hover:bg-gold-900/20 px-4 py-2 w-full text-foreground text-sm text-left transition-colors"
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
    <div className="flex-1 mx-4 max-w-md">
        <div className="relative">
            <i className="top-1/2 left-3 absolute text-gold-500 -translate-y-1/2 ri-search-line transform" />
            <input
                type="text"
                placeholder="Search..."
                className="bg-muted-background py-2 pr-4 pl-10 border border-gold-900/20 focus:border-gold-500 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500/20 w-full text-foreground transition-colors placeholder-gold-500/60"
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
        <header className="top-0 z-50 sticky flex justify-between items-center bg-background2 px-4 lg:px-6 border-gold-900/20 border-b h-16">
            {/* Mobile Layout */}
            <div className="lg:hidden flex justify-between items-center w-full">
                <IconButton
                    icon={
                        isMobileSidebarOpen ? "ri-close-line" : "ri-menu-line"
                    }
                    onClick={onToggleSidebar}
                />

                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <h1 className="font-newsreader font-semibold text-foreground text-lg">
                        Next Models
                    </h1>
                </div>

                <ProfileButton />
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                    {/* Fixed the toggle button to properly call onToggleSidebar */}
                    <IconButton icon={ToggleIcon} onClick={onToggleSidebar} />
                    <h1 className="font-newsreader font-semibold text-foreground text-xl lg:text-2xl">
                        Dashboard
                    </h1>
                </div>

                <SearchBar />

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 pl-3 border-gold-900/20 border-l">
                        <div className="hidden sm:block text-right">
                            <p className="font-medium text-foreground text-sm">
                                Admin
                            </p>
                            <p className="text-gold-500 text-xs">
                                Administrator
                            </p>
                        </div>
                        <ProfileButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
