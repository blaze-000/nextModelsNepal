const HeroSection = () => {
  return (
    <section className="min-h-screen bg-stone-950 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-950/10 to-stone-950" />
      </div>

      <div className="container mx-auto px-4 lg:px-48 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-9">
            <div className="space-y-7">
              <div className="text-center lg:text-left">
                <span className="text-white text-2xl lg:text-3xl font-normal font-['Urbanist'] tracking-wide">We are </span>
                <span className="text-amber-500 text-2xl lg:text-3xl font-normal font-['Urbanist'] tracking-wide">Next Models Nepal</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="text-white text-4xl lg:text-8xl font-light font-['Newsreader']">Nepal's </span>
                <span className="text-amber-500 text-4xl lg:text-8xl font-light font-['Newsreader']">No.1</span>
              </div>
              <div className="text-center lg:text-left text-white text-4xl lg:text-8xl font-light font-['Newsreader']">Modeling</div>
              <div className="text-center lg:text-left text-white text-4xl lg:text-8xl font-light font-['Newsreader']">Agency</div>

              <div className="flex justify-center lg:justify-start">
                <img className="w-40 h-16 lg:w-52 lg:h-20 rounded-full shadow-lg border border-stone-300" src="https://placehold.co/205x80" alt="Badge" />
              </div>
            </div>

            <div className="space-y-7">
              <div className="text-center lg:text-left text-white text-lg lg:text-xl font-normal font-['Urbanist'] leading-loose tracking-tight">
                Next Models Nepal is a team of seasoned professionals dedicated to talent management, elite training, and launching aspiring models.
              </div>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 lg:gap-7">
                <button className="w-full sm:w-60 h-16 bg-amber-500 rounded-full text-yellow-950 text-xl font-bold font-['Urbanist'] leading-loose tracking-tight hover:bg-amber-600 transition-colors">
                  Hire a model
                </button>
                <button className="w-full sm:w-auto px-7 py-5 rounded-full text-amber-500 text-xl font-bold font-['Urbanist'] underline leading-loose tracking-tight hover:text-amber-400 transition-colors">
                  Upcoming Events
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="hidden lg:block relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <img className="w-full h-52 rounded-3xl object-cover" src="https://placehold.co/206x207" alt="Model 1" />
                <img className="w-full h-52 rounded-3xl object-cover" src="https://placehold.co/206x207" alt="Model 2" />
              </div>
              <div className="space-y-6 mt-12">
                <img className="w-full h-52 rounded-3xl object-cover" src="https://placehold.co/206x207" alt="Model 3" />
                <img className="w-full h-52 rounded-3xl object-cover" src="https://placehold.co/206x207" alt="Model 4" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-20 bg-amber-500 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;