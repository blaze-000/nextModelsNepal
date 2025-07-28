import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";


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
    <html lang="en" className="bg-background">
      <body
        className={`bg-background text-foreground antialiased w-full`}
      >
        <div className="abosolute top-20">
          <Navbar />
        </div>

        {children}
        <Footer />
      </body>
    </html>
  );
}
