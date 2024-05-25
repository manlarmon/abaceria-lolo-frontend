import { Allergen } from "./allergen.model";
import { MenuProduct } from "./menu-product.model";

export interface AllergenMenuProduct {
    allergenMenuProductId: number;
    allergenId: number;
    menuProductId: number;
    allergen: Allergen;
    menuProduct: MenuProduct;
  }
  