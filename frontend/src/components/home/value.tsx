const ValuesSection = () => {
  return (
    <section className="bg-zinc-950 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-48">
        <div className="text-center mb-12">
          <h2 className="text-white text-4xl lg:text-6xl font-light font-['Newsreader'] mb-4">
            At Next Models Nepal <span className="text-amber-500">We Ensure</span>,
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
          {[
            { number: "01", title: "Professionalism", desc: "Backed by experts & mentors." },
            { number: "02", title: "Passion", desc: "Empowering talent with dedication." },
            { number: "03", title: "Prestige", desc: "Nepal's most recognized modeling brand." }
          ].map((item, index) => (
            <div key={index} className="text-center relative">
              <div className="text-neutral-900 text-8xl lg:text-[250px] font-semibold font-['Newsreader'] absolute top-0 left-1/2 transform -translate-x-1/2 -z-10">
                {item.number}
              </div>
              <div className="pt-16 lg:pt-32">
                <div className="w-14 h-14 bg-amber-500 rotate-12 mx-auto mb-6" />
                <h3 className="text-white text-2xl lg:text-3xl font-normal font-['Newsreader'] tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-white text-lg lg:text-xl font-normal font-['Urbanist'] leading-loose tracking-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;