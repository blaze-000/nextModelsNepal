export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const menuItems: MenuSection[] = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "ri-dashboard-line",
        href: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Website",
    items: [
      {
        id: "hero",
        label: "Hero Section",
        icon: "ri-image-line",
        href: "/admin/hero",
      },
      {
        id: "partners",
        label: "Partners",
        icon: "ri-image-line",
        href: "/admin/partners",
      },
      {
        id: "testimonials",
        label: "Testimonials",
        icon: "ri-message-2-line",
        href: "/admin/feedback",
      },
    ],
  },
  {
    title: "Events Management",
    items: [
      {
        id: "events",
        label: "Events",
        icon: "ri-calendar-event-line",
        href: "/admin/events",
      },
      {
        id: "seasons",
        label: "Seasons",
        icon: "ri-timer-line",
        href: "/admin/seasons",
      },
    
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        id: "models",
        label: "Models",
        icon: "ri-user-star-line",
        href: "/admin/models",
      },
      {
        id: "news",
        label: "News",
        icon: "ri-newspaper-line",
        href: "/admin/news",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        id: "applications",
        label: "Applications",
        icon: "ri-file-user-line",
        href: "/admin/applications",
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: "ri-contacts-line",
        href: "/admin/contacts",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        id: "navigation",
        label: "Navigation",
        icon: "ri-navigation-line",
        href: "/admin/navigation",
      },
      {
        id: "settings",
        label: "Site Settings",
        icon: "ri-settings-line",
        href: "/admin/settings",
      },
    ],
  },
];
