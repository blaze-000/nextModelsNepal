"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Axios from "@/lib/axios-instance";
import { Spinner } from "@/components/ui/spinner";
import { normalizeImagePath } from "@/lib/utils";

interface VotingEvent {
  image: string;
  slug: string;
  eventName: string;
}

export default function Voting() {
  const [events, setEvents] = useState<VotingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const response = await Axios.get("/api/season/voting");
      const data = response.data;
      setEvents(data.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner color="#ffaa00" size={50} />
      </div>
    );
  }

  return (
    <section className="w-full py-40 mdplus:py-20 flex flex-col">
      <div className="max-w-7xl px-6 mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="pb-8 mdplus:pb-3 w-full mb-10"
        >
          <div className="flex gap-2 items-center justify-center w-full font-medium text-xl font-newsreader">
            <Image
              width={40}
              height={0}
              src="/svg-icons/small_star.svg"
              alt=""
              className="w-4 h-4"
            />
            <span>What event would you like to vote for?</span>
          </div>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col mdplus:flex-row flex-wrap justify-center gap-8 text-primary"
        >
          {events?.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={`/voting/${item.slug}`}
                className="border border-gold-500 rounded-full h-24 mdplus:min-w-96 flex items-center gap-3 mdplus:gap-6 cursor-pointer hover:text-white px-16"
              >
                <Image
                  src={normalizeImagePath(item.image)}
                  width={150}
                  height={0}
                  alt=""
                  className="w-25 h-full py-5 object-cover"
                />
                <span className="flex gap-1 items-center">
                  {item.eventName}
                  <i className="ri-arrow-right-up-line text-lg" />
                </span>
              </Link>
            </motion.div>
          ))}

        </motion.div>
      </div>
    </section>
  );
};
