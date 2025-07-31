import Image from "next/image";
import React from "react";
import ImageBox from "../molecules/image-box";
import { Button } from "../ui/button";

export const PastEvents = () => {
  const newsItems = [
    {
      id: 1,
      image: "/news_1.jpg",
      title:
        "Bivash Bista and Neha Budha Crowned Winners of Model Hunt Nepal Season 9",
      description:
        "Our recent fashion show made headlines, showcasing Nepal's emerging talent pool in the modeling industry.",
      link: "#",
    },
    {
      id: 2,
      image: "/news_1.jpg",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
    {
      id: 3,
      image: "/news_1.jpg",
      title:
        "Bivash Bista and Neha Budha Crowned Winners of Model Hunt Nepal Season 9",
      description:
        "Our recent fashion show made headlines, showcasing Nepal's emerging talent pool in the modeling industry.",
      link: "#",
    },
    {
      id: 4,
      image: "/news_1.jpg",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
  ];

  return (
    <div className="w-full bg-background pb-24 pt-20 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Desktop Title */}
        <div className="text-center">
          <div className="text-5xl font-light font-newsreader text-white mb-1 flex items-center justify-center gap-2.5">
            <span>Moments</span>
            <Image
              src="/span-image.jpg"
              alt=""
              width={1}
              height={0}
              sizes="100vw"
              className="w-32 h-16 rounded-full border border-stone-300 mb-3"
            />
            <span>in the Making:</span>
          </div>
          <div className="text-6xl font-light font-newsreader tracking-tighter text-gold-500">
            Past Triumphs & Upcoming
          </div>
          <div className="text-6xl font-light font-newsreader tracking-tighter text-gold-500 mb-4">
            {" "}
            Experiences
          </div>
        </div>
        <div className="flex justify-between items-center px-2 md:px-8 mb-6">
          <div className="flex-1 flex items-center gap-2">
            <Image
              src="/small_star.svg"
              alt=""
              width={1}
              height={0}
              sizes="100vw"
              className="w-4 h-4 rounded-full "
            />
            <h3 className="text-white text-xl font-normal font-newsreader">
              Past Events
            </h3>
          </div>

          <Button variant="outline" className="py-2 ">
            <span>Sort By:</span>
            <span>Most Recent</span>
            <i className="ri-arrow-down-s-line text-lg" />
          </Button>

          <div></div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6 px-2 md:px-8">
          {newsItems.map((item) => (
            <ImageBox
              key={item.id}
              image={item.image}
              title={item.title}
              desc={item.description}
              link={item.link}
              buttonText="Visit News Source"
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-4 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <span className="underline">See All Past Events</span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-light" />
          </button>
        </div>
      </div>
    </div>
  );
};
