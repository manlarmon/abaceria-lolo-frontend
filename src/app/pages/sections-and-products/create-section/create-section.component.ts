import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuSectionService } from '../../../core/services/menu-section.service';
import { MenuSection } from '../../../core/models/menu-section.model';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'create-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.scss']
})
export class CreateSectionComponent implements OnInit {
  @Output() sectionCreated = new EventEmitter<void>();
  sectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private menuSectionService: MenuSectionService,
    private snackBarService: SnackBarService
  ) {
    this.sectionForm = this.fb.group({
      menuSectionName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.sectionForm.valid) {
      const newSection: MenuSection = {
        ...this.sectionForm.value,
        isVisible: true,
        order: 0,
        menuSectionId: 0
      };

      this.menuSectionService.createMenuSection(newSection).subscribe(
        response => {
          this.snackBarService.showSuccess('Sección creada con éxito');
          this.sectionForm.reset();
          this.sectionCreated.emit();
        },
        error => {
          console.error('Error creating section', error);
          this.snackBarService.showError('Error al crear la sección');
        }
      );
    }
  }
}
