interface SubmenuItem {
  label: string,
  href: string,
}

interface SubmenuBase {
  columns: 1 | 2,
}

interface SubmenuSingleColumn extends SubmenuBase {
  columns: 1,
  items: SubmenuItem[],
}

interface SubmenuTwoColumn extends SubmenuBase {
  columns: 2,
  titles?: string[],
  items: SubmenuItem[][],
}

type Submenu = SubmenuSingleColumn | SubmenuTwoColumn;

interface MenuItem {
  id: number,
  label: string,
  href: string,
  submenu?: Submenu,
}
