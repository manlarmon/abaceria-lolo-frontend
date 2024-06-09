import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InventorySectionService } from '../../core/services/inventory-section.service';
import { InventoryProductService } from '../../core/services/inventory-product.service';
import { InventorySection } from '../../core/models/inventory-section.model';
import { InventoryProduct } from '../../core/models/inventory-product.model';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { CreateEditSectionComponent } from './create-edit-section/create-edit-section.component';
import { CreateEditProductComponent } from './create-edit-product/create-edit-product.component';
import { DeleteSectionDialogComponent } from '../../shared/components/delete-section-dialog/delete-section-dialog.component';
import { DeleteProductDialogComponent } from '../sections-and-products/delete-product-dialog/delete-product-dialog.component';
import { HttpClient } from '@angular/common/http';
import { PdfService } from '../../core/services/pdf.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    CreateEditSectionComponent,
    CreateEditProductComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventorySections: InventorySection[] = [];
  displayedColumns: string[] = ['productName', 'quantity', 'actions'];

  constructor(
    private inventorySectionService: InventorySectionService,
    private inventoryProductService: InventoryProductService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private http: HttpClient,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.loadInventorySections();
  }

  loadInventorySections(): void {
    this.inventorySectionService.getAllInventorySections().subscribe(
      (data: InventorySection[]) => {
        this.inventorySections = data.map(section => ({
          ...section,
          inventoryProducts: section.inventoryProducts ?? []
        }));
      },
      error => {
        console.error('Error fetching inventory sections', error);
        this.snackBarService.showError('Error al cargar las secciones del inventario');
      }
    );
  }
  onCreateSection(): void {
    const newSection: InventorySection = {
      inventorySectionId: 0,
      sectionName: '',
      isActive: true,
      inventoryProducts: []
    };
  
    const dialogRef = this.dialog.open(CreateEditSectionComponent, {
      width: '500px',
      data: { section: newSection }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventorySectionService.createInventorySection(result).subscribe(
          () => {
            this.snackBarService.showSuccess('Sección creada con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error creating section', error);
            this.snackBarService.showError('Error al crear la sección');
          }
        );
      }
    });
  }
  

  onEditSection(section: InventorySection): void {
    const dialogRef = this.dialog.open(CreateEditSectionComponent, {
      width: '500px',
      data: { section }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventorySectionService.updateInventorySection(result).subscribe(
          () => {
            this.snackBarService.showSuccess('Sección actualizada con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error updating section', error);
            this.snackBarService.showError('Error al actualizar la sección');
          }
        );
      }
    });
  }
  

  onDeleteSection(sectionId: number): void {
    const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventorySectionService.deleteInventorySection(sectionId).subscribe(
          () => {
            this.snackBarService.showSuccess('Sección eliminada con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error deleting section', error);
            this.snackBarService.showError('Error al eliminar la sección');
          }
        );
      }
    });
  }

  onCreateProduct(sectionId: number): void {
    const newProduct: InventoryProduct = {
      inventoryProductId: 0,
      inventorySectionId: sectionId,
      productName: '',
      quantity: 0
    };
  
    const dialogRef = this.dialog.open(CreateEditProductComponent, {
      width: '500px',
      data: { product: newProduct }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryProductService.createInventoryProduct(result).subscribe(
          () => {
            this.snackBarService.showSuccess('Producto creado con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error creating product', error);
            this.snackBarService.showError('Error al crear el producto');
          }
        );
      }
    });
  }
  

  onEditProduct(product: InventoryProduct): void {
    const dialogRef = this.dialog.open(CreateEditProductComponent, {
      width: '500px',
      data: { product }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryProductService.updateInventoryProduct(result).subscribe(
          () => {
            this.snackBarService.showSuccess('Producto actualizado con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error updating product', error);
            this.snackBarService.showError('Error al actualizar el producto');
          }
        );
      }
    });
  }
  

  onDeleteProduct(productId: number): void {
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryProductService.deleteInventoryProduct(productId).subscribe(
          () => {
            this.snackBarService.showSuccess('Producto eliminado con éxito');
            this.loadInventorySections();
          },
          error => {
            console.error('Error deleting product', error);
            this.snackBarService.showError('Error al eliminar el producto');
          }
        );
      }
    });
  }

  updateProductQuantity(product: InventoryProduct, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    product.quantity = parseInt(inputElement.value, 10);

    this.inventoryProductService.updateInventoryProduct(product).subscribe(
      () => {
        this.snackBarService.showSuccess('Cantidad actualizada con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar la cantidad');
        console.error('Error updating quantity', error);
      }
    );
  }


  toggleSectionVisibility(section: InventorySection): void {
    section.isActive = !section.isActive;

    this.inventorySectionService.updateInventorySection(section).subscribe(
      () => {
        this.snackBarService.showSuccess('Visibilidad de la sección actualizada con éxito');
      },
      error => {
        this.snackBarService.showError('Error al actualizar la visibilidad de la sección');
        console.error('Error updating section visibility', error);
      }
    );
  }

  downloadPdf(): void {
    this.pdfService.downloadInventoryPdf().subscribe((response: Blob) => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Inventory.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading the PDF', error);
      this.snackBarService.showError('Error al descargar el PDF');
    });
  }
}
