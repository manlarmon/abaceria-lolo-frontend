import { AllergenMenuProduct } from "./allergen-menu-product.model";
import { MenuProductPrice } from "./menu-product-price.model";
export interface MenuProduct {
    menuProductId: number;
    menuProductName: string;
    isVisible: boolean;
    order: number;
    menuSectionId: number;
    menuProductPrices?: MenuProductPrice[];
    allergenMenuProducts?: AllergenMenuProduct[];
  }
  
