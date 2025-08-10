export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
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
        id: "feedback",
        label: "Feedback",
        icon: "ri-message-2-line",
        href: "/admin/feedback",
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
        id: "events",
        label: "Events",
        icon: "ri-calendar-event-line",
        href: "/admin/events",
      },
      {
        id: "news",
        label: "News",
        icon: "ri-newspaper-line",
        href: "/admin/news",
      },
      {
        id: "careers",
        label: "Careers",
        icon: "ri-briefcase-line",
        href: "/admin/careers",
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
        badge: 12,
      },
      {
        id: "members",
        label: "Members",
        icon: "ri-team-line",
        href: "/admin/members",
      },
      {
        id: "contacts",
        label: "Contacts",
        icon: "ri-contacts-line",
        href: "/admin/contacts",
        badge: 5,
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
