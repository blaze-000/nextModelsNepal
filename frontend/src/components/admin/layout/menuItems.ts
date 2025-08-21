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
        id: "social",
        label: "Social Section",
        icon: "ri-share-line",
        href: "/admin/social",
      },
      {
        id: "nav",
        label: "Navbar Settings",
        icon: "ri-file-list-3-line",
        href: "/admin/nav",
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
    title: "User Management",
    items: [
      {
        id: "applications",
        label: "Applications",
        icon: "ri-file-user-line",
        href: "/admin/applications",
      },
      {
        id: "hiringRequest",
        label: "Hiring Requests",
        icon: "ri-bar-chart-line",
        href: "/admin/hire-requests",
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: "ri-contacts-line",
        href: "/admin/contacts",
      },
      {
        id: "newsletter",
        label: "Newsletter",
        icon: "ri-mail-line",
        href: "/admin/newsletter",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        id: "changePw",
        label: "Change Password",
        icon: "ri-settings-line",
        href: "/admin/change-pw",
      }
    ],
  },
];
