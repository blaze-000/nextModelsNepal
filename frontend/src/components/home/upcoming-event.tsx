import Image from "next/image";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import Axios from "@/lib/axios-instance";

const UpcomingEventSection = () => {
  const [data, setData] = useState<UpcomingEventData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get('/api/next-events-latest');
        const data = res.data;
        // console.log(data.data[0]);
        setData(data.data[0])
      }
      catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <section className="bg-black-900 w-full">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center items-center gap-2 mb-8">
            <Image
              src="/svg-icons/star.svg"
              alt=""
              width={24}
              height={0}
              className="w-5 h-5 text-gold-500"
            />
            <h2 className="text-white text-2xl font-medium font-newsreader tracking-tight">
              Upcoming Event
            </h2>
          </div>

          <div className="flex flex-col gap-2 items-center">
            {/* Mobile Title */}
            <div className="text-center lg:hidden">
              <div className="text-4xl font-light font-newsreader text-white mb-1">
                <span className="text-gold-500 relative inline-block">
                  Shine
                  <Image
                    src="/svg-icons/star.svg"
                    alt=""
                    height={1}
                    width={1}
                    className="h-4 w-4 absolute -top-2 -right-2 select-none"
                  />
                </span>
                <span className="ml-2">on Nepal&rsquo;s</span>
              </div>
              <div className="text-4xl tracking-tighter font-light font-newsreader text-white flex items-center justify-center gap-2">
                <span>Premier</span>
                <span>Fashion Event.</span>
              </div>
              <div className="text-5xl font-light font-newsreader tracking-tighter text-primary mb-1 mt-2">
                Presenting,
              </div>
              <div className="text-5xl font-light font-newsreader tracking-tighter text-gold-500 mb-4">
                {data?.title}
              </div>
            </div>

            {/* Desktop Title */}
            <div className="text-center hidden lg:block">
              <div className="text-5xl font-light font-newsreader text-white mb-1 flex items-center justify-center gap-2.5">
                <span className="text-gold-500 relative inline-block">
                  Shine
                  <Image
                    src="/svg-icons/star.svg"
                    alt=""
                    height={20}
                    width={20}
                    className="h-5 w-5 absolute -top-2 -right-2 select-none animate-bounce-slow"
                  />
                </span>
                <span>on Nepal&rsquo;s Premier</span>
                <Image
                  src="/upcoming-event-title-image.jpg"
                  alt=""
                  width={1}
                  height={0}
                  sizes="100vw"
                  className="w-32 h-16 rounded-full border border-stone-300 mb-3 object-cover object-top"
                />
                <span>Fashion Event.</span>
              </div>
              <div className="text-6xl font-light font-newsreader tracking-tighter text-gold-500 mb-4">
                Presenting {data?.title}
              </div>
            </div>

            {/* Description - mobile */}
            <div className="text-center lg:hidden">
              <p className="text-white text-base font-light max-w-2xl mx-auto">
                {data?.description}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative mx-auto overflow-visible"
          >
            <Image
              width={500}
              height={600}
              className="h-full w-auto"
              src={`${process.env.NEXT_PUBLIC_API_URL}/${data?.image}`}
              alt="Mr. Nepal 2025"
            />
            <div className="h-[115%] absolute right-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="h-[115%] absolute left-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute top-0 -left-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute bottom-0 -right-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="order-2 lg:order-2 space-y-8"
          >
            <p className="hidden lg:block text-white text-md lg:text-lg font-light lead">
              {data?.description}
            </p>

            {/* Eligibility */}
            <div className="bg-muted-background p-8 md:px-8 md:py-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded-full border-2 border-white " />
                <h4 className="text-white text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">
                  {data?.card[0].cardTitle}
                </h4>
              </div>

              <div className="flex justify-between flex-col lg:flex-row gap-4 space-y-8 md:space-y-0 lg:gap-0">
                {data?.card[0].item.map((itm, index) => (
                  <div key={index} className="flex items-center gap-4 ">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${itm.criteriaIcon}`}
                      alt=""
                      width={1}
                      height={0}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="text-zinc-300 text-sm font-medium font-urbanist leading-tight tracking-tight">
                        {itm.criteriaTitle}
                      </p>
                      <p className="text-white text-nowrap text-sm font-semibold font-urbanist leading-loose tracking-tight">
                        {itm.criteria}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auditions */}
            <div className="bg-muted-background p-8 md:px-8 md:py-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-4 rounded-full border-2 border-white" />
                <h4 className="text-white text-xl font-bold leading-loose tracking-tight">
                  {data?.card[1].cardTitle}
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {data?.card[1].item.map((audition, index) => (
                  <div
                    key={index}
                    className="bg-neutral-900 p-4 flex items-center gap-4"
                  >
                    <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-neutral-800 text-base font-semibold font-['Urbanist']">
                        {index + 1}.
                      </span>
                    </div>
                    <div>
                      <p className="text-zinc-300 text-sm font-medium font-['Urbanist']">
                        {audition.criteriaTitle}
                      </p>
                      <p className="text-white text-sm font-semibold font-['Urbanist']">
                        {audition.criteria}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="space-y-3">
              <p className="text-gold-500 text-base font-semibold font-urbanist">
                {data?.noticeName}
              </p>
              <div className="space-y-2">
                {data?.notice.map((item, index) => (
                  <p
                    key={index}
                    className="text-white text-sm font-light font-urbanist">
                    {`${index + 1}. ${item}`}
                  </p>
                ))}

              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex space-x-4">
                <Button variant="default" className="text-base">
                  Apply Now
                </Button>
                <Button variant="default" className="text-base bg-white">
                  Get Tickets
                </Button>
              </div>

              <Link
                href={"#"}
                className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                <span className="underline underline-offset-4">Upcoming Events</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventSection;