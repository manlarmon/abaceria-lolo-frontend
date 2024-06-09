import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryProduct } from '../models/inventory-product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryProductService {

  private apiUrl = `${environment.apiUrl}InventoryProduct`;

  constructor(private http: HttpClient) { }

  getAllInventoryProducts(): Observable<InventoryProduct[]> {
    return this.http.get<InventoryProduct[]>(this.apiUrl);
  }

  getInventoryProductById(id: number): Observable<InventoryProduct> {
    return this.http.get<InventoryProduct>(`${this.apiUrl}/${id}`);
  }

  createInventoryProduct(inventoryProduct: InventoryProduct): Observable<InventoryProduct> {
    return this.http.post<InventoryProduct>(this.apiUrl, inventoryProduct);
  }

  updateInventoryProduct(inventoryProduct: InventoryProduct): Observable<InventoryProduct> {
    return this.http.put<InventoryProduct>(`${this.apiUrl}/${inventoryProduct.inventoryProductId}`, inventoryProduct);
  }

  deleteInventoryProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
