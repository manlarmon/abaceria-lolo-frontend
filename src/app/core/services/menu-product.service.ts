// menu-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuProduct } from '../models/menu-product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuProductService {
  private apiUrl = `${environment.apiUrl}MenuProduct`;

  constructor(private http: HttpClient) {}

  getAllMenuProducts(): Observable<MenuProduct[]> {
    return this.http.get<MenuProduct[]>(this.apiUrl);
  }

  getMenuProductById(id: number): Observable<MenuProduct> {
    return this.http.get<MenuProduct>(`${this.apiUrl}/${id}`);
  }

  createMenuProduct(menuProduct: MenuProduct): Observable<MenuProduct> {
    return this.http.post<MenuProduct>(this.apiUrl, menuProduct);
  }

  updateMenuProduct(menuProduct: MenuProduct): Observable<MenuProduct> {
    return this.http.put<MenuProduct>(this.apiUrl, menuProduct);
  }

  deleteMenuProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
