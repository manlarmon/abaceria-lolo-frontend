import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { InventoryProduct } from '../../../core/models/inventory-product.model';

@Component({
  selector: 'app-create-edit-product',
  templateUrl: './create-edit-product.component.html',
  standalone: true,
  styleUrls: ['./create-edit-product.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class CreateEditProductComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: InventoryProduct }
  ) {
    this.productForm = this.fb.group({
      productName: [data.product.productName, [Validators.required, Validators.maxLength(100)]],
      quantity: [data.product.quantity, [Validators.required, Validators.min(0)]]
    });
  }

  onSave(): void {
    if (this.productForm.valid) {
      const productData: InventoryProduct = {
        ...this.data.product,
        ...this.productForm.value
      };
      this.dialogRef.close(productData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
