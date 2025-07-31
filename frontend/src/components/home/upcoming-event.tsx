import Image from "next/image";
import { Button } from "../ui/button";

const UpcomingEventSection = () => {
  return (
    <section className="bg-stone-950 py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-8">
            <Image
              src="/star.svg"
              alt=""
              width={24}
              height={0}
              className="w-5 h-5 text-gold-500"
            />
            <h2 className="text-white text-xl lg:text-2xl font-medium font-newsreader tracking-tight">
              Upcoming Event
            </h2>
          </div>

          <div className="flex flex-col gap-2 items-center">
            {/* Mobile Title  */}
            <div className="text-center lg:hidden">
              <div className="text-4xl font-light font-newsreader text-white mb-1">
                <span className="text-gold-500 relative inline-block">
                  Shine
                  <Image
                    src="/star.svg"
                    alt=""
                    height={1}
                    width={1}
                    className="h-4 w-4 absolute -top-2 -right-2 select-none"
                  />
                </span>
                <span className="ml-2">on Nepal&rsquo;s</span>
              </div>
              <div className="text-4xl tracking-tighter font-light font-newsreader text-white flex items-center justify-center gap-2">
                <span>Premier</span>
                <span>Fashion Event.</span>
              </div>
              <div className="text-5xl font-light font-newsreader tracking-tighter text-primary mb-1 mt-2">
                Presenting
              </div>
              <div className="text-5xl font-light font-newsreader tracking-tighter text-gold-500 mb-4">
                MR. Nepal 2025
              </div>
            </div>

            {/* Desktop Title */}
            <div className="text-center hidden lg:block">
              <div className="text-5xl font-light font-newsreader text-white mb-1 flex items-center justify-center gap-2.5">
                <span className="text-gold-500 relative inline-block">
                  Shine
                  <Image
                    src="/star.svg"
                    alt=""
                    height={1}
                    width={1}
                    className="h-5 w-5 absolute -top-2 -right-2 select-none"
                  />
                </span>
                <span>on Nepal&rsquo;s Premier</span>
                <Image
                  src="/span-image.jpg"
                  alt=""
                  width={1}
                  height={0}
                  sizes="100vw"
                  className="w-32 h-16 rounded-full border border-stone-300 mb-3"
                />
                <span>Fashion Event.</span>
              </div>
              <div className="text-6xl font-light font-newsreader tracking-tighter text-gold-500 mb-4">
                Presenting MR. Nepal 2025
              </div>
            </div>
            
            {/* Description - only on moble */}
            <div className="text-center lg:hidden">
              <p className="text-white text-base font-light max-w-2xl mx-auto">
                Next Models Nepal leads Nepal&rsquo;s fashion and entertainment
                scene—discovering talent, creating iconic events, and shaping
                industry trends.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-24 items-center">
          {/* Image section  */}
          <div className="order-1 lg:order-1 relative">
            <Image
              height={500}
              width={500}
              className="h-full w-auto mx-auto"
              src="/mr-nepal-2025-poster-1.jpg"
              alt="Mr. Nepal 2025"
            />
            <div className="h-[115%] absolute right-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="h-[115%] absolute left-0 -top-[7.5%] w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute top-0 -left-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="w-[115%] absolute bottom-0 -right-[7.5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
          </div>

          {/* Content section  */}
          <div className="order-2 lg:order-2 space-y-8">
            {/* Description - shows on desktop  */}
            <p className="hidden lg:block text-white text-md lg:text-lg font-light lead">
              Next Models Nepal leads Nepal&rsquo;s fashion and entertainment
              scene—discovering talent, creating iconic events, and shaping
              industry trends.
            </p>

            {/* Eligibility Section */}
            <div className="bg-stone-900 p-8 md:px-8 md:py-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded-full border-2 border-white " />
                <h4 className="text-white text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">
                  Eligibility Criteria
                </h4>
              </div>

              <div className="flex justify-between flex-col lg:flex-row gap-4 space-y-8 md:space-y-0 lg:gap-0">
                {[
                  {
                    label: "Age Range",
                    value: "Required 18-32 Years",
                    icon: "/cake-1.svg",
                  },
                  {
                    label: "Min. Height",
                    value: "Height 5.7 or above is preferred",
                    icon: "/ruler-1.svg",
                  },
                  { label: "Gender", value: "Male", icon: "/gender.svg" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 ">
                    <Image
                      src={item.icon}
                      alt=""
                      width={1}
                      height={0}
                      className="w-5 h-5 text-gold-500"
                    />
                    <div>
                      <p className="text-zinc-300 text-sm font-medium font-urbanist leading-tight tracking-tight">
                        {item.label}
                      </p>
                      <p className="text-white text-nowrap text-sm font-semibold font-urbanist leading-loose tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auditions Section */}
            <div className="bg-stone-900 p-8 md:px-8 md:py-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-4 rounded-full border-2 border-white" />
                <h4 className="text-white text-xl font-bold leading-loose tracking-tight">
                  Auditions
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { city: "Pokhara", date: "22nd July, Shrawan 6th" },
                  { city: "Kathmandu", date: "26th July, Shrawan 10th" },
                ].map((audition, index) => (
                  <div
                    key={index}
                    className="bg-neutral-900 p-4 flex items-center gap-4"
                  >
                    <div className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-neutral-800 text-base font-semibold font-['Urbanist']">
                        {index + 1}.
                      </span>
                    </div>
                    <div>
                      <p className="text-zinc-300 text-sm font-medium font-['Urbanist']">
                        {audition.city}
                      </p>
                      <p className="text-white text-sm font-semibold font-['Urbanist']">
                        {audition.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="space-y-3">
              <p className="text-gold-500 text-base font-semibold font-urbanist">
                Notice:
              </p>
              <div className="space-y-2">
                <p className="text-white text-sm font-light font-urbanist">
                  1. Participants must pay NRS. 1,000 to register for the event
                </p>
                <p className="text-white text-sm font-light font-urbanist">
                  2. Registrations are non-refundable & non-transferable
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Primary Buttons */}
              <div className="flex space-x-4">
                <Button variant="default" className="text-base">
                  Apply Now
                </Button>
                <Button variant="default" className="text-base bg-white">
                  Get Tickets
                </Button>
              </div>

              {/* About Button */}
              <button className="px-4 py-4 rounded-full text-gold-500 text-base font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer -tracking-tight">
                <span className="underline"> Upcoming Events</span>
                <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventSection;