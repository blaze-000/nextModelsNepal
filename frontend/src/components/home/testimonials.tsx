"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

const dummyTestimonials: Testimonial[] = [
  {
    quote:
      "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
    name: "Ronish Khadgi",
    image: "/news_1.jpg",
  },
  {
    quote:
      "As a model for Next Model Nepal, I've had an incredible experience. The opportunities provided by this platform are unparalleled, and the exposure I've gained has significantly boosted my career. The team is professional, supportive, and always strives to bring out the best in us. I'm proud to be associated with such a prestigious organization.",
    name: "Bikram Aditya Mahaseth",
    image: "/news_1.jpg",
  },
  {
    quote:
      "Being a part of Next Model Nepal has been a transformative experience for me. The platform offers excellent training, exposure, and opportunities that have helped me advance my modeling career and grow as a model. The team's dedication to excellence is evident in every aspect of their work.",
    name: "Samrat Pratap Singh",
    image: "/news_1.jpg",
  },
  {
    quote:
      "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
    name: "Monika Adhikary",
    image: "/news_1.jpg",
  },
  {
    quote:
      "As a model for Next Model Nepal, I've had an incredible experience. The opportunities provided by this platform are unparalleled, and the exposure I've gained has significantly boosted my career. The team is professional, supportive, and always strives to bring out the best in us. I'm proud to be associated with such a prestigious organization.",
    name: "Bikram Aditya Mahaseth",
    image: "/news_1.jpg",
  },
  {
    quote:
      "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
    name: "Ronish Khadgi",
    image: "/news_1.jpg",
  },
  {
    quote:
      "Next Model Nepal is a game-changer in the modeling industry. Their commitment to nurturing talent and providing a platform for models to shine is commendable. The events are well-organized, and the networking opportunities are immense. I've learned and grown so much since joining, and I highly recommend it to any aspiring model.",
    name: "Monika Adhikary",
    image: "/news_1.jpg",
  },
  {
    quote:
      "Being a part of Next Model Nepal has been a transformative experience for me. The platform offers excellent training, exposure, and opportunities that have helped me advance my modeling career and grow as a model. The team's dedication to excellence is evident in every aspect of their work.",
    name: "Samrat Pratap Singh",
    image: "/news_1.jpg",
  },
];

const TestimonialSection: React.FC = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const maxPage = Math.ceil(dummyTestimonials.length / itemsPerPage) - 1;

  const handlePrev = () => setPage((p) => (p > 0 ? p - 1 : p));
  const handleNext = () => setPage((p) => (p < maxPage ? p + 1 : p));
  const currentTestimonials = dummyTestimonials.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-16 md:py-28 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        viewport={{ once: true }} className="text-center text-4xl lg:text-5xl tracking-tight font-light font-newsreader mb-10 flex flex-col md:flex-row justify-center items-center gap-2">
        <span className="md:inline">What Our</span>
        <div className="text-gold-500 relative inline-block">
          Shining Stars
          <Image
            src="/star.svg"
            alt=""
            height={12}
            width={12}
            className="w-5 h-5 absolute -top-3 left-1/2 animate-bounce-slow"
          />
        </div>
        <span className="md:inline">Have to say!</span>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-10">
          {currentTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-muted-background lg:m-10 flex flex-col justify-between min-h-[280px] h-full hover:shadow-xl transition-shadow duration-300"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted-background p-6 flex flex-col justify-between min-h-[280px] h-full"
              >
                <div>
                  <i className="ri-double-quotes-l text-gold-500 w-10 h-10 text-2xl" />
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center mt-auto pt-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                    />
                  </div>
                  <p className="text-neutral-100 font-semibold">
                    {testimonial.name}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth -mx-6 px-6">
          <div className="flex space-x-6 w-max">
            {dummyTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-muted-background w-[80vw] min-w-[80vw] max-w-[80vw] snap-start shrink-0 p-6 flex flex-col justify-between"
              >
                <div>
                  <i className="ri-double-quotes-l text-gold-500 w-10 h-10 text-2xl" />
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="flex items-center mt-auto pt-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                    />
                  </div>
                  <p className="text-neutral-100 font-semibold">{testimonial.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden md:flex justify-end mt-16 mr-10 text-gray-50">
          <button
            onClick={handlePrev}
            className={`bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center mr-4 transition-all ${page === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Previous Testimonial"
            disabled={page === 0}
          >
            <i className="ri-arrow-left-line text-xl" />
          </button>
          <button
            onClick={handleNext}
            className={`bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center transition-all ${page === maxPage ? "opacity-50 cursor-not-allowed" : ""
              }`}
            aria-label="Next Testimonial"
            disabled={page === maxPage}
          >
            <i className="ri-arrow-right-line text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
