import { MenuProduct } from "./menu-product.model";

export interface MenuSection {
    menuSectionId: number;
    order: number;
    menuSectionName: string;
    menuProducts?: MenuProduct[];
  }