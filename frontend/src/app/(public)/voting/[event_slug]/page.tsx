"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const EVENT_DETAILS = {
  name: "Miss Nepal Peace",
  image: "/events/miss_nepal.png",
  contestants: [
    { id: 1, name: "", image: "/contestant_1.jpg" },
    { id: 2, name: "", image: "/contestant_2.jpg" },
    { id: 3, name: "", image: "/contestant_1.jpg" },
    { id: 4, name: "", image: "/contestant_2.jpg" },
    { id: 5, name: "", image: "/contestant_1.jpg" },
    { id: 6, name: "", image: "/contestant_2.jpg" },
    { id: 7, name: "", image: "/contestant_1.jpg" },
    { id: 8, name: "", image: "/contestant_2.jpg" },
    { id: 9, name: "", image: "/contestant_1.jpg" },
    { id: 10, name: "", image: "/contestant_2.jpg" },
  ]
}

export default function EventVoting() {
  // const { event_slug } = useParams();
  return (
    <main>
      {/* Hero Section */}
      <section className="w-full bg-[#020202] py-12 mdplus:py-4">
        <div className="max-w-7xl mx-auto px-6 mdplus:max-h-[810px] mdplus:h-[80vh] grid mdplus:grid-cols-2 items-center justify-items-center mdplus:justify-items-end">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-5 order-2 mdplus:order-1 text-center mdplus:text-left"
          >
            <h1 className="font-newsreader text-5xl mdplus:text-8xl font-light flex tracking-tighter px-4 ">
              <span>{EVENT_DETAILS.name}<i className="text-primary"> Voting</i></span>
            </h1>

            <p className="text-primary text-sm">
              Voting Ends: <span className="text-white">{"UPDATING_TIME"}</span>
            </p>

            <div className="flex flex-col items-center mdplus:flex-row mdplus:justify-start gap-x-8">
              <Link href="#contestants">
                <Button variant="default" className="px-8 py-4">
                  Contestants
                  <i className="ri-arrow-right-down-line" />
                </Button>
              </Link>

              <Link
                href={"#"}
                className="px-4 py-4 rounded-full text-gold-500 text-base tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="underline underline-offset-4 text-nowrap">View Leaderboard</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 mdplus:order-2"
          >
            <Image
              src={EVENT_DETAILS.image}
              alt={EVENT_DETAILS.name}
              width={500}
              height={0}
            />
          </motion.div>
        </div>
      </section>

      {/* Contestants */}
      <section className="w-full bg-background2 pb-20" id="contestants">
        <div className="max-w-7xl mx-auto px-6 ">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-newsreader flex items-baseline gap-2 text-2xl pt-7 pb-9"
          >
            <Image
              src="/svg-icons/small_star.svg"
              height={20}
              width={20}
              alt=""
              className="w-5 h-5"
            />
            Contestants
          </motion.h2>

          <div className="grid xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-4">
            {EVENT_DETAILS?.contestants?.map((contestant) => (
              <motion.div
                key={contestant.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4 mx-auto"
              >
                <Image
                  src={contestant.image}
                  alt={contestant.name}
                  width={292}
                  height={365}
                  className="w-[90%] h-auto md:w-[292px] md:h-[365] object-cover mx-auto"
                />

                <div className="flex justify-end gap-4 items-center pb-2 pr-1">
                  <button className="border-primary border-[2px] rounded-full w-12 h-12 cursor-pointer">
                    <i className="ri-shopping-cart-2-line text-primary text-xl" />
                  </button>
                  <Button variant="default" className="px-6 mdplus:px-12">
                    Vote
                    <i className="ri-arrow-right-up-line hidden md:flex" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
