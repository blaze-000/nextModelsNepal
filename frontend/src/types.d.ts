type NewsletterSubscriptionProps = {
    onSubmit?: (email: string) => void;
    className?: string;
}

type MenuItems = Array<{
    id: number;
    label: string;
    href: string;
    submenu?: Array<{ id: number; label: string; href: string }>;
}>;

// types/EventCard.ts (or within the component file)
type EventCardProps = {
    id: string; // Unique identifier for the card
    picPosition: 'left' | 'right'; // Controls image and info layout
    state: 'ongoing' | 'ended'; // Event status
    managedBy: 'self' | 'partners'; // Who manages the event
    title: string;
    dateSpan: string;
    briefInfo: string;
    imageSrc: string;
    partnerLogoSrc?: string; // Optional: Only for 'partners' managedBy
    getTicketsLink?: string; // Optional: Link for tickets if ongoing
    aboutLink?: string; // Optional: Link for 'About'
}