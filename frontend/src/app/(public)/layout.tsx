import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Next Models Nepal",
  description: "Next Models Nepal - Nepal's No.1 Modeling Agency",
};

export default function Layout({ children }: { children: ReactNode }) {

  return (
    <>
        <Navbar />
        {children}
        <Footer />
    </>
  );
};
