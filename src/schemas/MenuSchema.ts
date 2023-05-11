export interface MenuTreeItemSchema {
  id: number;
  key: string;
  pairKey: string;
  name: string;
  children?: MenuTreeItemSchema[];
}

export interface MenuTreeSchema {
  menus: MenuTreeItemSchema[];
}
