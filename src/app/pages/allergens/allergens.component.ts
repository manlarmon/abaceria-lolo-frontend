import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllergenService } from '../../core/services/allergen.service';
import { Allergen } from '../../core/models/allergen.model';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-allergen-management',
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
  templateUrl: './allergens.component.html',
  styleUrls: ['./allergens.component.scss']
})
export class AllergensComponent implements OnInit {
  allergens: Allergen[] = [];
  allergenForm: FormGroup;
  editMode = false;
  currentAllergenId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private allergenService: AllergenService,
    private snackBarService: SnackBarService
  ) {
    this.allergenForm = this.fb.group({
      abbreviation: ['', [Validators.required, Validators.maxLength(3)]],
      allergenName: ['', [Validators.required, Validators.maxLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadAllergens();
  }

  loadAllergens(): void {
    this.allergenService.getAllAllergens().subscribe(
      (data: Allergen[]) => {
        this.allergens = data;
      },
      error => {
        console.error('Error fetching allergens', error);
        this.snackBarService.showError('Error al cargar los alérgenos');
      }
    );
  }

  onSubmit(): void {
    if (this.allergenForm.valid) {
      // Se crea un objeto Allergen con los valores del formulario con ...
      const allergen: Allergen = { ...this.allergenForm.value, allergenId: this.currentAllergenId || 0 };

      if (this.editMode && this.currentAllergenId !== null) {
        this.allergenService.updateAllergen(allergen).subscribe(
          response => {
            this.snackBarService.showSuccess('Alérgeno actualizado con éxito');
            this.loadAllergens();
            this.resetForm();
          },
          error => {
            console.error('Error updating allergen', error);
            this.snackBarService.showError('Error al actualizar el alérgeno');
          }
        );
      } else {
        this.allergenService.createAllergen(allergen).subscribe(
          response => {
            this.snackBarService.showSuccess('Alérgeno creado con éxito');
            this.loadAllergens();
            this.resetForm();
          },
          error => {
            console.error('Error creating allergen', error);
            this.snackBarService.showError('Error al crear el alérgeno');
          }
        );
      }
    }
  }

  onEdit(allergen: Allergen): void {
    this.editMode = true;
    this.currentAllergenId = allergen.allergenId;
    this.allergenForm.patchValue({
      abbreviation: allergen.abbreviation,
      allergenName: allergen.allergenName
    });
  }

  onDelete(id: number): void {
    this.allergenService.deleteAllergen(id).subscribe(
      response => {
        this.snackBarService.showSuccess('Alérgeno eliminado con éxito');
        this.loadAllergens();
      },
      error => {
        console.error('Error deleting allergen', error);
        this.snackBarService.showError('Error al eliminar el alérgeno');
      }
    );
  }

  resetForm(): void {
    this.allergenForm.reset();
    this.editMode = false;
    this.currentAllergenId = null;
  }
}
