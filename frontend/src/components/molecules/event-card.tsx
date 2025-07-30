// components/EventCard.tsx
import type { FC } from 'react';
import Image from 'next/image'; // For optimized images in Next.js

const EventCard: FC<EventCardProps> = ({
  id,
  picPosition,
  state,
  managedBy,
  title,
  dateSpan,
  briefInfo,
  imageSrc,
  partnerLogoSrc,
  getTicketsLink,
  aboutLink,
}) => {
  const isOngoing = state === 'ongoing';
  const isPicLeft = picPosition === 'left';

  return (
    <div
      id={id}
      className={`
        flex
        ${isPicLeft ? 'flex-row' : 'flex-row-reverse'}
        bg-black text-white rounded-lg overflow-hidden
        shadow-lg hover:shadow-xl transition-shadow duration-300
        border border-gray-800
      `}
      style={{
        // Optional: Custom width or max-width if needed, otherwise it will stretch to container
        // maxWidth: '1000px',
        // width: '100%',
      }}
    >
      {/* Image Container */}
      <div className="relative flex-1 group overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${title} Image`}
          layout="fill" // Ensures image fills the container
          objectFit="cover" // Covers the container, cropping as needed
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      {/* Info Container */}
      <div className="flex-1 p-6 flex flex-col justify-center">
        {/* Status */}
        <div
          className={`
            text-sm font-bold uppercase mb-2
            ${isOngoing ? 'text-yellow-400' : 'text-gray-400'}
          `}
        >
          {state}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-serif mb-2">{title}</h2>

        {/* Date Span */}
        <p className="text-sm text-gray-300 mb-4">{dateSpan}</p>

        {/* Brief Info */}
        <p className="text-base leading-relaxed mb-6">{briefInfo}</p>

        {/* Actions (Get Tickets / About Link) */}
        <div className="flex items-center gap-4 mb-4 mt-auto">
          {isOngoing && getTicketsLink && (
            <a
              href={getTicketsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-black py-2 px-5 rounded-md font-semibold hover:bg-yellow-500 transition-colors duration-200"
            >
              Get Tickets
            </a>
          )}
          {aboutLink && (
            <a
              href={aboutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-400 font-semibold transition-colors duration-200"
            >
              About {title} <span className="ml-1">&#8599;</span>
            </a>
          )}
        </div>

        {/* Managed By */}
        {managedBy === 'partners' && partnerLogoSrc && (
          <div className="flex items-center mt-4 text-sm text-gray-300">
            <span className="mr-2">Event by:</span>
            <div className="relative w-16 h-8"> {/* Adjust size as needed */}
              <Image
                src={partnerLogoSrc}
                alt="Partner Logo"
                layout="fill"
                objectFit="contain"
                className="filter invert" // Adjust if your logo is dark and needs to be lightened
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;