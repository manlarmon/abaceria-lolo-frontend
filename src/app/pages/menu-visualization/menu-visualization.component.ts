import { Component, OnInit } from '@angular/core';
import { MenuSectionService } from '../../core/services/menu-section.service';
import { TypeOfServingService } from '../../core/services/type-of-serving.service';
import { MenuSection } from '../../core/models/menu-section.model';
import { TypeOfServing } from '../../core/models/type-of-serving.model';
import { AllergenService } from '../../core/services/allergen.service';
import { Allergen } from '../../core/models/allergen.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'menu-visualization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './menu-visualization.component.html',
  styleUrls: ['./menu-visualization.component.scss']
})
export class MenuVisualizationComponent implements OnInit {
  menuSections: MenuSection[] = [];
  typesOfServing: TypeOfServing[] = [];
  allergens: Allergen[] = [];

  constructor(
    private menuSectionService: MenuSectionService,
    private typeOfServingService: TypeOfServingService,
    private allergenService: AllergenService
  ) {}

  ngOnInit(): void {
    this.loadMenuSections();
    this.loadTypesOfServing();
    this.loadAllergens();
  }

  loadMenuSections(): void {
    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data.map(section => ({
          ...section,
          menuProducts: section.menuProducts ?? []
        }));
        this.sortSections();
      },
      error => {
        console.error('Error fetching menu sections', error);
      }
    );
  }

  loadTypesOfServing(): void {
    this.typeOfServingService.getAllTypesOfServing().subscribe(
      (data: TypeOfServing[]) => {
        this.typesOfServing = data;
      },
      error => {
        console.error('Error fetching types of serving', error);
      }
    );
  }

  loadAllergens(): void {
    this.allergenService.getAllAllergens().subscribe(
      (data: Allergen[]) => {
        this.allergens = data;
      },
      error => {
        console.error('Error fetching allergens', error);
      }
    );
  }

  getProductTypesOfServing(prices: any[]): string[] {
    return prices.map(price => {
      const type = this.typesOfServing.find(t => t.typeOfServingId === price.typeOfServingId);
      return type ? `${type.typeOfServingName}: ${price.price} €` : '';
    }).filter(name => name !== '');
  }

  getProductAllergens(allergenMenuProducts: any[]): string {
    return allergenMenuProducts.map(allergenProduct => {
      const allergen = this.allergens.find(a => a.allergenId === allergenProduct.allergenId);
      return allergen ? allergen.abbreviation : '';
    }).filter(name => name !== '').join(', ');
  }

  sortSections(): void {
    this.menuSections.sort((a, b) => a.order - b.order);
    this.menuSections.forEach(section => {
      section.menuProducts?.sort((a, b) => a.order - b.order);
    });
  }
}
