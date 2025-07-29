const UpcomingEventSection = () => {
  return (
    <section className="bg-stone-950 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-48">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-6 h-6 bg-amber-500" />
            <h2 className="text-white text-xl lg:text-2xl font-medium font-['Newsreader'] tracking-tight">
              Upcoming Event
            </h2>
          </div>
          
          <div className="mb-8">
            <h3 className="text-white text-4xl lg:text-6xl font-light font-['Newsreader'] mb-4">
              <span className="text-amber-500">Shine</span> on Nepal's Premier Fashion Event.
            </h3>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
              <span className="text-white text-5xl lg:text-7xl font-light font-['Newsreader']">Presenting</span>
              <span className="text-amber-500 text-5xl lg:text-7xl font-light font-['Newsreader']">MR.Nepal 2025</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <img className="w-full h-auto max-w-md mx-auto" src="https://placehold.co/564x705" alt="Mr. Nepal 2025" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <p className="text-white text-lg lg:text-xl font-normal font-['Urbanist'] leading-loose tracking-tight">
              Next Models Nepal leads Nepal's fashion and entertainment scene—discovering talent, creating iconic events, and shaping industry trends.
            </p>

            {/* Eligibility Section */}
            <div className="bg-stone-900 p-6 lg:p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded-full border-2 border-white" />
                <h4 className="text-white text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">
                  Eligibility Criteria
                </h4>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: "Age Range", value: "Required 18-32 Years" },
                  { label: "Min. Height", value: "Height 5.7 or above is preferred" },
                  { label: "Gender", value: "Male" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-amber-500" />
                    <div>
                      <p className="text-zinc-300 text-sm font-medium font-['Urbanist'] leading-tight tracking-tight">
                        {item.label}
                      </p>
                      <p className="text-white text-sm font-semibold font-['Urbanist'] leading-loose tracking-tight">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auditions Section */}
            <div className="bg-stone-900 p-6 lg:p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-4 rounded-full border-2 border-white" />
                <h4 className="text-white text-xl font-bold font-['Urbanist'] leading-loose tracking-tight">
                  Auditions
                </h4>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { city: "Pokhara", date: "22nd July, Shrawan 6th" },
                  { city: "Kathmandu", date: "26th July, Shrawan 10th" }
                ].map((audition, index) => (
                  <div key={index} className="bg-neutral-900 p-4 flex items-center gap-4">
                    <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-neutral-800 text-base font-semibold font-['Urbanist']">
                        {index + 1}.
                      </span>
                    </div>
                    <div>
                      <p className="text-zinc-300 text-base font-medium font-['Urbanist']">
                        {audition.city}
                      </p>
                      <p className="text-white text-base font-semibold font-['Urbanist']">
                        {audition.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="space-y-3">
              <p className="text-amber-500 text-base font-semibold font-['Urbanist']">Notice:</p>
              <div className="space-y-2">
                <p className="text-white text-base font-normal font-['Urbanist']">
                  Participants must pay NRS. 1,000 to register for the event
                </p>
                <p className="text-white text-base font-normal font-['Urbanist']">
                  Registrations are non-refundable & non-transferable
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-500 rounded-full px-8 py-4 text-yellow-950 text-xl font-bold font-['Urbanist'] hover:bg-amber-600 transition-colors">
                Apply Now
              </button>
              <button className="bg-white rounded-full px-8 py-4 text-yellow-950 text-xl font-bold font-['Urbanist'] hover:bg-gray-100 transition-colors">
                Get Tickets
              </button>
              <button className="px-7 py-4 rounded-full text-amber-500 text-xl font-bold font-['Urbanist'] underline hover:text-amber-400 transition-colors">
                About Mr.Nepal 2025
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventSection;