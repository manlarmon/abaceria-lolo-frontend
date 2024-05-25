import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MenuSectionService } from '../../../core/services/menu-section.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MenuSection } from '../../../core/models/menu-section.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'create-edit-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatError,
    MatLabel,
    MatOptionModule
  ],
  templateUrl: './create-edit-section.component.html',
  styleUrls: ['./create-edit-section.component.scss']
})
export class CreateEditSectionComponent implements OnInit {
  sectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private menuSectionService: MenuSectionService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CreateEditSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { section: MenuSection }
  ) {
    this.sectionForm = this.fb.group({
      menuSectionName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    if (this.data.section) {
      this.sectionForm.patchValue(this.data.section);
    }
  }

  onSave(): void {
    if (this.sectionForm.valid) {
      const sectionData: MenuSection = {
        ...this.data.section,
        ...this.sectionForm.value,
        isVisible: this.data.section?.isVisible ?? true,
        order: this.data.section?.order ?? 0
      };

      if (sectionData.menuSectionId) {
        this.menuSectionService.updateMenuSection(sectionData).subscribe(
          () => {
            this.snackBarService.showSuccess('Sección actualizada con éxito');
            this.dialogRef.close(true);
          },
          error => {
            this.snackBarService.showError('Error al actualizar la sección');
          }
        );
      } else {
        this.menuSectionService.createMenuSection(sectionData).subscribe(
          () => {
            this.snackBarService.showSuccess('Sección creada con éxito');
            this.dialogRef.close(true);
          },
          error => {
            this.snackBarService.showError('Error al crear la sección');
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
