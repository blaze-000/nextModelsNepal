import { Button } from "../ui/button";
import Image from "next/image";

const CTASection = () => {
  return (
    <section className="w-full">
      <div
        className="relative flex items-center justify-center overflow-hidden md:h-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/runway-lightoff.png')" }}
      >
        {/* Glowing background effect */}
        {/* <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 h-96 opacity-50 bg-gradient-radial from-gold-500 to-transparent rounded-full blur-3xl" /> */}

        {/* Stage effect */}
        {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-96 bg-zinc-800 shadow-2xl" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-12 bg-zinc-900" /> */}

        {/* Spotlight effects */}
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-60 bg-gradient-to-b from-yellow-100/30 via-gold-200/10 to-transparent" /> */}

        {/* Content */}
        <div className="relative z-10 text-center py-16 md:py-0 px-4">
          <div className="space-y-8">
            <div className="space-y-2">
              {/* Desktop Title - 1 line with image */}
              <div className="hidden lg:flex flex-row justify-center items-center gap-4">
                <h3 className="text-gold-500 text-5xl md:text-6xl font-light font-newsreader text-nowrap">
                  The Runway
                </h3>
                <Image
                  src="/span-image.jpg"
                  alt="Badge"
                  height={200}
                  width={200}
                  className="w-24 lg:w-36 h-12 lg:h-16 rounded-full border border-stone-300 object-cover"
                />
                <h3 className="text-gold-500 text-4xl lg:text-6xl font-light font-newsreader text-nowrap">
                  Is Waiting !!!
                </h3>
              </div>

              {/* Mobile Title - 5 separate lines */}
              <div className="lg:hidden flex flex-col justify-center items-center gap-1">
                <h3 className="text-gold-500 text-5xl font-light tracking-tight  font-newsreader">
                  The Runway is
                </h3>
                <h3 className="text-gold-500 text-5xl font-light tracking-tight  font-newsreader">
                  Waiting
                </h3>
                <h2 className="text-white text-5xl font-light tracking-tight  font-newsreader">
                  It is your time to
                </h2>
                <h2 className="text-white text-5xl font-light tracking-tight  font-newsreader">
                  step into the
                </h2>
                <h2 className="text-white text-5xl font-light tracking-tight  font-newsreader">
                  Limelight!
                </h2>
              </div>

              {/* Desktop subtitle - only shows on desktop */}
              <h2 className="hidden lg:block text-white text-2xl lg:text-5xl font-light font-newsreader">
                It is Your Time to Step into the Limelight!
              </h2>
            </div>

            <p className="text-white text-base px-4 md:text-lg font-normal font-urbanist leading-normal tracking-tight max-w-3xl mx-auto">
              Embarking on a modeling career can be daunting. Don&rsquo;t let
              self-doubt hold you back. Our expert training and personalized
              guidance are designed to hone your skills and boost your
              confidence.
            </p>

            <Button className="flex items-center gap-2 mx-auto text-sm lg:text-base">
              Become a model <i className="ri-arrow-right-up-line" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
