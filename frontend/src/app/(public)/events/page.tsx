"use client";

import { Gallery } from "@/components/events/gallery";
import EventHero from "@/components/events/hero";
import { NewsSection } from "@/components/events/news-section";
import { PastEvents } from "@/components/events/past-events";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { Winners } from "@/components/events/winners";
import Breadcrumb from "@/components/molecules/breadcumb";

import { useState, useEffect } from "react";
import Image from "next/image";
import Axios from "@/lib/axios-instance";

export default function Events() {
  const [searchText, setSearchText] = useState("");
  const [hasResults, setHasResults] = useState(true);

  // Check if any section has results when searching
  useEffect(() => {
    const checkResults = async () => {
      if (!searchText) {
        setHasResults(true);
        return;
      }

      try {
        // Check past events
        const pastRes = await Axios.get('/api/events/past-events');
        const pastEvents = pastRes.data.data || [];
        const pastHasResults = pastEvents.some((event: any) => {
          const nameMatch = event.name?.toLowerCase().includes(searchText.toLowerCase());
          const overviewMatch = event.overview?.toLowerCase().includes(searchText.toLowerCase());
          const yearMatch = event.season?.year?.toString().includes(searchText);
          return nameMatch || overviewMatch || yearMatch;
        });

        // Check winners
        const winnersRes = await Axios.get('/api/events/past-winners');
        const winners = winnersRes.data.data || [];
        const winnersHasResults = winners.some((winner: any) => {
          const nameMatch = winner.name?.toLowerCase().includes(searchText.toLowerCase());
          const eventMatch = winner.eventName?.toLowerCase().includes(searchText.toLowerCase());
          const yearMatch = winner.year?.toString().includes(searchText);
          const rankMatch = winner.rank?.toLowerCase().includes(searchText.toLowerCase());
          return nameMatch || eventMatch || yearMatch || rankMatch;
        });

        // Check upcoming events
        const upcomingRes = await Axios.get('/api/season/upcoming');
        const upcomingEvents = upcomingRes.data.data || [];
        const upcomingHasResults = upcomingEvents.some((event: any) => {
          const nameMatch = event.eventId?.name?.toLowerCase().includes(searchText.toLowerCase());
          const overviewMatch = event.eventId?.overview?.toLowerCase().includes(searchText.toLowerCase());
          const yearMatch = event.year?.toString().includes(searchText);
          return nameMatch || overviewMatch || yearMatch;
        });

        setHasResults(pastHasResults || winnersHasResults || upcomingHasResults);
      } catch (error) {
        console.error('Error checking results:', error);
        setHasResults(false);
      }
    };

    checkResults();
  }, [searchText]);

  return (
    <main>
      <Breadcrumb
        title="Events Central"
        searchPlaceholder="Search events, winners"
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {searchText === "" && <EventHero />}

      {/* Search indicator */}
      {searchText !== "" && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="flex items-center mb-6">
            <Image
              src="/svg-icons/small_star.svg"
              alt=""
              height={20}
              width={20}
              className="inline-block mr-2 h-5 w-5 bg-cover"
            />
            <p className="text-2xl font-newsreader text-white">
              Searching for:{" "}
              <span className="text-gold-500">&ldquo;{searchText}&rdquo;</span>
            </p>
          </div>
        </div>
      )}

      <PastEvents searchText={searchText} />
      <Winners searchText={searchText} />
      {searchText === "" && <Gallery />}
      <UpcomingEvents searchText={searchText} />
      {searchText === "" && <NewsSection />}

      {/* No results message */}
      {searchText && !hasResults && (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center text-white">
            <p className="text-xl">No results found for "{searchText}"</p>
            <p className="text-lg mt-2 text-gray-400">Try searching for different keywords</p>
          </div>
        </div>
      )}
    </main>
  );
}
