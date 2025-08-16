// Hero Section Types
export interface Hero {
  _id: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  titleImage: string;
}

// Navigation Types
export interface Navigation {
  _id: string;
  title: string;
  link: string;
  order: number;
}

// Events Types
export interface Event {
  _id: string;
  name: string;
  overview: string;
  coverImage: string;
  titleImage: string;
  subImage: string;
  logo: string;
  highlight: string[];
  sponsersImage: string[];
  startingTimelineIcon: string;
  midTimelineIcon: string;
  endTimelineIcon: string;
  tag?: string;
  date?: string;
  purpose?: string;
  eventDescription?: string;
  startingTimelineDate?: string;
  startingTimelineEvent?: string;
  midTimelineDate?: string;
  midTimelineEvent?: string;
  endTimelineDate?: string;
  endTimelineEvent?: string;
  sponsers?: string;
}

// Next Events Types
export interface NextEventCard {
  cardTitle: string;
  item: {
    criteriaTitle: string;
    criteria: string;
    criteriaIcon: string;
  }[];
}

export interface NextEvent {
  _id: string;
  tag: string;
  title: string;
  titleImage: string;
  image: string;
  description: string;
  noticeName: string;
  notice: string[];
  card: NextEventCard[];
}

// Models Types
export interface CompanyModel {
  _id: string;
  name: string;
  intro: string;
  address: string;
  order: string;
  gender: string;
  slug: string;
  coverImage: string;
  images: string[];
}

// Members Types
export interface Member {
  _id: string;
  name: string;
  participants: string;
  bio: string;
  event: string;
  icon: string;
  images: string[];
}

// Career Types
export interface Career {
  _id: string;
  maintitle: string;
  subtitle: string;
  description: string;
  link: string;
  images: string[];
}

// Feedback Types
export interface FeedbackItem {
  _id: string;
  order: number;
  name: string;
  message: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

// Feedback Form Data Types
export interface FeedbackFormData {
  order?: number;
  name: string;
  message: string;
  image: File[];
}

// Partners Types
export interface Partner {
  _id: string;
  sponserName: string;
  sponserImage: string;
}

// News Types
export interface News {
  _id: string;
  title: string;
  description: string;
  link: string;
  type: "Interview" | "Feature" | "Announcement";
  year: string;
  image: string;
  event?: string | { _id: string; name: string }; // Optional event reference or populated event
}

// Contact Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

// Hire Model Types
export interface HireModel {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  event: string;
  model: string;
  createdAt: string;
}

// Application Form Types
export interface Application {
  _id: string;
  images: string[];
  name: string;
  phone: string;
  country: string;
  city: string;
  ethnicity: string;
  email: string;
  age: string;
  languages: string[];
  gender: "Male" | "Female";
  occupation: string;
  parentsName: string;
  parentsMobile: string;
  permanentAddress: string;
  dressSize?: string;
  shoeSize?: string;
  hairColor?: string;
  eyeColor?: string;
  auditionPlace?: string;
  weight?: number;
  parentsOccupation?: string;
  temporaryAddress?: string;
  hobbies?: string;
  talents?: string;
  hearedFrom?: string;
  additionalMessage?: string;
  createdAt: string;
}

// Form Data Types for Creating/Updating
export interface HeroFormData {
  images: File[];
  titleImage: File | null;
}

export interface NavigationFormData {
  title: string;
  link: string;
  order: number;
}

export interface ModelFormData {
  name: string;
  intro: string;
  address: string;
  gender: string;
  slug: string;
  order: string;
  coverImage: File[];
  galleryImages: File[];
}

export interface NewsFormData {
  title: string;
  description: string;
  link: string;
  type: "Interview" | "Feature" | "Announcement";
  year: string;
  image: File | null;
  event: string; // Event reference (empty string if no event)
}

export interface PartnerFormData {
  sponserName: string;
  sponserImage: File | null;
}

export interface EventFormData {
  title: string;
  overview: string;
  coverImage: File | null;
  titleImage: File | null;
  subImage: File | null;
  logo: File | null;
  highlight: File[];
  sponsersImage: File[];
  startingTimelineIcon: File | null;
  midTimelineIcon: File | null;
  endTimelineIcon: File | null;
  tag?: string;
  date?: string;
  purpose?: string;
  eventDescription?: string;
  startingTimelineDate?: string;
  startingTimelineEvent?: string;
  midTimelineDate?: string;
  midTimelineEvent?: string;
  endTimelineDate?: string;
  endTimelineEvent?: string;
  sponsers?: string;
}

// Popup Props Types
export interface ModelsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  model: CompanyModel | null;
  onSuccess: () => void;
}

// Statistics Types
export interface ModelStatistics {
  total: number;
  male: number;
  female: number;
}
