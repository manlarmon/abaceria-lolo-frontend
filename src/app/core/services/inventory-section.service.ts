import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventorySection } from '../models/inventory-section.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventorySectionService {

  private apiUrl = `${environment.apiUrl}InventorySection`;

  constructor(private http: HttpClient) { }

  getAllInventorySections(): Observable<InventorySection[]> {
    return this.http.get<InventorySection[]>(this.apiUrl);
  }

  getInventorySectionById(id: number): Observable<InventorySection> {
    return this.http.get<InventorySection>(`${this.apiUrl}/${id}`);
  }

  createInventorySection(inventorySection: InventorySection): Observable<InventorySection> {
    return this.http.post<InventorySection>(this.apiUrl, inventorySection);
  }

  updateInventorySection(inventorySection: InventorySection): Observable<InventorySection> {
    return this.http.put<InventorySection>(`${this.apiUrl}/${inventorySection.inventorySectionId}`, inventorySection);
  }

  deleteInventorySection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
