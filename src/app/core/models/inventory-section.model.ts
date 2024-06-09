import { InventoryProduct } from './inventory-product.model';

export interface InventorySection {
  inventorySectionId: number;
  sectionName: string;
  isActive: boolean;
  inventoryProducts?: InventoryProduct[];
}
