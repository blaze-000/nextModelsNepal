import React from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const NewsSection = () => {
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
      image: "https://placehold.co/697x358",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
  ];

  return (
    <div className="w-full bg-black min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-extralight font-newsreader text-white mb-2">
              Our
            </h2>
            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-extralight text-gold-500 font-newsreader tracking-tight">
              News And Coverage
            </h1>
          </div>
          <p className="text-base sm:text-base text-white/90 leading-relaxed font-light">
            Next Models Nepal specializes in top-tier event management services
            in Nepal. <br />
            We handle every detail, ensuring your event is flawless and
            memorable.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-8">
          {newsItems.map((item) => (
       
              <article key={item.id} className="bg-stone-900 flex flex-col justify-between overflow-hidden hover:bg-stone-800 transition-colors duration-300 p-6">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Image
                    width={0}
                    height={0}
                    src={item.image}
                    alt={item.title}
                    sizes="100vw"
                    className="w-full h-72 sm:h-72 lg:h-72 object-cover object-top scale-120 hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="pt-4 pr-4">
                  <div className="mb-6">
                    <h3 className="text-base lg:text-base font-semibold text-white mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-base font-light text-white/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div>
                   {/* CTA Button */}
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-3 text-gold-500 hover:text-gold-400 font-semibold text-base transition-colors duration-200 group"
                  >
                    <span className="underline decoration-1 underline-offset-4">
                      Visit News Source
                    </span>
                    <ExternalLink
                      size={18}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </a>
                </div>
              </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-16">
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-8 rounded-full transition-colors duration-200 text-lg">
            Load More News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
