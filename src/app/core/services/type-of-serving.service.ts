import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeOfServing } from '../models/type-of-serving.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeOfServingService {
  private apiUrl = `${environment.apiUrl}TypeOfServing`; 

  constructor(private http: HttpClient) { }

  getAllTypesOfServing(): Observable<TypeOfServing[]> {
    return this.http.get<TypeOfServing[]>(this.apiUrl);
  }

  getTypeOfServingById(id: number): Observable<TypeOfServing> {
    return this.http.get<TypeOfServing>(`${this.apiUrl}/${id}`);
  }

  createTypeOfServing(typeOfServing: TypeOfServing): Observable<TypeOfServing> {
    return this.http.post<TypeOfServing>(this.apiUrl, typeOfServing);
  }

  updateTypeOfServing(typeOfServing: TypeOfServing): Observable<TypeOfServing> {
    return this.http.put<TypeOfServing>(`${this.apiUrl}/${typeOfServing.typeOfServingId}`, typeOfServing);
  }

  deleteTypeOfServing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}