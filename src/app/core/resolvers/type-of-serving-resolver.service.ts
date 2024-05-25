import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeOfServingService } from '../services/type-of-serving.service';
import { TypeOfServing } from '../models/type-of-serving.model';

@Injectable({
  providedIn: 'root'
})
export class TypeOfServingResolver implements Resolve<Observable<TypeOfServing[]>> {

  constructor(private typeOfServingService: TypeOfServingService) {}

  resolve(): Observable<TypeOfServing[]> {
    return this.typeOfServingService.getAllTypesOfServing();
  }
}
