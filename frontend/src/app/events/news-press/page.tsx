import ImageBox from "@/components/molecules/image-box";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function NewsPress() {
  const newsItems = [
    {
      id: 1,
      image: "/news_1.jpg",
      title: "Mister. Nepal",
      description:
        "Next Models Nepal leads Nepal’s fashion and entertainment scene—discovering talent, creating iconic events, and shaping industry trends.",
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
    <div className="w-full bg-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-center gap-4 py-4">
            <Button variant="outline" className="py-2">
              <span>Type:</span>
              <span>Interview</span>
              <i className="ri-arrow-down-s-line text-lg" />
            </Button>
            <Button variant="outline" className="py-2">
              <span>Event:</span>
              <span>Miss Nepal Peace</span>
              <i className="ri-arrow-down-s-line text-lg" />
            </Button>
            <Button variant="outline" className="py-2">
              <span>Year:</span>
              <span>2024</span>
              <i className="ri-arrow-down-s-line text-lg" />
            </Button>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" className="py-2 min-w-0">
                <span>Type:</span>
                <span>Interview</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
              <Button variant="outline" className="py-2 min-w-0">
                <span>Event:</span>
                <span>Miss Nepal Peace</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
              <Button variant="outline" className="py-2 min-w-0">
                <span>Year:</span>
                <span>2024</span>
                <i className="ri-arrow-down-s-line text-lg" />
              </Button>
            </div>
          </div>
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
              buttonText={`About ${item.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
