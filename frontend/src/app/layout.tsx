import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Urbanist } from "next/font/google";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
  variable: "--font-urbanist", 
  display: "swap",
});


export const metadata: Metadata = {
  title: "Next Models Nepal",
  description: "Next Models Nepal - one of the best",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`bg-background ${urbanist.variable}`}>
      <body
        className={`bg-background text-foreground antialiased w-full`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
