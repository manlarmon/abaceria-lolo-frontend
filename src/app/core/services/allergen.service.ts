// allergen.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Allergen } from '../models/allergen.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllergenService {
    
  private apiUrl = `${environment.apiUrl}Allergen`;
  constructor(private http: HttpClient) {}

  getAllAllergens(): Observable<Allergen[]> {
    return this.http.get<Allergen[]>(this.apiUrl);
  }

  getAllergenById(id: number): Observable<Allergen> {
    return this.http.get<Allergen>(`${this.apiUrl}/${id}`);
  }

  createAllergen(allergen: Allergen): Observable<Allergen> {
    return this.http.post<Allergen>(this.apiUrl, allergen);
  }

  updateAllergen(allergen: Allergen): Observable<Allergen> {
    return this.http.put<Allergen>(this.apiUrl, allergen);
  }

  deleteAllergen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
