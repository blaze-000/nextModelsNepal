type NewsletterSubscriptionProps = {
  onSubmit?: (email: string) => void,
  className?: string,
}

interface EventCardProps {
  title: string,
  slug: string,
  date:string,
  overview: string,
  coverImage: string,
  state: "ongoing" | "ended",
  timelinePosition?: "left" | "right" | false,
  manageBy?: "self" | "partners",
  getTicketLink?: string
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
  date: string,
  overview: string,
  coverImage: string,
  state: "ongoing" | "ended",
  manageBy: "self" | "partners",
  getTicketLink: string,
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
  message: string,
  name: string,
  images: string,
}

interface BreadcrumbProps {
  title: string,
  searchPlaceholder?: string,
  showSearch?: boolean,
  onSearch?: (value: string) => void,
}

interface Model {
  name: string,
  coverImage: string,
  images: string[],
  gender: 'Male' | 'Female' | 'Other',
  address?: string,
  slug?: string,
  intro: string,
  designation?: string,
  tag?: string,
}

interface ModelGridProps {
  models: Model[] | undefined,
  children: (model: Model) => React.ReactNode,
}

interface TimelineProps {
  position?: "left" | "right",
  title?: string,
  children: React.ReactNode,
}

type HeroData = {
  maintitle: string,
  subtitle: string,
  description: string,
  images: string[],
}

type UpcomingEventData = {
  title: string,
  titleImage: string,
  slug: string,
  image: string,
  description: string,
  notice: string[],
  card: {
    cardTitle: string,
    index: string,
    item: { criteriaTitle: string, criteria: string, criteriaIcon: string }[]
  }[],
  notice: string[],
  noticeName: string,
};

type AdminUser = {
  email: string,
  role: 'admin',
}