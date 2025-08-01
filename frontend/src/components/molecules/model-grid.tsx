"use client";
import React from "react";
import Image from "next/image";

interface Model {
  image: string;
  link?: string;
  tag?: string;
  [key: string]: any;
}

interface ModelGridProps {
  models: Model[];
  children: (model: Model) => React.ReactNode;
}

const ModelGrid: React.FC<ModelGridProps> = ({ models, children }) => {
  return (
    <div className="space-y-8">
      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 ">
        {models.map((model: Model, index: number) => (
          <div
            key={index}
            className="relative bg-white overflow-hidden group transition-transform"
          >
            <img
              className="w-full h-80 object-cover"
              src={model.image}
              alt="model"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              {children(model)}
            </div>
            {model.link && (
              <a
                href={model.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6"
              >
                <i className="w-6 h-6 text-gold-400 rounded ri-arrow-right-up-line text-2xl font-light" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="lg:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth">
        <div className="flex space-x-6 w-max px-6">
          {models.map((model: Model, index: number) => (
            <div
              key={index}

              className="relative overflow-hidden group w-[75vw] min-w-[75vw] max-w-[75vw] snap-start shrink-0  "

             
            >
              <Image
                className="w-full h-80 object-cover [mask:linear-gradient(to_top,transparent_0%,black_30%)]"
                src={model.image}
                alt="model"
                width={0}
                height={0}
                sizes="100vw"
              />
              <div className="absolute bottom-6 left-6 right-6">
                {children(model)}
              </div>
              {model.link && (
                <a
                  href={model.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6"
                >
                  <i className="w-5 h-5 text-gold-400 rounded ri-arrow-right-up-line" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelGrid;
