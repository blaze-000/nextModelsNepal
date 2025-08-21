import { type ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Axios from "@/lib/axios-instance";

export default async function Layout({ children }: { children: ReactNode }) {
  let data = { showVoting: false, selfEvents: [], partnerEvents: [] };

  try {
    const res = await Axios.get("/api/nav/info");
    data = res.data.data;
  } catch (error) {
    console.error("Nav info fetch failed", error);
  }

  return (
    <>
      <Navbar
        showVoting={data.showVoting}
        selfEvents={data.selfEvents}
        partnerEvents={data.partnerEvents}
      />
      {children}
      <Footer />
    </>
  );
};
