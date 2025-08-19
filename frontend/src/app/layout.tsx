import "./globals.css";
import "remixicon/fonts/remixicon.css";
import TopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { Urbanist, Newsreader } from "next/font/google";
import { AuthProvider } from "@/context/authContext";

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
      className={`${urbanist.variable} ${newsreader.variable} scroll-smooth`}
    >
      <body className="bg-background text-foreground antialiased font-urbanist">
        <TopLoader showSpinner={false} color="#a06d06" height={1.9} />
        <Toaster
          position="top-right"
          offset="80px"
          richColors
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};