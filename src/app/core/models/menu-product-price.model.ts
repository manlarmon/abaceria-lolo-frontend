import { TypeOfServing } from "./type-of-serving.model";

export interface MenuProductPrice {
    menuProductPriceId: number;
    menuProductId: number;
    typeOfServingId: number;
    price: number;
    typeOfServing: TypeOfServing;
  }
  