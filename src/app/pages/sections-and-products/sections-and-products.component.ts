import { Component, OnInit } from '@angular/core';
import { MenuSectionService } from '../../core/services/menu-section.service';
import { MenuSection } from '../../core/models/menu-section.model';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../core/services/snackbar.service';



@Component({
  selector: 'sections-and-products',
  standalone: true,
  imports: [MatTableModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './sections-and-products.component.html',
  styleUrl: './sections-and-products.component.scss'
})
export class SectionsAndProductsComponent implements OnInit {
  menuSections: MenuSection[] = [];
  menuSectionsMock: String[] = ["Entrantes fríos", "Entrantes calientes", "Ensaladas", "Carnes", "Pescados", "Postres"];

  sectionForm!: FormGroup;

  displayedColumns: string[] = ['menuSectionName', 'products'];

  constructor(
    private menuSectionService: MenuSectionService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService

  ) { }

  ngOnInit(): void {

    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data;
        console.log('Menu sections', this.menuSections);
      },
      error => {
        console.error('Error fetching menu sections', error);
      }
    );

    this.sectionForm = this.fb.group({
      order: ['0'],
      menuSectionName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  onSubmit(): void {
    if (this.sectionForm.valid) {
      const newSection: MenuSection = {
        menuSectionId: 0, // Esto será asignado por el backend
        ...this.sectionForm.value
      };

      this.menuSectionService.createMenuSection(newSection).subscribe(
        response => {
          console.log('Section created successfully', response);
          this.snackBarService.showSuccess('Sección creada con éxito');
          this.sectionForm.reset();
        },
        error => {
          console.error('Error creating section', error);
          this.snackBarService.showError('Error al crear la sección');
        }
      );
    }
  }
}
