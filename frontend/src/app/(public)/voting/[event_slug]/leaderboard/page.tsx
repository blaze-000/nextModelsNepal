"use client";
import BarChart from "@/components/bar-chart";
import Breadcrumb from "@/components/molecules/breadcumb";
import { useState, useEffect } from "react";
import type React from "react";
import { useParams } from "next/navigation";
import Axios from "@/lib/axios-instance";
import { Spinner } from "@/components/ui/spinner";

type Contestant = {
  _id: string;
  name: string;
  votes: number;
  uniqueId: string;
  status: string;
};

export default function Leaderboard() {
  const { event_slug } = useParams() as { event_slug: string };
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContestants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch contestants by season slug
        const response = await Axios.get(`/api/contestants/season-slug/${event_slug}`);

        if (response.data.success) {
          // Filter out eliminated contestants and sort by votes
          const activeContestants = response.data.data
            .filter((contestant: Contestant) => contestant.status.toLowerCase() !== "eliminated")
            .sort((a: Contestant, b: Contestant) => b.votes - a.votes);

          setContestants(activeContestants);
        } else {
          setError("Failed to fetch contestants");
        }
      } catch (error: any) {
        console.error("Error fetching contestants:", error);
        setError(error.response?.data?.message || "Failed to fetch contestants");
      } finally {
        setLoading(false);
      }
    };

    if (event_slug) {
      fetchContestants();
    }
  }, [event_slug]);

  if (loading) {
    return (
      <main>
        <Breadcrumb showSearch={false} title="Leaderboard" />
        <div className="h-[50vh] flex items-center justify-center">
          <Spinner color="#ffaa00" size={50} />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Breadcrumb showSearch={false} title="Leaderboard" />
        <div className="h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const sortedContestants = contestants;

  return (
    <main>
      <Breadcrumb showSearch={false} title="Leaderboard" />
      <section className="w-full bg-background2">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 relative">
          <BarChart topThree={sortedContestants.slice(0, 3).map((contestant, index) => ({
            id: index + 1,
            name: contestant.name,
            votes: contestant.votes
          }))} />
          <div className="h-full mx-auto">
            <h3 className="font-semibold py-12">Current Voting Ranks</h3>
            {sortedContestants.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No contestants found for this season.</p>
              </div>
            ) : (
              <>
                <ol className="font-newsreader text-2xl ">
                  {(isExpanded
                    ? sortedContestants
                    : sortedContestants.slice(0, 5)
                  ).map((contestant, index) => (
                    <li
                      key={contestant._id}
                      className="mb-4 flex gap-8 items-center"
                    >
                      <p className="font-light text-primary border-[1px] border-primary rounded-full h-14 w-14 text-center place-content-center">
                        {index + 1}
                      </p>
                      <span className="font-light">{contestant.name}</span>
                    </li>
                  ))}
                </ol>
                {sortedContestants.length > 5 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-4 py-4 rounded-full text-gold-500 text-sm -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="underline underline-offset-4">
                      {isExpanded ? "Show Less" : "Load More"}
                    </span>
                    <i className={`${isExpanded ? "ri-arrow-up-line" : "ri-arrow-down-line"} group-hover:scale-120 transition-transform duration-400 text-xl font-extralight`} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
