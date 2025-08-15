// // Type definitions for menu items and submenus
// type SubmenuSingleColumn = {
//   columns: 1;
//   items: { label: string; href: string }[];
// };

// type SubmenuTwoColumn = {
//   columns: 2;
//   titles: [string, string];
//   items: [
//     { label: string; href: string }[],
//     { label: string; href: string }[]
//   ];
// };

// type Submenu = SubmenuSingleColumn | SubmenuTwoColumn;

type MenuItem = {
  label: string;
  href?: string;
};

type NavEventType = {
  label: string;
  slug: string;
};