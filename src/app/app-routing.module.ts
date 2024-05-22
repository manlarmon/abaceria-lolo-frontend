import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { SectionsAndProductsComponent } from './pages/sections-and-products/sections-and-products.component';
import { AllergensComponent } from './pages/allergens/allergens.component';
import { TypeOfServingComponent } from './pages/type-of-serving/type-of-serving.component';

const routes: Routes = [

  {
    path: "",
    redirectTo: "sections-and-products",
    pathMatch: "full"
  },

  {
    path: "login",
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
    
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "sections-and-products",
        component: SectionsAndProductsComponent, // Usar component en lugar de loadChildren
      },
      {
        path: "allergens",
        component: AllergensComponent,
      },
      {
        path: "type-of-serving",
        component: TypeOfServingComponent,
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
