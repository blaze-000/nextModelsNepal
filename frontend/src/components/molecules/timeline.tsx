import Image from "next/image";

interface TimelineProps {
  position?: 'left' | 'right';
  title?: string;
  children: React.ReactNode;
}

const Timeline: React.FC<TimelineProps> = ({ 
  position = 'left', 
  title = "Events by Next Models Nepal",
  children 
}) => {
  const isLeft = position === 'left';
  
  return (
    <div className="relative">
      {/* Icon positioned absolutely above the vertical line */}
      <div className={`absolute top-0 w-8 h-8 flex items-center justify-center -translate-y-1/2 z-20 ${
        isLeft 
          ? 'left-1.5 -translate-x-1/2' 
          : 'right-1.5 translate-x-1/2'
      }`}>
        <Image
          src="/small_star.svg"
          alt="Timeline Icon"
          width={24}
          height={24}
        />
      </div>

      {/* Title positioned horizontally aligned with the icon */}
      <div className={`absolute top-0 -translate-y-1/2 ${
        isLeft 
          ? 'left-8' 
          : 'right-8 text-right'
      }`}>
        <h3 className="text-white text-2xl font-newsreader font-normal tracking-tight whitespace-nowrap">
          {title}
        </h3>
      </div>

      {/* Vertical Line */}
      <div className={`absolute top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/60 to-transparent ${
        isLeft 
          ? 'left-1.5' 
          : 'right-1.5'
      }`} />

      {/* Event Cards Container */}
      <div className="space-y-12 py-16">
        {children}
      </div>
    </div>
  );
};

export default Timeline;