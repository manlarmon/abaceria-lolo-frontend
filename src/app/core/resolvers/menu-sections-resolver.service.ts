import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuSectionService } from '../services/menu-section.service';
import { MenuSection } from '../models/menu-section.model';

@Injectable({
  providedIn: 'root'
})
export class MenuSectionsResolver implements Resolve<Observable<MenuSection[]>> {

  constructor(private menuSectionService: MenuSectionService) {}

  resolve(): Observable<MenuSection[]> {
    return this.menuSectionService.getAllMenuSections();
  }
}
