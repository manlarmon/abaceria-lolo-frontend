import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
    private apiUrl = `${environment.apiUrl}Pdf`;

  constructor(private http: HttpClient) {}

  downloadInventoryPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/inventory`, { responseType: 'blob' });
  }
}
