import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MenuProductService } from '../../../core/services/menu-product.service';
import { AllergenService } from '../../../core/services/allergen.service';
import { TypeOfServingService } from '../../../core/services/type-of-serving.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MenuProduct } from '../../../core/models/menu-product.model';
import { Allergen } from '../../../core/models/allergen.model';
import { TypeOfServing } from '../../../core/models/type-of-serving.model';
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
  prices: { typeOfServingId: number; price: number }[] = [];
  selectedAllergens: number[] = [];

  constructor(
    private fb: FormBuilder,
    private menuProductService: MenuProductService,
    private allergenService: AllergenService,
    private typeOfServingService: TypeOfServingService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CreateEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: MenuProduct }
  ) {
    this.productForm = this.fb.group({
      menuProductName: ['', [Validators.required, Validators.maxLength(50)]],
      allergens: [[]],
      prices: [[]],
      isVisible: [data.product.isVisible ?? true]  // Asegura que el nuevo producto sea visible por defecto
    });
  }

  ngOnInit(): void {
    this.loadAllergens();
    this.loadTypesOfServing();

    if (this.data.product) {
      this.productForm.patchValue(this.data.product);
      this.selectedAllergens = this.data.product.allergenMenuProducts?.map(a => a.allergenId) || [];
      this.prices = this.data.product.menuProductPrices?.map(price => ({
        typeOfServingId: price.typeOfServingId,
        price: price.price
      })) || [];
      this.productForm.patchValue({ allergens: this.selectedAllergens });
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

  getPriceValue(typeOfServingId: number): number | null {
    const price = this.prices.find(p => p.typeOfServingId === typeOfServingId);
    return price ? price.price : null;
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
      this.prices.push({ typeOfServingId, price: priceValue });
    }
  }

  onSave(): void {
    if (this.productForm.valid) {
      const productData: MenuProduct = {
        ...this.data.product,
        ...this.productForm.value,
        menuProductPrices: this.prices.map(price => ({
          menuProductPriceId: 0,  // Asigna un valor por defecto si es un nuevo precio
          menuProductId: this.data.product.menuProductId,
          typeOfServingId: price.typeOfServingId,
          price: price.price,
          typeOfServing: null
        })),
        allergenMenuProducts: this.productForm.value.allergens.map((allergenId: number) => ({ allergenId, menuProductId: this.data.product.menuProductId }))
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
