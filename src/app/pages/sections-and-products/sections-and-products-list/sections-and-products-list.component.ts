import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MenuSectionService } from '../../../core/services/menu-section.service';
import { MenuProductService } from '../../../core/services/menu-product.service';
import { TypeOfServingService } from '../../../core/services/type-of-serving.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MenuSection } from '../../../core/models/menu-section.model';
import { MenuProduct } from '../../../core/models/menu-product.model';
import { TypeOfServing } from '../../../core/models/type-of-serving.model';
import { MenuProductPrice } from '../../../core/models/menu-product-price.model';
import { CreateEditProductComponent } from '../create-edit-product/create-edit-product.component';
import { CreateEditSectionComponent } from '../create-edit-section/create-edit-section.component';
import { AdjustPricesDialogComponent } from '../adjust-prices-dialog/adjust-prices-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'sections-and-products-list',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    CreateEditProductComponent,
    CreateEditSectionComponent,
    MatSlideToggleModule,
    AdjustPricesDialogComponent
  ],
  templateUrl: './sections-and-products-list.component.html',
  styleUrls: ['./sections-and-products-list.component.scss']
})
export class SectionsAndProductsListComponent implements OnInit {
  menuSections: MenuSection[] = [];
  typesOfServing: TypeOfServing[] = [];
  displayedColumns: string[] = [];

  constructor(
    private menuSectionService: MenuSectionService,
    private menuProductService: MenuProductService,
    private typeOfServingService: TypeOfServingService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMenuSections();
    this.loadTypesOfServing();
  }

  loadMenuSections(): void {
    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data.map(section => ({
          ...section,
          menuProducts: section.menuProducts ?? []
        }));
        this.updateDisplayedColumns();
      },
      error => {
        console.error('Error fetching menu sections', error);
        this.snackBarService.showError('Error al cargar las secciones del menú');
      }
    );
  }

  loadTypesOfServing(): void {
    this.typeOfServingService.getAllTypesOfServing().subscribe(
      (data: TypeOfServing[]) => {
        this.typesOfServing = data;
        this.updateDisplayedColumns();
      },
      error => {
        console.error('Error fetching types of serving', error);
        this.snackBarService.showError('Error al cargar los tipos de servicio');
      }
    );
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = ['menuProductName', 'order', 'visibility', ...this.typesOfServing.map(type => type.typeOfServingName), 'actions'];
  }

  onCreateProduct(sectionId: number): void {
    const newProduct: MenuProduct = {
      menuProductId: 0,
      menuSectionId: sectionId,
      menuProductName: '',
      isVisible: true,
      order: 0,
      menuProductPrices: [],
      allergenMenuProducts: []
    };

    const dialogRef = this.dialog.open(CreateEditProductComponent, {
      width: '500px',
      data: { product: newProduct }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuSections();
      }
    });
  }

  onEditProduct(product: MenuProduct): void {
    const dialogRef = this.dialog.open(CreateEditProductComponent, {
      width: '500px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuSections();
      }
    });
  }

  onEditSection(section: MenuSection): void {
    const dialogRef = this.dialog.open(CreateEditSectionComponent, {
      width: '500px',
      data: { section }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMenuSections();
      }
    });
  }

  onCreateSection(): void {
    const newSection: MenuSection = {
      menuSectionId: 0,
      isVisible: true,
      order: 0,
      menuSectionName: '',
      menuProducts: []
    };

    this.onEditSection(newSection);
  }

  onDeleteSection(sectionId: number): void {
    this.menuSectionService.deleteMenuSection(sectionId).subscribe(
      response => {
        this.snackBarService.showSuccess('Sección eliminada con éxito');
        this.loadMenuSections();
      },
      error => {
        console.error('Error deleting section', error);
        this.snackBarService.showError('Error al eliminar la sección');
      }
    );
  }

  onDeleteProduct(productId: number): void {
    this.menuProductService.deleteMenuProduct(productId).subscribe(
      response => {
        this.snackBarService.showSuccess('Producto eliminado con éxito');
        this.loadMenuSections();
      },
      error => {
        console.error('Error deleting product', error);
        this.snackBarService.showError('Error al eliminar el producto');
      }
    );
  }

  getPrice(prices: MenuProductPrice[] | null, typeOfServingId: number): number {
    if (!prices) return 0;
    const priceObj = prices.find(price => price.typeOfServingId === typeOfServingId);
    return priceObj ? priceObj.price : 0;
  }

  updateProductOrder(product: MenuProduct | null, event: Event): void {
    if (!product) return;
    const inputElement = event.target as HTMLInputElement;
    const order = parseInt(inputElement.value, 10);
    product.order = order;
    this.menuProductService.updateMenuProduct(product).subscribe(
      () => {
        this.snackBarService.showSuccess('Orden actualizado con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar el orden');
        console.error('Error updating order', error);
      }
    );
  }

  toggleVisibility(product: MenuProduct | null): void {
    if (!product) return;
    product.isVisible = !product.isVisible;
    this.menuProductService.updateMenuProduct(product).subscribe(
      () => {
        this.snackBarService.showSuccess('Visibilidad actualizada con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar la visibilidad');
        console.error('Error updating visibility', error);
      }
    );
  }

  updateSectionOrder(section: MenuSection | null, event: Event): void {
    if (!section) return;
    const inputElement = event.target as HTMLInputElement;
    const order = parseInt(inputElement.value, 10);
    section.order = order;
    this.menuSectionService.updateMenuSection(section).subscribe(
      () => {
        this.snackBarService.showSuccess('Orden de sección actualizado con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar el orden de la sección');
        console.error('Error updating section order', error);
      }
    );
  }

  toggleSectionVisibility(section: MenuSection | null): void {
    if (!section) return;
    section.isVisible = !section.isVisible;
    this.menuSectionService.updateMenuSection(section).subscribe(
      () => {
        this.snackBarService.showSuccess('Visibilidad de la sección actualizada con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar la visibilidad de la sección');
        console.error('Error updating section visibility', error);
      }
    );
  }

  openAdjustPricesDialog(menuSection: MenuSection): void {
    const dialogRef = this.dialog.open(AdjustPricesDialogComponent, {
      width: '400px',
      data: { sectionId: menuSection.menuSectionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log('Adjusting prices with value:', result); // Log the adjustment value
        this.menuSectionService.adjustPricesForSection(menuSection.menuSectionId, result).subscribe(
          () => {
            this.snackBarService.showSuccess('Precios ajustados con éxito');
            this.loadMenuSections();
          },
          error => {
            this.snackBarService.showError('Error al ajustar los precios');
            console.error('Error adjusting prices', error);
          }
        );
      }
    });
  }
}
