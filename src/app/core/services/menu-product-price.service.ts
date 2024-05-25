import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuProductPrice } from '../models/menu-product-price.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuProductPriceService {
  private apiUrl = `${environment.apiUrl}MenuProductPrice`;

  constructor(private http: HttpClient) { }

  getAllMenuProductPrices(): Observable<MenuProductPrice[]> {
    return this.http.get<MenuProductPrice[]>(this.apiUrl);
  }

  getMenuProductPriceById(id: number): Observable<MenuProductPrice> {
    return this.http.get<MenuProductPrice>(`${this.apiUrl}/${id}`);
  }

  createMenuProductPrice(menuProductPrice: MenuProductPrice): Observable<MenuProductPrice> {
    return this.http.post<MenuProductPrice>(this.apiUrl, menuProductPrice);
  }

  updateMenuProductPrice(menuProductPrice: MenuProductPrice): Observable<MenuProductPrice> {
    return this.http.put<MenuProductPrice>(`${this.apiUrl}/${menuProductPrice.menuProductPriceId}`, menuProductPrice);
  }

  deleteMenuProductPrice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}