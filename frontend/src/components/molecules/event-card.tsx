import Image from "next/image";
import { Button } from "../ui/button";
import type { FC } from "react";

const EventCard: FC<EventCardProps> = ({
  title,
  startDate,
  endDate,
  briefInfo,
  imageSrc,
  state,
  getTicketLink,
  aboutLink,
  managedBy = "self",
  timelinePosition = false,
}) => {
  const isTimelineLeft = timelinePosition === "left";
  const isContentLeft = isTimelineLeft;

  const dateSpan = `${startDate} to ${endDate}`;

  const stateConfig = {
    bgColor: "bg-[#472F00]",
    textColor: "text-gold-500",
    label: state === "ongoing" ? "Ongoing" : `Ended on ${endDate}`,
  };

  return (
    <div
      className={
        timelinePosition
          ? `relative ${isTimelineLeft ? "pl-12 md:pl-16" : "pr-12 md:pr-16"}`
          : ""
      }
    >
      {/* Timeline circle */}
      {timelinePosition && (
        <div
          className={`absolute top-1 w-4 h-4 md:w-6 md:h-6 bg-gold-500 rounded-full z-10 ${isTimelineLeft ? "left-5 md:left-6" : "right-5 md:right-6"
            }`}
        />
      )}

      <div className="bg-background hover:outline-gold-500 outline-2 transition-outline duration-300 outline-transparent group">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="relative h-48 [mask:linear-gradient(to_top,transparent_0%,black_20%)]">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
            />
            <div className="absolute bottom-6 left-4">
              <span
                className={`inline-block px-5 py-2 rounded-full text-xs font-bold ${stateConfig.bgColor} ${stateConfig.textColor}`}
              >
                {stateConfig.label}
              </span>
            </div>
          </div>

          <div className="px-5 md:px-6 py-8 md:pt-12 md:pb-8 space-y-2">
            <h2 className="text-white text-3xl font-newsreader tracking-tighter font-normal">
              {title}
            </h2>
            <p className="text-white text-xs font-semibold pb-3">{dateSpan}</p>
            <p className="text-white text-sm font-light tracking-wider pr-4 mb-4 line-clamp-2">
              {briefInfo}
            </p>

            <div className="flex flex-row items-center gap-3">
              {state !== "ended" && getTicketLink && (
                <Button
                  variant="default"
                  className="h-8 text-sm"
                  onClick={() => window.open(getTicketLink, "_blank")}
                >
                  Get Tickets
                </Button>
              )}
              {aboutLink && (
                <button
                  className="px-3 py-3 rounded-full text-gold-500 text-sm font-semibold group hover:text-white transition-colors flex items-center md:gap-1 cursor-pointer"
                  onClick={() => window.open(aboutLink, "_blank")}
                >
                  <span className="md:underline">About</span>
                  <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400 text-xl font-light" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div
          className={`hidden lg:grid grid-cols-2 ${isContentLeft ? "" : "grid-flow-col-dense"
            }`}
        >
          {/* Content */}
          <div
            className={`px-16 pt-24 pb-16 space-y-2 ${isContentLeft ? "" : "col-start-2"
              }`}
          >
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-4 ${stateConfig.bgColor} ${stateConfig.textColor}`}
            >
              {stateConfig.label}
            </span>
            <h2 className="text-white text-6xl font-newsreader tracking-tighter font-normal">
              {title}
            </h2>
            <p className="text-white text-base font-semibold pb-4">{dateSpan}</p>
            <p className="text-white text-base font-light tracking-wider pr-10 mb-4">
              {briefInfo}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {state !== "ended" && getTicketLink && (
                <Button
                  variant="default"
                  className="h-10 text-base"
                  onClick={() => window.open(getTicketLink, "_blank")}
                >
                  Get Tickets
                </Button>
              )}
              {aboutLink && (
                <button
                  className="px-4 py-4 rounded-full text-gold-500 text-base font-semibold group hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  onClick={() => window.open(aboutLink, "_blank")}
                >
                  <span className="underline underline-offset-4">About {title}</span>
                  <i className="ri-arrow-right-up-line group-hover:scale-130 transition-transform duration-400" />
                </button>
              )}
            </div>
          </div>

          {/* Image */}
          <div
            className={`relative h-auto ${isContentLeft ? "" : "col-start-1"
              } ${isContentLeft
                ? "[mask:linear-gradient(to_right,transparent_0%,black_30%)]"
                : "[mask:linear-gradient(to_left,transparent_0%,black_30%)]"
              }`}
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
            <div className={`${managedBy === "self" ? "absolute" : "hidden"} bottom-0 ${isContentLeft ? "right-6" : "left-6"}`}>
              <div className="bg-[#1E1E1E] rounded-t-2xl px-2.5 py-2.5 text-center">
                <p className="text-white text-base font-light mb-1">Event by:</p>
                <div className="border-2 border-yellow-400 rounded p-2">
                  {managedBy === "self" ? (
                    <Image
                      width={60}
                      height={50}
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
    </div >
  );
};

export default EventCard;
