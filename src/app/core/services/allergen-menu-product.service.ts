import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllergenMenuProduct } from '../models/allergen-menu-product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllergenMenuProductService {
  private apiUrl = `${environment.apiUrl}AllergenMenuProduct`;

  constructor(private http: HttpClient) {}

  getAllAllergenMenuProducts(): Observable<AllergenMenuProduct[]> {
    return this.http.get<AllergenMenuProduct[]>(this.apiUrl);
  }

  getAllergenMenuProductById(id: number): Observable<AllergenMenuProduct> {
    return this.http.get<AllergenMenuProduct>(`${this.apiUrl}/${id}`);
  }

  createAllergenMenuProduct(allergenMenuProduct: AllergenMenuProduct): Observable<AllergenMenuProduct> {
    return this.http.post<AllergenMenuProduct>(this.apiUrl, allergenMenuProduct);
  }

  updateAllergenMenuProduct(allergenMenuProduct: AllergenMenuProduct): Observable<AllergenMenuProduct> {
    return this.http.put<AllergenMenuProduct>(`${this.apiUrl}/${allergenMenuProduct.allergenMenuProductId}`, allergenMenuProduct);
  }

  deleteAllergenMenuProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
