"use client";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { normalizeImagePath } from "@/lib/utils";

const ModelGrid: React.FC<ModelGridProps> = ({ models, children }) => {
  return (
    <div className="space-y-8">
      {/* Desktop Grid */}
      <div className="hidden xl:grid lg:grid-cols-4 gap-6 ">
        {models?.map((model: Model, index: number) => (
          <div
            key={index}
            className="relative bg-white overflow-hidden group transition-transform"
          >
            <Image
              src={normalizeImagePath(model.coverImage)}
              alt="model"
              width={400}
              height={0}
              className="w-full h-80 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              {children(model)}
            </div>
            {model.slug && (
              <Link
                href={`/models/${model.slug}`}
                className="absolute bottom-5 right-3"
              >
                <i className="w-6 h-6 text-gold-400 rounded ri-arrow-right-up-line text-2xl font-light" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Slider */}
      <div className="xl:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth">
        <div className="flex space-x-6 w-max px-6">
          {models?.map((model: Model, index: number) => (
            <div
              key={index}
              className="relative overflow-hidden group w-[75vw] max-w-xs  snap-start shrink-0"
            >
              <Image
                className="w-full h-80 object-cover object-top [mask:linear-gradient(to_top,transparent_0%,black_30%)]"
                src={normalizeImagePath(model.coverImage)}
                alt="model"
                width={300}
                height={0}
              />
              <div className="absolute bottom-6 left-6 right-6">
                {children(model)}
              </div>
              {model.slug && (
                <Link
                  href={`/models/${model.slug}`}
                  className="absolute bottom-5 right-3"
                >
                  <i className="w-6 h-6 text-gold-400 rounded ri-arrow-right-up-line text-2xl font-light" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelGrid;
