import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeOfServingService } from '../../core/services/type-of-serving.service';
import { TypeOfServing } from '../../core/models/type-of-serving.model';
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
  selector: 'type-of-serving',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
  ],  templateUrl: './type-of-serving.component.html',
  styleUrl: './type-of-serving.component.scss'
})
export class TypeOfServingComponent implements OnInit {
  typeOfServings: TypeOfServing[] = [];
  typeOfServingForm: FormGroup;
  editMode = false;
  currentTypeOfServingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private typeOfServingService: TypeOfServingService,
    private snackBarService: SnackBarService
  ) {
    this.typeOfServingForm = this.fb.group({
      typeOfServingName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.loadTypeOfServings();
  }

  loadTypeOfServings(): void {
    this.typeOfServingService.getAllTypesOfServing().subscribe(
      (data: TypeOfServing[]) => {
        this.typeOfServings = data;
      },
      error => {
        console.error('Error fetching types of serving', error);
        this.snackBarService.showError('Error al cargar los tipos de servicio');
      }
    );
  }

  onSubmit(): void {
    if (this.typeOfServingForm.valid) {
      const typeOfServing: TypeOfServing = { ...this.typeOfServingForm.value, typeOfServingId: this.currentTypeOfServingId || 0 };

      if (this.editMode && this.currentTypeOfServingId !== null) {
        this.typeOfServingService.updateTypeOfServing(typeOfServing).subscribe(
          response => {
            this.snackBarService.showSuccess('Tipo de servicio actualizado con éxito');
            this.loadTypeOfServings();
            this.resetForm();
          },
          error => {
            console.error('Error updating type of serving', error);
            this.snackBarService.showError('Error al actualizar el tipo de servicio');
          }
        );
      } else {
        this.typeOfServingService.createTypeOfServing(typeOfServing).subscribe(
          response => {
            this.snackBarService.showSuccess('Tipo de servicio creado con éxito');
            this.loadTypeOfServings();
            this.resetForm();
          },
          error => {
            console.error('Error creating type of serving', error);
            this.snackBarService.showError('Error al crear el tipo de servicio');
          }
        );
      }
    }
  }

  onEdit(typeOfServing: TypeOfServing): void {
    this.editMode = true;
    this.currentTypeOfServingId = typeOfServing.typeOfServingId;
    this.typeOfServingForm.patchValue({
      typeOfServingName: typeOfServing.typeOfServingName
    });
  }

  onDelete(id: number): void {
    this.typeOfServingService.deleteTypeOfServing(id).subscribe(
      response => {
        this.snackBarService.showSuccess('Tipo de servicio eliminado con éxito');
        this.loadTypeOfServings();
      },
      error => {
        console.error('Error deleting type of serving', error);
        this.snackBarService.showError('Error al eliminar el tipo de servicio');
      }
    );
  }

  resetForm(): void {
    this.typeOfServingForm.reset();
    this.editMode = false;
    this.currentTypeOfServingId = null;
  }
}