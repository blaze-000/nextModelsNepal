interface EventCardProps {
  title: string,
  slug: string,
  date: string,
  overview: string,
  coverImage: string,
  state: "ongoing" | "ended",
  timelinePosition?: "left" | "right" | false,
  manageBy?: "self" | "partner",
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
  manageBy: "self" | "partner",
  getTicketLink: string,
}

type LoopPoint = { target: () => number; index: number };


type Partner = {
  sponserImage: string,
  sponserName: string,
};

type PartnerScrollerProps = {
  partners: Partner[],
  speed?: number, // px/sec
};


interface Testimonial {
  message: string,
  name: string,
  image: string,
  order: number,
}

interface BreadcrumbProps {
  title: string,
  searchPlaceholder?: string,
  showSearch?: boolean,
  onSearch?: (value: string) => void,
}

interface Model {
  _id: string,
  name: string,
  coverImage: string,
  images: string[],
  gender: 'Male' | 'Female',
  address: string,
  slug: string,
  intro: string,
}

interface ModelGridProps {
  models: Model[] | undefined,
  children: (model: Model) => React.ReactNode,
}

interface Winner {
  _id: string,
  seasonId: string,
  rank: string,
  name: string,
  image: string,
  rank: string,
  slug?: string,
}

interface WinnerGridProps {
  winners: Winner[] | undefined,
  children: (winner: Winner) => React.ReactNode,
}

interface Jury {
  _id: string,
  name: string,
  image: string,
  designation: string,
}

interface JuryGridProps {
  winners: Jury[] | undefined,
  children: (winner: Jury) => React.ReactNode,
}

interface TimelineProps {
  position?: "left" | "right",
  title?: string,
  children: React.ReactNode,
}

type HeroData = {
  titleImage: string,
  image_1: string,
  image_2: string,
  image_3: string,
  image_4: string,
}

type UpcomingEventData = {
  image: string,
  posterImage: string,
  year: string,
  description: string,
  notice: string[],
  eventId: { name: string, },
  criteria: {
    _id: string,
    label: string,
    icon: string,
    value: string,
  }[],
  auditions: { date: string, place: string }[],
  notice: string[],
  noticeName: string,
};

type AdminUser = {
  email: string,
  role: 'admin',
}

type AuthContextType = {
  user: AdminUser | null;
  setUser: React.Dispatch<React.SetStateAction<AdminUser | null>>;
  loading: boolean;
  logout: () => void;
  refreshAuth: () => void;
}

type NewsItem = {
  _id: string,
  title: string,
  description: string,
  link: string,
  type: "Interview" | "Feature" | "Announcement",
  year: string,
  image: string,
  event: string | null,
}

type TimelineEvent = {
  eventName: string,
  overview: string,
  coverImage: string,
  managedBy: "self" | "partner",
  season: {
    status: "ongoing" | "ended",
    startDate: string,
    endDate: string,
    getTicketLink?: string,
    slug: string,
  }
}

type SeasonDetails = {
  _id: string,
  eventId: {
    name: string,
    overview: string,
    titleImage: string,
    coverImage: string,
    subtitle: string,
    quote: string,
    purpose: string,
    purposeImage: string,
    timelineSubtitle: string,
    managedBy: "self" | "partner",
  },
  year: number,
  image: string,
  // status: "ongoing" | "ended",
  startDate: string,
  votingOpened: boolean,
  endDate: string,
  slug: string,
  gallery: string[],
  notice: string[],
  timeline: {
    label: string,
    datespan: string,
    icon: string,
    _id: string,
  }[]
  getTicketLink: string,
  winners: Winner[],
  jury: Jury[],
  sponsors: { _id: string, seasonId: string, image: string }[],
}