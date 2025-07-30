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
    <section className="bg-background2 w-full pt-12 pb-18 relative overflow-hidden">
      <div className="mx-auto sm:px-6 lg:px-8 xl:px-36 px-6">
        {/* Heading */}
        <div className="text-center mb-16 mx-4">
          <h2 className="font-newsreader text-4xl md:text-4xl lg:text-5xl font-extralight text-white">
            At Next Models Nepal{" "}
            <span className="text-orange-400 font-newsreader font-extralight">
              We Ensure
            </span>
            ,
          </h2>
        </div>

        {/* ✅ Mobile View */}
        <div className="block md:hidden space-y-36">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div
                key={index}
                className={`relative text-center ${
                  isEven ? "text-right items-end" : "text-left items-start"
                } flex flex-col`}
              >
                {/* Background Number */}
                <div
                  className={`absolute -inset-8 flex items-start pointer-events-none ${
                    isEven ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="font-newsreader text-[8rem] font-bold text-neutral-700/40 leading-none tracking-tighter select-none">
                    {feature.number}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-2 px-6 -mt-2 items-start">
                  <div
                    className={`flex items-center gap-3 ${
                      isEven ? "justify-end flex-row-reverse" : "justify-start"
                    }`}
                  >
                    <Image src="/star.svg" alt="Star" width={48} height={48} />
                    <div className="flex flex-col">
                      <h3 className="font-newsreader text-xl font-light text-white">
                        {feature.title}
                      </h3>
                      <p className="text-white text-sm leading-relaxed tracking-wider font-extralight">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ Desktop View */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="relative text-center md:text-left">
              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2 items-start">
                <div className="flex items-start gap-3">
                  <Image src="/star.svg" alt="Star" width={36} height={36} />
                  <div className="flex flex-col">
                    <h3 className="font-newsreader text-xl md:text-2xl font-light text-white">
                      {feature.title}
                    </h3>
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
