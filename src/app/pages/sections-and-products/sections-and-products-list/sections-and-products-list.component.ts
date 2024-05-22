import { Component, OnInit } from '@angular/core';
import { MenuSectionService } from '../../../core/services/menu-section.service';
import { MenuProductService } from '../../../core/services/menu-product.service';
import { MenuSection } from '../../../core/models/menu-section.model';
import { MenuProduct } from '../../../core/models/menu-product.model';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'sections-and-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule
  ],
  templateUrl: './sections-and-products-list.component.html',
  styleUrl: './sections-and-products-list.component.scss'
})
export class SectionsAndProductsListComponent implements OnInit {
  menuSections: MenuSection[] = [];
  productForm: FormGroup;

  constructor(
    private menuSectionService: MenuSectionService,
    private menuProductService: MenuProductService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      menuProductName: ['', [Validators.required, Validators.maxLength(50)]],
      menuSectionId: ['']
    });
  }

  ngOnInit(): void {
    this.loadMenuSections();
  }

  loadMenuSections(): void {
    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data.map(section => ({
          ...section,
          menuProducts: section.menuProducts ?? []
        }));
      },
      error => {
        console.error('Error fetching menu sections', error);
        this.snackBarService.showError('Error al cargar las secciones del menú');
      }
    );
  }

  onCreateProduct(sectionId: number): void {
    if (this.productForm.valid) {
      const newProduct: MenuProduct = {
        ...this.productForm.value,
        menuSectionId: sectionId,
        isVisible: true,
        order: 0,
        menuProductId: 0
      };

      this.menuProductService.createMenuProduct(newProduct).subscribe(
        response => {
          this.snackBarService.showSuccess('Producto creado con éxito');
          this.productForm.reset();
          this.loadMenuSections();
        },
        error => {
          console.error('Error creating product', error);
          this.snackBarService.showError('Error al crear el producto');
        }
      );
    }
  }

  onDeleteSection(sectionId: number): void {
    this.menuSectionService.deleteMenuSection(sectionId).subscribe(
      response => {
        this.snackBarService.showSuccess('Sección eliminada con éxito');
        this.loadMenuSections();
      },
      error => {
        console.error('Error deleting section', error);
        this.snackBarService.showError('Error al eliminar la sección');
      }
    );
  }

  onDeleteProduct(productId: number): void {
    this.menuProductService.deleteMenuProduct(productId).subscribe(
      response => {
        this.snackBarService.showSuccess('Producto eliminado con éxito');
        this.loadMenuSections();
      },
      error => {
        console.error('Error deleting product', error);
        this.snackBarService.showError('Error al eliminar el producto');
      }
    );
  }
}