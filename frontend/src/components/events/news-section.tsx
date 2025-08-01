import Image from "next/image";
import React from "react";
import ImageBox from "../molecules/image-box";
import { Button } from "../ui/button";

export const NewsSection = () => {
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
  ];

  return (
    <div className="w-full bg-background pb-40 pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center px-2 mb-6">
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
              News and Coverage
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
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
       
      </div>
    </div>
  );
};
