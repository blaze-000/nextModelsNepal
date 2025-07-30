import Image from "next/image";

const ModelsPortfolioSection = () => {
  const femaleModels = [
    { name: "Monika Adhikary", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Pratista", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Kristina", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Aayushma Poudel", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" }
  ];

  const maleModels = [
    { name: "Model Name 1", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Model Name 2", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Model Name 3", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" },
    { name: "Model Name 4", location: "Kathmandu, Nepal", image: "https://placehold.co/366x386" }
  ];

  const ModelGrid = ({ models, title, viewAllText }) => (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <div>
          <Image
            src="/star.svg"
            alt=""
            width={20}
            height={20}
          />
        </div>
        <h3 className="text-white text-xl lg:text-2xl font-medium font-['Newsreader'] tracking-tight">
          {title}
        </h3>
      </div>

      <div className="max-w-7xl grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {models.map((model: { name: string, location: string, image: string }, index: number) => (
          <div key={index} className="relative bg-white overflow-hidden rounded-lg group hover:scale-105 transition-transform">
            <img className="w-full h-96 object-cover" src={model.image} alt={model.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h4 className="text-gold-500 text-xl lg:text-2xl font-medium font-['Newsreader'] tracking-tight mb-2">
                {model.name}
              </h4>
              <div className="flex items-center gap-2">
                <i className="w-4 h-4 ri-map-pin-line" />
                <span className="text-white text-sm lg:text-base font-semibold font-['Urbanist']">
                  {model.location}
                </span>
              </div>
            </div>
            <div className="absolute bottom-6 right-6">
              <i className="w-6 h-6 text-gold-400 rounded ri-arrow-right-up-line" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-7 py-4 rounded-full text-gold-500 text-lg font-bold font-['Urbanist'] underline hover:text-white group transition-colors flex items-center gap-1.5">
          {viewAllText} <i className="group-hover:w-5 group-hover:h-5 transition-all duration-300 w-4 h-4 ri-arrow-right-up-line" />
        </button>
      </div>
    </div>
  );

  return (
    <section className="bg-stone-950 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-48">
        <div className="flex mb-16">
          {/* Find a Face for your brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h2 className="text-white text-3xl lg:text-5xl font-light font-['Newsreader']">Find a</h2>
              <Image
                className="w-24 h-12 lg:w-36 lg:h-16 rounded-full border border-stone-300 mb-3"
                width={32}
                height={0}
                src="https://placehold.co/187x80"
                alt="" />
              <h2 className="text-white text-4xl lg:text-5xl font-light font-['Newsreader']">Face</h2>
            </div>
            <h2 className="text-gold-500 text-5xl lg:text-6xl font-light font-['Newsreader']">For Your Brand!</h2>
          </div>

          {/* <div className="w-full"> */}
          <p className="text-white text-md lg:text-lg font-light font-['Urbanist'] leading- tracking-tight max-w-md ml-auto mt-auto">
            Explore our portfolio of diverse and talented models, each ready to redefine the world of fashion and entertainment.
          </p>
          {/* </div> */}
        </div>

        <div className="space-y-24">
          <ModelGrid
            models={femaleModels}
            title="Female Models"
            viewAllText="See All Female Models"
          />
          <ModelGrid
            models={maleModels}
            title="Male Models"
            viewAllText="See All Male Models"
          />
        </div>
      </div>
    </section>
  );
};

export default ModelsPortfolioSection;