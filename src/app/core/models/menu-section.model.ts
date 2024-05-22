import { MenuProduct } from "./menu-product.model";

export interface MenuSection {
  menuSectionId: number;
  isVisible: boolean;
  order: number;
  menuSectionName: string;
  menuProducts?: MenuProduct[];
}

