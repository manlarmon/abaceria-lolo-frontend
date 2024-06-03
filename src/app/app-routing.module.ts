import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { SectionsAndProductsComponent } from './pages/sections-and-products/sections-and-products.component';
import { AllergensComponent } from './pages/allergens/allergens.component';
import { TypeOfServingComponent } from './pages/type-of-serving/type-of-serving.component';
import { UsersComponent } from './pages/users/users.component';
import { UserResolver } from './core/resolvers/user.resolver';
import { MenuSectionsResolver } from './core/resolvers/menu-sections.resolver';
import { AllergensResolver } from './core/resolvers/allergens.resolver';
import { TypeOfServingResolver } from './core/resolvers/type-of-serving.resolver';
import { AdminGuard } from './core/guards/admin.guard';
import { MenuVisualizationComponent } from './pages/menu-visualization/menu-visualization.component';
const routes: Routes = [
  {
    path: "",
    redirectTo: "sections-and-products",
    pathMatch: "full"
  },
  {
    path: "sign-in",
    loadComponent: () => import('./pages/login/sign-in/sign-in.component').then(m => m.SignInComponent)
  },
  {
    path: "sign-up",
    loadComponent: () => import('./pages/login/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: "forgotten-password",
    loadComponent: () => import('./pages/login/forgotten-password/forgotten-password.component').then(m => m.ForgottenPasswordComponent)
  },
  {
    path: "",
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      {
        path: "sections-and-products",
        canActivate: [AuthGuard],
        component: SectionsAndProductsComponent,
        resolve: {
          menuSections: MenuSectionsResolver
        }
      },
      {
        path: "allergens",
        canActivate: [AuthGuard],
        component: AllergensComponent,
        resolve: {
          allergens: AllergensResolver
        }
      },
      {
        path: "type-of-serving",
        canActivate: [AuthGuard],
        component: TypeOfServingComponent,
        resolve: {
          typesOfServing: TypeOfServingResolver
        }
      },
      {
        path: "user",
        canActivate: [AuthGuard, AdminGuard],
        component: UsersComponent,
        resolve: {
          users: UserResolver
        }
      },
      {
        path: "menu-visualization",
        canActivate: [AuthGuard],
        component: MenuVisualizationComponent,
        resolve: {
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
