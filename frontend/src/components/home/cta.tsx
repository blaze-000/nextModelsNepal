const CTASection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Glowing background effect */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 h-96 opacity-50 bg-gradient-radial from-amber-500 to-transparent rounded-full blur-3xl" />

      {/* Stage effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-96 bg-zinc-800 shadow-2xl" />
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl h-12 bg-zinc-900" />

      {/* Spotlight effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-60 bg-gradient-to-b from-yellow-100/30 via-amber-200/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-8">
              <span className="text-amber-500 text-5xl lg:text-7xl font-light font-['Newsreader']">The Runway</span>
              <img className="w-32 h-16 lg:w-48 lg:h-20 rounded-full border border-stone-300" src="https://placehold.co/187x80" alt="Badge" />
              <span className="text-amber-500 text-5xl lg:text-7xl font-light font-['Newsreader']">Is Waiting !!!</span>
            </div>
            <h2 className="text-white text-4xl lg:text-6xl font-light font-['Newsreader']">
              It is Your Time to Step into the Limelight!
            </h2>
          </div>

          <p className="text-white text-lg lg:text-xl font-normal font-['Urbanist'] leading-loose tracking-tight max-w-3xl mx-auto">
            Embarking on a modeling career can be daunting. Don't let self-doubt hold you back. Our expert training and personalized guidance are designed to hone your skills and boost your confidence.
          </p>

          <button className="bg-amber-500 rounded-full px-8 py-4 text-yellow-950 text-xl font-bold font-['Urbanist'] hover:bg-amber-600 transition-colors">
            Become a model
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;