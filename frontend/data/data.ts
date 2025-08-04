export const menuItems: MenuItem[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Events",
    href: "/events",
    submenu: {
      columns: 2,
      titles: ["Our Events", "Managed Events"],
      items: [
        [
          { label: "Model Hunt Nepal", href: "/events/model-hunt-nepal" },
          { label: "Mister Nepal", href: "/events/mister-nepal" },
          { label: "Miss Nepal Peace", href: "/events/miss-nepal-peace" },
        ],
        [
          {
            label: "Kathmandu Fashion Week",
            href: "/events/kathmandu-fashion-week",
          },
          {
            label: "IEC Designers Runway",
            href: "/events/iec-designers-runway",
          },
        ],
      ],
    },
  },
  {
    id: 3,
    label: "Events Central",
    href: "/events",
    submenu: {
      columns: 1,
      items: [
        { label: "Upcoming Events", href: "/event-details/upcoming" },
        { label: "Past Events & Winners", href: "/event-details/past-winners" },
        { label: "Events Highlights Gallery", href: "/event-details/gallery" },
        { label: "Press & Media Coverage", href: "/event-details/media" },
      ],
    },
  },
  {
    id: 4,
    label: "Voting",
    href: "/voting",
  },
  {
    id: 5,
    label: "About Us",
    href: "/about",
  },
  {
    id: 6,
    label: "Contact Us",
    href: "/contact",
  },
];
