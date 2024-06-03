import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from "./shared/layout/layout.component";
import { MatButtonModule } from '@angular/material/button';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment.development';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AllergensComponent } from './pages/allergens/allergens.component';
import { SectionsAndProductsComponent } from './pages/sections-and-products/sections-and-products.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from './core/interceptor/loader.interceptor';
import { LoaderService } from './core/services/loader.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { DrawerModeDirective } from './core/directives/drawer-mode.directive';
import { MenuVisualizationComponent } from './pages/menu-visualization/menu-visualization.component';



@NgModule({
    declarations: [
        AppComponent,
        DrawerModeDirective
    ],
    providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
        LoaderService 
    ],
    bootstrap: [AppComponent],
    imports: [
        LayoutComponent,
        LoaderComponent,
        AllergensComponent,
        MenuVisualizationComponent,
        SectionsAndProductsComponent,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatButtonModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
    ]
})
export class AppModule { }
