import Image from "next/image";

const Timeline: React.FC<TimelineProps> = ({
  position = "left",
  title = "Events by Next Models Nepal",
  children,
}) => {
  const isLeft = position === "left";

  return (
    <div className="relative ">
      {/* Icon positioned absolutely above the vertical line */}
      <div
        className={`absolute top-0 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center -translate-y-1/2 z-20 ${
          isLeft
            ? "left-2 md:left-1.5 -translate-x-1/2"
            : "right-2 md:right-1.5 translate-x-1/2"
        }`}
      >
        <Image
          src="/svg-icons/small_star.svg"
          alt="Timeline Icon"
          width={24}
          height={24}
          className="md:w-10 md:h-10"
        />
      </div>

      {/* Title positioned horizontally aligned with the icon */}
      <div
        className={`absolute top-0 -translate-y-1/2 ${
          isLeft ? "left-8 md:left-8" : "right-8 md:right-8 text-right"
        }`}
      >
        <h3 id={`${title==="Events by Next Models Nepal"?"ongoing-events":""}`} className="text-white text-xl md:text-2xl font-newsreader font-medium tracking-tight whitespace-nowrap">
          {title}
        </h3>
      </div>

      {/* Vertical Line */}
      <div
        className={`absolute top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent ${
          isLeft ? "left-2 md:left-1.5" : "right-2 md:right-1.5"
        }`}
      ></div>

      {/* Event Cards Container */}
      <div className="space-y-20 md:space-y-24 py-8">
        {children}
        </div>
    </div>
  );
};

export default Timeline;
