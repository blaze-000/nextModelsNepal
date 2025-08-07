type NewsletterSubscriptionProps = {
  onSubmit?: (email: string) => void,
  className?: string,
}

interface EventCardProps {
  title: string,
  slug: string,
  startDate: string,
  endDate: string,
  briefInfo: string,
  imageSrc: string,
  state: "ongoing" | "ended",
  timelinePosition?: "left" | "right" | false,
  managedBy?: "self" | "partner",
  getTicketLink?: string,
  aboutLink?: string,
}

type ImageBoxProps = {
  image: string,
  title: string,
  desc: string,
  link: string,
  buttonText: string
}

type EventType = {
  id: string,
  title: string,
  slug: string,
  startDate: string,
  endDate: string,
  briefInfo: string,
  imageSrc: string,
  state: "ongoing" | "ended",
  managedBy: "self" | "partner",
  getTicketLink: stringstring,
  aboutLink: stringstring,
}

type LoopPoint = { target: () => number; index: number };


type Partner = {
  name: string,
  image: string,
};

type PartnerScrollerProps = {
  partners: Partner[],
  speed?: number, // px/sec
};


interface Testimonial {
  quote: string,
  name: string,
  image: string,
}

interface BreadcrumbProps {
  title: string,
  searchPlaceholder?: string,
  showSearch?: boolean,
  onSearch?: (value: string) => void,
}

interface Model {
  name: string,
  image: string,
  location?: string,
  slug?: string,
  designation?: string,
  tag?: string,
}

interface ModelGridProps {
  models: Model[],
  children: (model: Model) => React.ReactNode,
}

interface TimelineProps {
  position?: "left" | "right",
  title?: string,
  children: React.ReactNode,
}