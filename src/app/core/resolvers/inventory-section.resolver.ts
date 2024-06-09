import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { InventorySection } from '../models/inventory-section.model';
import { InventorySectionService } from '../services/inventory-section.service';

@Injectable({
  providedIn: 'root'
})
export class InventorySectionResolver implements Resolve<InventorySection[]> {

  constructor(private sectionService: InventorySectionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InventorySection[]> {
    return this.sectionService.getAllInventorySections();
  }
}
