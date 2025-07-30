import Image from "next/image";
import { Button } from "../ui/button";

interface EventCardProps {
  id: string;
  title: string;
  dateSpan: string;
  briefInfo: string;
  imageSrc: string;
  state: 'ongoing' | 'completed';
  columnPosition?: 'left' | 'right';
  timelinePosition?: 'left' | 'right';
  managedBy?: 'self' | 'partner';
  getTicketLink?: string;
  aboutLink?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  dateSpan,
  briefInfo,
  imageSrc,
  state,
  columnPosition = 'left',
  timelinePosition = 'left',
  managedBy = 'self',
  getTicketLink,
  aboutLink
}) => {
  const isTimelineLeft = timelinePosition === 'left';
  const isContentLeft = columnPosition === 'left';
  
  // State styling
  const stateConfig = {
    ongoing: {
      bgColor: 'bg-[#472F00]',
      textColor: 'text-gold-500',
      label: 'Ongoing'
    },
    completed: {
      bgColor: 'bg-green-900',
      textColor: 'text-green-400',
      label: 'Completed'
    }
  };

  const currentState = stateConfig[state];

  return (
    <div className={`relative ${
      isTimelineLeft ? 'pl-16' : 'pr-16'
    }`}>
      {/* Circle Indicator */}
      <div className={`absolute top-1 w-6 h-6 bg-gold-500 rounded-full z-10 ${
        isTimelineLeft ? 'left-6' : 'right-6'
      }`} />

      <div className="bg-background hover:outline-gold-500 outline-2 transition-outline duration-300 outline-transparent group">
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${
          isContentLeft ? '' : 'lg:grid-flow-col-dense'
        }`}>
          {/* Content Section */}
          <div className={`px-16 pt-24 pb-16 space-y-2 ${
            isContentLeft ? '' : 'lg:col-start-2'
          }`}>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${currentState.bgColor} ${currentState.textColor}`}>
              {currentState.label}
            </span>
            
            <h2 className="text-white text-6xl font-newsreader tracking-tighter font-normal">
              {title}
            </h2>
            
            <p className="text-white text-base font-semibold pb-4">
              {dateSpan}
            </p>
            
            <p className="text-white text-base font-light tracking-wider pr-10 mb-4">
              {briefInfo}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Primary Buttons */}
              <div className="flex space-x-4">
                {getTicketLink && (
                  <Button 
                    variant="default" 
                    className="h-10"
                    onClick={() => window.open(getTicketLink, '_blank')}
                  >
                    Get Tickets
                  </Button>
                )}
              </div>
              
              {/* About Button */}
              {aboutLink && (
                <button 
                  className="px-4 py-4 rounded-full text-gold-500 text-base font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  onClick={() => window.open(aboutLink, '_blank')}
                >
                  <span className="underline">About {title}</span>
                  <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400" />
                </button>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className={`relative ${
            isContentLeft 
              ? '[mask:linear-gradient(to_right,transparent_0%,black_20%)]' 
              : '[mask:linear-gradient(to_left,transparent_0%,black_20%)]'
          } ${isContentLeft ? '' : 'lg:col-start-1'}`}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            
            {/* Event Management Badge */}
            <div className={`absolute bottom-0 ${
              isContentLeft ? 'right-6' : 'left-6'
            }`}>
              <div className="bg-[#1E1E1E] rounded-t-2xl px-2.5 py-2.5 text-center">
                <p className="text-white text-base font-light mb-1">
                  Event by:
                </p>
                <div className="border-2 border-yellow-400 rounded p-2">
                  {managedBy === 'self' ? (
                    <Image
                      width={100}
                      height={100}
                      alt="Next Models Nepal Logo"
                      src="/logo.png"
                      className="w-16 h-14"
                    />
                  ) : (
                    <div className="w-16 h-14 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PARTNER</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;