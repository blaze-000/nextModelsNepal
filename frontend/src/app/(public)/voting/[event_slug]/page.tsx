"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Axios from "@/lib/axios-instance";
import { Spinner } from "@/components/ui/spinner";
import { normalizeImagePath } from "@/lib/utils";
import { useCart } from "@/context/cartContext";
import VotingCartPopup from "@/components/molecules/voting-cart-popup";
import { toast } from "sonner";
import SmoothLink from "@/components/ui/SmoothLink";

type VotingEventDetails = {
  eventName: string;
  image: string;
  pricePerVote: number;
  _id: string; // This is the season ID
  contestants: {
    _id: string,
    name: string,
    image: string,
    address: string,
    status: "Eliminated" | "Not Eliminated",
    uniqueId: string,
  }[];
}


export default function EventVoting() {
  const { event_slug } = useParams() as { event_slug: string };
  const [eventDetails, setEventDetails] = useState<VotingEventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, removeFromCart, isInCart, getTotalVotes } = useCart();

  useEffect(() => {
    (async () => {
      const response = await Axios.get(`/api/season/voting/${event_slug}`);
      const data = response.data;
      setEventDetails(data.data);
      setLoading(false);
    })();
  }, [event_slug]);

  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <Spinner color="#ffaa00" size={50} />
      </div>
    );
  }

  return (
    <main className='bg-background2'>
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
            <h1 className="font-newsreader text-5xl mdplus:text-8xl font-light tracking-tighter px-4 ">
              <p>
                {eventDetails?.eventName}
                <i className="text-primary"> Voting</i>
              </p>
            </h1>

            <p className="text-primary text-sm">
              Voting Ends: <span className="text-white">{"UPDATING_TIME"}</span>
            </p>

            <div className="flex flex-col items-center mdplus:flex-row mdplus:justify-start gap-x-8">
              <SmoothLink href="#contestants">
                <Button variant="default" className="px-8 py-4">
                  Contestants
                  <i className="ri-arrow-right-down-line" />
                </Button>
              </SmoothLink>

              <Link
                href={`/voting/${event_slug}/leaderboard`}
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
              src={normalizeImagePath(eventDetails?.image)}
              alt={eventDetails?.eventName ?? ""}
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
            {eventDetails?.contestants?.map((contestant) => (
              <motion.div
                key={contestant._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4 mx-auto"
              >
                <Image
                  src={normalizeImagePath(contestant.image)}
                  alt={contestant.name}
                  width={292}
                  height={365}
                  className="w-[90%] h-auto md:w-[292px] md:h-[365] object-cover mx-auto"
                />

                <div className="flex justify-end gap-4 items-center pb-2 pr-1">
                  <button
                    onClick={() => {
                      if (isInCart(eventDetails?._id || '', contestant._id)) {
                        // Remove from cart
                        removeFromCart(eventDetails?._id || '', contestant._id);
                        toast.success(`${contestant.name} removed from cart!`);
                      } else {
                        // Add to cart
                        addToCart(
                          eventDetails?._id || '',
                          contestant._id,
                          5
                        );
                        toast.success(`${contestant.name} added to cart!`);
                      }
                    }}
                    className={`border-primary border-[2px] rounded-full w-12 h-12 cursor-pointer transition-colors ${isInCart(eventDetails?._id || '', contestant._id)
                      ? 'bg-primary text-black' : ''}`}
                  >
                    <i className="ri-shopping-cart-2-line text-xl" />
                  </button>
                  <Link href={`/voting/${event_slug}/${contestant._id}`}>
                    <Button variant="default" className="px-6 mdplus:px-12">
                      Vote
                      <i className="ri-arrow-right-up-line hidden md:flex" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Popup */}
      {eventDetails && getTotalVotes(eventDetails._id) > 0 && (
        <div className="sticky bottom-0 left-0 right-0 z-50">
          <VotingCartPopup seasonId={eventDetails._id} pricePerVote={eventDetails.pricePerVote} />
        </div>
      )}
    </main>
  );
};
