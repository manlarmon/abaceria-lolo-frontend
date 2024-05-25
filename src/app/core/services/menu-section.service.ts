// menu-section.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuSection } from '../models/menu-section.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuSectionService {

  private apiUrl = `${environment.apiUrl}MenuSection`;

  constructor(private http: HttpClient) { }

  getAllMenuSections(): Observable<MenuSection[]> {
    return this.http.get<MenuSection[]>(this.apiUrl);
  }

  getMenuSectionById(id: number): Observable<MenuSection> {
    return this.http.get<MenuSection>(`${this.apiUrl}/${id}`);
  }

  createMenuSection(menuSection: MenuSection): Observable<MenuSection> {
    return this.http.post<MenuSection>(this.apiUrl, menuSection);
  }

  updateMenuSection(menuSection: MenuSection): Observable<MenuSection> {
    return this.http.put<MenuSection>(`${this.apiUrl}/${menuSection.menuSectionId}`, menuSection);
  }

  deleteMenuSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}