import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-adjust-prices-dialog',
  templateUrl: './adjust-prices-dialog.component.html',
  styleUrls: ['./adjust-prices-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class AdjustPricesDialogComponent {
  adjustPricesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdjustPricesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sectionId: number }
  ) {
    this.adjustPricesForm = this.fb.group({
      adjustment: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  onAdjustPrices(increment: boolean): void {
    if (this.adjustPricesForm.valid) {
      const adjustment = this.adjustPricesForm.value.adjustment;
      const finalAdjustment = increment ? adjustment : -adjustment;
      this.dialogRef.close(finalAdjustment);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
