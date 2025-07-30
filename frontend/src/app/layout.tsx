import "./globals.css";
import { Urbanist, Newsreader } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import 'remixicon/fonts/remixicon.css';


const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  variable: "--font-urbanist",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata = {
  title: "Next Models Nepal",
  description: "Next Models Nepal - Nepal's No.1 Modeling Agency",
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
