import React from "react";
import Image from "next/image";

const ImageBox = ({ image, title, desc, link, buttonText }) => {
  return (
    <article className="bg-stone-900 flex flex-col justify-between overflow-hidden hover:bg-stone-800 transition-colors duration-300 p-6 md:p-6">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Image
          width={0}
          height={0}
          src={image}
          alt={title}
          sizes="100vw"
          className="w-full h-48 md:h-72 lg:h-72 object-cover object-top scale-110 hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="pt-4 md:pt-4 pr-2 md:pr-4">
        <div className="mb-4 md:mb-6">
          <h3 className="text-base lg:text-base leading-relaxed font-semibold text-white mb-3 md:mb-4">
            {title}
          </h3>
          <p className="text-sm md:text-base font-light text-white/80 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
      <div>
        {/* CTA Button */}
        <a
          href={link}
          className="inline-flex items-center gap-2 md:gap-3 text-gold-500 hover:text-gold-400 font-semibold text-sm md:text-base transition-colors duration-200 group"
        >
          <span className="underline decoration-1 underline-offset-4">
            {buttonText}
          </span>
          <i className="group-hover:translate-x-1 transition-transform duration-200 ri-arrow-right-up-line" />
        </a>
      </div>
    </article>
  );
};

export default ImageBox;
