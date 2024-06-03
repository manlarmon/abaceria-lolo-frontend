import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuSectionService } from '../../core/services/menu-section.service';
import { MenuSection } from '../../core/models/menu-section.model';
import { MenuProductService } from '../../core/services/menu-product.service';
import { MenuProduct } from '../../core/models/menu-product.model';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SectionsAndProductsListComponent } from './sections-and-products-list/sections-and-products-list.component';
import { ActivatedRoute } from '@angular/router';
import { CreateEditProductComponent } from './create-edit-product/create-edit-product.component';
import { CreateEditSectionComponent } from './create-edit-section/create-edit-section.component';

@Component({
  selector: 'sections-and-products',
  standalone: true,
  imports: [
    CreateEditSectionComponent,
    SectionsAndProductsListComponent,
    MatTableModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatExpansionModule,
    MatSidenavModule,
    MatDialogModule,
  ],
  templateUrl: './sections-and-products.component.html',
  styleUrls: ['./sections-and-products.component.scss']
})
export class SectionsAndProductsComponent implements OnInit {
  menuSections: MenuSection[] = [];
  productForm: FormGroup;

  @ViewChild('drawer') drawer: MatDrawer | undefined;

  constructor(
    private route: ActivatedRoute,
    private menuSectionService: MenuSectionService,
    private menuProductService: MenuProductService,
    private snackBarService: SnackBarService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.productForm = this.fb.group({
      menuProductName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.menuSections = this.route.snapshot.data['menuSections'] || [];
  }

  loadMenuSections(): void {
    this.menuSectionService.getAllMenuSections().subscribe(
      (data: MenuSection[]) => {
        this.menuSections = data;
      },
      error => {
        console.error('Error fetching menu sections', error);
        this.snackBarService.showError('Error al cargar las secciones del menú');
      }
    );
  }

}
