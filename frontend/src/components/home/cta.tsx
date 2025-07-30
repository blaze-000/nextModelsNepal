import { Button } from "../ui/button";
import Image from "next/image";

const CTASection = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: "url('/runway-lightoff.png')" }}
    >

      {/* Glowing background effect */}
      {/* <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 h-96 opacity-50 bg-gradient-radial from-amber-500 to-transparent rounded-full blur-3xl" /> */}

      {/* Stage effect */}
      {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-96 bg-zinc-800 shadow-2xl" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-12 bg-zinc-900" /> */}

      {/* Spotlight effects */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-60 bg-gradient-to-b from-yellow-100/30 via-amber-200/10 to-transparent" /> */}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
              <h3 className="text-gold-500 text-4xl lg:text-6xl font-light font-newsreader text-nowrap">The Runway</h3>
              <Image
                src="/span-image.jpg"
                alt="Badge"
                height={200}
                width={200}
                className="w-24 lg:w-36 h-12 lg:h-16 rounded-full border border-stone-300 object-cover"
              />

              <h3 className="text-gold-500 text-4xl lg:text-6xl font-light font-newsreader text-nowrap">Is Waiting !!!</h3>
            </div>
            <h2 className="text-white text-3xl lg:text-5xl font-light font-newsreader">
              It is Your Time to Step into the Limelight!
            </h2>
          </div>

          <p className="text-white text-md lg:text-lg font-normal font-urbanist leading-loose tracking-tight max-w-3xl mx-auto">
            Embarking on a modeling career can be daunting. Don&rsquo;t let self-doubt hold you back. Our expert training and personalized guidance are designed to hone your skills and boost your confidence.
          </p>

          <Button className="flex items-center gap-2 mx-auto">
            Become a model <i className="ri-arrow-right-up-line" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;