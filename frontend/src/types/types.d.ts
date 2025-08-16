interface EventCardProps {
  title: string,
  slug: string,
  date: string,
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
  name: string,
  coverImage: string,
  images: string[],
  gender: 'Male' | 'Female',
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
  titleImage: string,
  image_1: string,
  image_2: string,
  image_3: string,
  image_4: string,

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