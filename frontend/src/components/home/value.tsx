import Image from "next/image";

const ValuesSection = () => {
  const features = [
    {
      number: "01",
      title: "Professionalism",
      description: "Backed by experts & mentors.",
    },
    {
      number: "02",
      title: "Passion",
      description: "Empowering talent with dedication.",
    },
    {
      number: "03",
      title: "Prestige",
      description: "Nepal's most recognized modeling brand.",
    },
  ];

  return (
    <section className="bg-background2 pt-12 pb-18 relative overflow-hidden">
      <div className="container mx-auto sm:px-6 lg:px-8 xl:px-36 px-6">
        {/* Main Heading */}
        <div className="text-center">
          <h2 className="font-newsreader text-3xl md:text-4xl lg:text-5xl font-extralight text-white">
            At Next Models Nepal{" "}
            <span className="text-orange-400 font-newsreader font-extralight">
              We Ensure
            </span>
            ,
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-12 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative text-center md:text-left"
            >
              {/* Feature Content */}
              <div className="relative z-10 flex flex-col">
                {/* Icon and Title */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Image src="star.svg" alt="Star" width={36} height={36} />
                  <h3 className="font-newsreader text-xl md:text-2xl font-light text-white">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex justify-center md:justify-start">
                  <div className="ml-12 md:ml-12">
                    <p className="text-white text-sm md:text-sm leading-relaxed tracking-wider font-extralight">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Number */}
              <div className="absolute inset-0 flex items-start justify-center md:justify-between pl-12 pointer-events-none">
                <span className="font-newsreader text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold text-neutral-700/40 leading-none select-none">
                  {feature.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
