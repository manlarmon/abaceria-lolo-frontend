import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AllergenService } from '../services/allergen.service';
import { Allergen } from '../models/allergen.model';

@Injectable({
  providedIn: 'root'
})
export class AllergensResolver implements Resolve<Observable<Allergen[]>> {

  constructor(private allergenService: AllergenService) { }

  resolve(): Observable<Allergen[]> {
    return this.allergenService.getAllAllergens();
  }
}
