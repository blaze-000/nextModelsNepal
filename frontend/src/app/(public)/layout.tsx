import { type ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Axios from "@/lib/axios-instance";

export default async function Layout({ children }: { children: ReactNode }) {
  let data = { showVoting: false, selfEvents: [], partnerEvents: [] };

  try {
    const res = await Axios.get("/api/nav/info");
    data = res.data.data || { showVoting: false, selfEvents: [], partnerEvents: [] };
  } catch (error) {
    console.error("Nav info fetch failed", error);
  }

  // Ensure arrays are always arrays, even if API returns null
  const selfEvents = Array.isArray(data.selfEvents) ? data.selfEvents : [];
  const partnerEvents = Array.isArray(data.partnerEvents) ? data.partnerEvents : [];

  return (
    <>
      <Navbar
        showVoting={data.showVoting}
        selfEvents={selfEvents}
        partnerEvents={partnerEvents}
      />
      {children}
      <Footer 
      events={[...selfEvents, ...partnerEvents]}
      />
    </>
  );
};
