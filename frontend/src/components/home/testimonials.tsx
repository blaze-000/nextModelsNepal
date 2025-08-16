"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";

const TestimonialSection: React.FC = () => {
  const [data, setData] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Axios.get('/api/feedback');
        const data = res.data;
        // console.log(data.data);
        setData(data.data);
      }
      catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const maxPage = Math.ceil((data?.length || 0) / itemsPerPage) - 1;

  const handlePrev = () => setPage((p) => (p > 0 ? p - 1 : p));
  const handleNext = () => setPage((p) => (p < maxPage ? p + 1 : p));
  const currentTestimonials = data?.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-16 pt-28 px-6">
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
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-12">
          {currentTestimonials?.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-muted-background p-10 flex flex-col justify-between min-h-[280px] h-full hover:shadow-xl transition-shadow duration-300"
            >
              <div>
                <i className="ri-double-quotes-l text-gold-500 w-10 h-10 text-2xl" />
                <p className="text-neutral-300 leading-relaxed mb-4">
                  {testimonial.message}
                </p>
              </div>
              <div className="flex items-center mt-auto pt-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={normalizeImagePath(testimonial.image)}
                    alt={testimonial.name}
                    layout="fill"
                    objectFit="cover"
                    quality={75}
                    className="object-top"
                  />
                </div>
                <p className="text-neutral-100 font-semibold">
                  {testimonial.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth -mx-6 px-6">
          <div className="flex space-x-6 w-max">
            {data?.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-muted-background w-[80vw] min-w-[300px] max-w-[400px] snap-start shrink-0 p-6 flex flex-col justify-between"
              >
                <div>
                  <i className="ri-double-quotes-l text-gold-500 w-10 h-10 text-2xl" />
                  <p className="text-neutral-300 leading-relaxed mb-4">
                    {testimonial.message}
                  </p>
                </div>
                <div className="flex items-center mt-auto pt-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={normalizeImagePath(testimonial.image)}
                      alt={testimonial.name}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                      className="object-top"
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
