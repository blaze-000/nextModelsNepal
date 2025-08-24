"use client";
import BarChart from "@/components/bar-chart";
import Breadcrumb from "@/components/molecules/breadcumb";
import { useState } from "react";
import type React from "react";

type Contestant = {
  id: number;
  name: string;
  votes: number;
};
const contestants: Contestant[] = [
  { id: 1, name: "Ramesh Kunwar", votes: 142 },
  { id: 2, name: "Bishesh Sharma", votes: 875 },
  { id: 3, name: "Shrikrishna Tamang", votes: 394 },
  { id: 4, name: "Navneet Thapa", votes: 650 },
  { id: 5, name: "Ashim Kafle", votes: 913 },
  { id: 6, name: "Deepak Kunwar", votes: 121 },
  { id: 7, name: "Kiran Bista", votes: 733 },
  { id: 8, name: "Manoj Khadgi", votes: 467 },
  { id: 9, name: "Suresh Gurung", votes: 289 },
  { id: 10, name: "Prakash Verma", votes: 598 },
  { id: 11, name: "Ramesh Sharma", votes: 377 },
  { id: 12, name: "Bishesh Tamang", votes: 149 },
  { id: 13, name: "Shrikrishna Bista", votes: 812 },
  { id: 14, name: "Navneet Kafle", votes: 241 },
  { id: 15, name: "Ashim Kunwar", votes: 955 },
  { id: 16, name: "Deepak Khadgi", votes: 103 },
  { id: 17, name: "Kiran Verma", votes: 370 },
  { id: 18, name: "Manoj Sharma", votes: 688 },
  { id: 19, name: "Suresh Kunwar", votes: 432 },
  { id: 20, name: "Prakash Tamang", votes: 543 },
  { id: 21, name: "Ramesh Bista", votes: 814 },
  { id: 22, name: "Bishesh Gurung", votes: 264 },
  { id: 23, name: "Shrikrishna Sharma", votes: 902 },
  { id: 24, name: "Navneet Khadgi", votes: 354 },
  { id: 25, name: "Ashim Verma", votes: 776 },
  { id: 26, name: "Deepak Kafle", votes: 655 },
  { id: 27, name: "Kiran Kunwar", votes: 539 },
  { id: 28, name: "Manoj Tamang", votes: 215 },
  { id: 29, name: "Suresh Bista", votes: 743 },
  { id: 30, name: "Prakash Khadgi", votes: 870 },
  { id: 31, name: "Ramesh Verma", votes: 680 },
  { id: 32, name: "Bishesh Kafle", votes: 426 },
  { id: 33, name: "Shrikrishna Kunwar", votes: 379 },
  { id: 34, name: "Navneet Gurung", votes: 155 },
  { id: 35, name: "Ashim Sharma", votes: 788 },
  { id: 36, name: "Deepak Tamang", votes: 204 },
  { id: 37, name: "Kiran Bista", votes: 992 },
  { id: 38, name: "Manoj Verma", votes: 360 },
  { id: 39, name: "Suresh Khadgi", votes: 128 },
  { id: 40, name: "Prakash Kafle", votes: 503 },
  { id: 41, name: "Ramesh Gurung", votes: 620 },
  { id: 42, name: "Bishesh Bista", votes: 444 },
  { id: 43, name: "Shrikrishna Khadgi", votes: 277 },
  { id: 44, name: "Navneet Kunwar", votes: 786 },
  { id: 45, name: "Ashim Tamang", votes: 980 },
  { id: 46, name: "Deepak Verma", votes: 308 },
  { id: 47, name: "Kiran Khadgi", votes: 220 },
  { id: 48, name: "Manoj Kafle", votes: 854 },
  { id: 49, name: "Suresh Sharma", votes: 179 },
  { id: 50, name: "Prakash Kunwar", votes: 937 },
];

export default function Leaderboard() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const sortedContestants = [...contestants].sort((a, b) => b.votes - a.votes);

  return (
    <main>
      <Breadcrumb showSearch={false} title="Leaderboard" />
      <section className="w-full bg-background2">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-16 relative">
          <BarChart topThree={sortedContestants.slice(0, 3)} />
          <div className="h-full mx-auto">
            <h3 className="font-semibold py-12">Current Voting Ranks</h3>
            <ol className="font-newsreader text-2xl ">
              {(isExpanded
                ? sortedContestants
                : sortedContestants.slice(0, 5)
              ).map((contestant, index) => (
                <li
                  key={contestant.id}
                  className="mb-4 flex gap-8 items-center"
                >
                  <p className="font-light text-primary border-[1px] border-primary rounded-full h-14 w-14 text-center place-content-center">
                    {index + 1}
                  </p>
                  <span className="font-light">{contestant.name}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-4 rounded-full text-gold-500 text-sm -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="underline underline-offset-4">
                {isExpanded ? "Show Less" : "Load More"}
              </span>
              <i className={`${isExpanded ? "ri-arrow-up-line" : "ri-arrow-down-line"} group-hover:scale-120 transition-transform duration-400 text-xl font-extralight`} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
