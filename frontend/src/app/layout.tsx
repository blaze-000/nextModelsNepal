import "./globals.css";
import "remixicon/fonts/remixicon.css";
import TopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { Urbanist, Newsreader } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import { CartProvider } from "@/context/cartContext";
import LenisProvider from "@/components/lenisprovider";
import { QueryProvider } from "@/components/providers/query-provider";

/**
 * ✅ ORPC Client Architecture (Separate Backend)
 *
 * Since our backend is a separate Express server, we use HTTP for both
 * SSR and client-side requests with different URLs:
 *
 * - SSR: http://localhost:8000/api/rpc (direct backend connection)
 * - Browser: window.location.origin/api/rpc (can be proxied)
 *
 * Benefits:
 * - ✅ Full end-to-end type safety
 * - ✅ Same API for server/client components
 * - ✅ Cookie forwarding for auth
 * - ✅ Zero configuration
 *
 * Trade-off: SSR uses HTTP (~1-2ms overhead on localhost)
 *
 * @see src/lib/orpc-client.ts
 */

const urbanist = Urbanist({
    subsets: ["latin"],
    weight: ["200", "300", "400", "600", "700"],
    variable: "--urbanist",
    display: "swap",
});

const newsreader = Newsreader({
    subsets: ["latin"],
    weight: ["200", "300", "400", "600", "700"],
    style: ["normal", "italic"],
    variable: "--newsreader",
    display: "swap",
});

export const metadata = {
    title: "Next Models Nepal",
    description: "Next Models Nepal - Nepal's No.1 Modeling Agency",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${urbanist.variable} ${newsreader.variable} `}
        >
            <body className="bg-background font-urbanist text-foreground antialiased">
                <TopLoader showSpinner={false} color="#a06d06" height={1.9} />
                <Toaster position="top-right" offset="80px" richColors />
                <QueryProvider>
                    <AuthProvider>
                        <CartProvider>
                            <LenisProvider>{children}</LenisProvider>
                        </CartProvider>
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
