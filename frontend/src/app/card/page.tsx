import React from 'react';
import EventCard from '@/components/molecules/event-card'; // Assuming this path is correct
// import { EventCardProps } from '@/types/EventCard'; // Assuming your EventCardProps interface is here

export default function Page() {
  // Define the props for your EventCard explicitly using the interface
  const missNepalPeaceCardProps: EventCardProps = {
    id: 'miss-nepal-peace-card-1', // A unique ID is required
    title: 'Miss Nepal Peace',
    dateSpan: '19th July to 6th September', // Changed from dateRange to dateSpan
    briefInfo: 'Miss Nepal Peace is a pageant for nurses, celebrating their role in care and peace while empowering them to represent Nepal on global stages.', // Changed from description to briefInfo
    imageSrc: '/news_1.jpg', // Changed from imageUrl to imageSrc
    state: 'ongoing', // Changed from status to state
    picPosition: 'left', // Changed from imagePosition to picPosition
    managedBy: 'self', // Add 'self' or 'partners'
    getTicketsLink: 'https://example.com/get-tickets', // Add a link if 'ongoing'
    aboutLink: 'https://example.com/about-miss-nepal-peace', // Add an about link
    // partnerLogoSrc: '/path/to/partner-logo.png', // Optional: if managedBy is 'partners'
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 p-4">
      <EventCard {...missNepalPeaceCardProps} />
    </div>
  );
}