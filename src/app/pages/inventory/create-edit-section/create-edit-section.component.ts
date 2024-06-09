import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { InventorySection } from '../../../core/models/inventory-section.model';

@Component({
  selector: 'app-create-edit-section',
  templateUrl: './create-edit-section.component.html',
  standalone: true,
  styleUrls: ['./create-edit-section.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class CreateEditSectionComponent {
  sectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { section: InventorySection }
  ) {
    this.sectionForm = this.fb.group({
      sectionName: [data.section.sectionName, [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSave(): void {
    if (this.sectionForm.valid) {
      const sectionData: InventorySection = {
        ...this.data.section,
        ...this.sectionForm.value
      };
      this.dialogRef.close(sectionData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
