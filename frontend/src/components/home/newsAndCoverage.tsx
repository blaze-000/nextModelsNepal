import { motion } from "framer-motion";
import ImageBox from "../molecules/image-box";

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
      image: "/news_1.jpg",
      title: "Next Models Nepal Hosts Successful Fashion Week Event",
      description:
        "A spectacular showcase of emerging designers and models, setting new standards for the Nepalese fashion industry.",
      link: "#",
    },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-6 px-2 md:px-8">
          {newsItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 * i }}
              viewport={{ once: true }}
            >
              <ImageBox
                image={item.image}
                title={item.title}
                desc={item.description}
                link={item.link}
                buttonText="Visit News Source"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  );
};

export default NewsSection;