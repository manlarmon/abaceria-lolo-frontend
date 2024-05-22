import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule } from '@angular/forms';
import { MenuSectionService } from '../../core/services/menu-section.service';
import { MenuSection } from '../../core/models/menu-section.model';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateSectionComponent } from './create-section/create-section.component';
import { SectionsAndProductsListComponent } from './sections-and-products-list/sections-and-products-list.component';

@Component({
  selector: 'sections-and-products',
  standalone: true,
  imports: [
    CreateSectionComponent,
    SectionsAndProductsListComponent,
    MatTableModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './sections-and-products.component.html',
  styleUrls: ['./sections-and-products.component.scss']
})
export class SectionsAndProductsComponent implements OnInit {
  menuSections: MenuSection[] = [];


  constructor(
    private menuSectionService: MenuSectionService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.loadMenuSections();
  }

  loadMenuSections(): void {
    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data;
      },
      error => {
        console.error('Error fetching menu sections', error);
        this.snackBarService.showError('Error al cargar las secciones del menú');
      }
    );
  }
}
