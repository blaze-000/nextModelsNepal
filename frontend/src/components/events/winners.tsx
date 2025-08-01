"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import ModelGrid from "../molecules/model-grid";

export const Winners = () => {
  const models = [
    {
      tag: "Winner",
      name: "Monika Adhikary",
      designation: "Miss Nepal Peace 2024",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monika",
    },
    {
      tag: "1st Runner Up",
      name: "Anisha Parajuli",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/anisha",
    },
    {
      tag: "2nd Runner Up",
      name: "Pala Regmi",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/pala",
    },
    {
      tag: "Nurse With a purpose",
      name: "Monika Thapa Magar",
      designation: "Miss Nepal Peace",
      image: "/bro_1.png",
      link: "https://nextmodelnepal.com/models/monikathapa",
    },
  ];

  return (
    <div className="w-full bg-background pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-6 ">
        {/* Title */}
        <div className="flex justify-between items-center pb-10">
          <div className="flex-1 flex items-center gap-2">
            <Image
              src="/small_star.svg"
              alt=""
              width={1}
              height={0}
              sizes="100vw"
              className="w-4 h-4 rounded-full"
            />
            <h3 className="text-white text-xl font-normal font-newsreader tracking-wide">
              Winners from Past Events
            </h3>
          </div>

          <Button variant="outline" className="py-2 mr-4">
            <span>Sort By:</span>
            <span>Most Recent</span>
            <i className="ri-arrow-down-s-line text-lg" />
          </Button>
          <Button variant="outline" className="py-2">
            <span>Sort By:</span>
            <span>Most Recent</span>
            <i className="ri-arrow-down-s-line text-lg" />
          </Button>
        </div>

        {/* Model Grid */}
        <ModelGrid models={models}>
          {(model) => (
            <div className="">
              {model.tag && (
                <div
                  className={`${
                    model.tag.toLowerCase() === "winner"
                      ? "text-gold-500"
                      : "text-white"
                  } text-base font-bold flex items-center gap-1 pb-2`}
                >
                  {model.tag === "Winner" ? (
                    <i className="ri-vip-crown-line text-gold-500 text-base" />
                  ) : (
                    <i className="ri-vip-crown-line text-white text-base" />
                  )}
                  {model.tag}
                </div>
              )}
              <h4 className="text-white text-[22px] font-medium font-newsreader leading-5 tracking-tight">
                {model.name}
              </h4>
              <p className="text-white text-base font-light tracking-wider">
                {model.designation}
              </p>
            </div>
          )}
        </ModelGrid>
      </div>
    </div>
  );
};
