import Image from "next/image";

const EventsSection = () => {
  const events = [
    {
      status: "Ongoing",
      title: "Miss Nepal Peace",
      date: "19th July to 6th September",
      description:
        "Miss Nepal Peace is a pageant for nurses, celebrating their role in care and peace while empowering them to represent Nepal on global stages.",
      image: "https://placehold.co/729x594",
      hasTickets: true,
    },
    {
      status: "Ended on 2025/08/02",
      title: "Model Hunt Nepal",
      date: "19th July to 6th September",
      description:
        "Model Hunt Nepal, started in 2015, discovers and trains top models, promoting Nepali culture and connecting brands with the global fashion industry.",
      image: "https://placehold.co/729x594",
      hasTickets: false,
    },
  ];

  return (
    <section className="bg-gold-500/5 py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36">
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-6xl font-extralight font-newsreader tracking-tighter ">
                  Relive the
                </span>
                <div className="w-32 h-16 relative">
                  <Image
                    src="/span-image.jpg"
                    alt="Badge"
                    fill
                    className="rounded-full object-cover border border-stone-300"
                  />
                </div>
                <span className="text-white text-6xl font-extralight font-newsreader tracking-tighter ">
                  Glamour:
                </span>
              </div>
              <div className="flex items-center gap-4">
                <h3 className="text-primary text-6xl font-extralight font-newsreader tracking-tighter ">
                  with Our Recent Events
                </h3>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <p className="text-white text-base lg:text-base font-normal leading-loose tracking-wide">
                Step into the spotlight of our most recent event - where talent<br />
                meets opportunity and dreams take center stage
              </p>
            </div>
          </div>
        </div>





        <div className="space-y-16">
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-stone-950 rounded-2xl overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 min-h-96">
                <div className="p-8 lg:p-20 flex flex-col justify-center space-y-7">
                  <div className="px-4 py-2 bg-yellow-950 rounded-full inline-flex justify-center items-center w-fit">
                    <span className="text-gold-500 text-base font-bold font-['Urbanist'] tracking-tight">
                      {event.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-white text-4xl lg:text-7xl font-normal font-['Newsreader'] mb-2">
                      {event.title}
                    </h3>
                    <p className="text-white text-lg lg:text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">
                      {event.date}
                    </p>
                  </div>

                  <div className="space-y-7">
                    <p className="text-white text-lg lg:text-xl font-normal font-['Urbanist'] leading-loose tracking-tight">
                      {event.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {event.hasTickets && (
                        <button className="bg-gold-500 rounded-full px-8 py-4 text-yellow-950 text-xl font-bold font-['Urbanist'] leading-loose tracking-tight hover:bg-gold-600 transition-colors">
                          Get Tickets
                        </button>
                      )}
                      <button className="px-7 py-4 rounded-full text-gold-500 text-xl font-bold font-['Urbanist'] underline leading-loose tracking-tight hover:text-gold-400 transition-colors">
                        About Event
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img
                    className="w-full h-full object-cover"
                    src={event.image}
                    alt={event.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-transparent to-transparent lg:from-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
