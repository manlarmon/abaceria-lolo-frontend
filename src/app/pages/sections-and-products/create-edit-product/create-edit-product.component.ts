import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MenuProductService } from '../../../core/services/menu-product.service';
import { AllergenService } from '../../../core/services/allergen.service';
import { MenuProductPriceService } from '../../../core/services/menu-product-price.service';
import { TypeOfServingService } from '../../../core/services/type-of-serving.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MenuProduct } from '../../../core/models/menu-product.model';
import { Allergen } from '../../../core/models/allergen.model';
import { TypeOfServing } from '../../../core/models/type-of-serving.model';
import { MenuProductPrice } from '../../../core/models/menu-product-price.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-create-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule
  ],
  templateUrl: './create-edit-product.component.html',
  styleUrls: ['./create-edit-product.component.scss']
})
export class CreateEditProductComponent implements OnInit {
  productForm: FormGroup;
  allergens: Allergen[] = [];
  typesOfServing: TypeOfServing[] = [];
  prices: MenuProductPrice[] = [];
  selectedAllergens: number[] = [];

  constructor(
    private fb: FormBuilder,
    private menuProductService: MenuProductService,
    private allergenService: AllergenService,
    private menuProductPriceService: MenuProductPriceService,
    private typeOfServingService: TypeOfServingService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CreateEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: MenuProduct }
  ) {
    this.productForm = this.fb.group({
      menuProductName: ['', [Validators.required, Validators.maxLength(50)]],
      allergens: [[]],
      prices: [[]]
    });
  }

  ngOnInit(): void {
    this.loadAllergens();
    this.loadTypesOfServing();

    if (this.data.product) {
      this.productForm.patchValue(this.data.product);
      this.selectedAllergens = this.data.product.allergenMenuProducts?.map(a => a.allergenId) || [];
      this.prices = this.data.product.menuProductPrices || [];
    }
  }

  loadAllergens(): void {
    this.allergenService.getAllAllergens().subscribe(allergens => {
      this.allergens = allergens;
    });
  }

  loadTypesOfServing(): void {
    this.typeOfServingService.getAllTypesOfServing().subscribe(typesOfServing => {
      this.typesOfServing = typesOfServing;
    });
  }

  getPriceValue(typeOfServingId: number): number {
    const price = this.prices.find(p => p.typeOfServingId === typeOfServingId);
    return price ? price.price : 0;
  }

  updatePrice(typeOfServingId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const priceValue = parseFloat(inputElement.value);
    if (isNaN(priceValue)) {
      return;
    }

    const existingPrice = this.prices.find(p => p.typeOfServingId === typeOfServingId);
    if (existingPrice) {
      existingPrice.price = priceValue;
    } else {
      const typeOfServing = this.typesOfServing.find(type => type.typeOfServingId === typeOfServingId);
      this.prices.push({ 
        menuProductPriceId: 0, 
        menuProductId: this.data.product.menuProductId, 
        typeOfServingId, 
        price: priceValue,
        typeOfServing: typeOfServing! // This assumes typeOfServing is not null or undefined
      });
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      const productData: MenuProduct = {
        ...this.data.product,
        ...this.productForm.value,
        menuProductPrices: this.prices,
        allergenMenuProducts: this.selectedAllergens.map(allergenId => ({ allergenId, menuProductId: this.data.product.menuProductId }))
      };

      if (productData.menuProductId) {
        this.menuProductService.updateMenuProduct(productData).subscribe(
          () => {
            this.snackBarService.showSuccess('Producto actualizado con éxito');
            this.dialogRef.close(true);
          },
          error => {
            this.snackBarService.showError('Error al actualizar el producto');
          }
        );
      } else {
        this.menuProductService.createMenuProduct(productData).subscribe(
          () => {
            this.snackBarService.showSuccess('Producto creado con éxito');
            this.dialogRef.close(true);
          },
          error => {
            this.snackBarService.showError('Error al crear el producto');
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
