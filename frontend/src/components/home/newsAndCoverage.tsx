import { motion } from "framer-motion";
import ImageBox from "../molecules/image-box";
import { useEffect, useState } from "react";
import Axios from "@/lib/axios-instance";
import { normalizeImagePath } from "@/lib/utils";
import Link from "next/link";

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/api/news");
        setNewsItems(response.data.data.slice(0, 2));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    })();
  }, []);

  return (
    <section className="w-full bg-background pb-24 pt-20 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 md:mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight font-newsreader text-white mb-2">
              Our
            </h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-gold-500 font-newsreader tracking-tight">
              News And Coverage
            </h1>
          </div>
          <p className="text-sm md:text-base text-white/90 leading-relaxed tracking-wider font-light px-4 md:px-0">
            Next Models Nepal specializes in top-tier event management services in Nepal. <br className="hidden md:block" />
            <span className="md:hidden"> </span>
            We handle every detail, ensuring your event is flawless and memorable.
          </p>
        </motion.div>

        {/* News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6">
          {newsItems?.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              viewport={{ once: true }}
            >
              <ImageBox
                image={normalizeImagePath(item.image)}
                title={item.title}
                desc={item.description}
                link={item.link}
                buttonText="Visit News Source"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Link
            href="/events/news-press"
            className="py-4 md:mb-8 lg:mb-0 rounded-full text-gold-500 text-base -tracking-tight font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-auto"
          >
            <span className="underline underline-offset-4">
              View All News
            </span>
            <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-extralight" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;