import { Router, RouterStateSnapshot, CanActivateFn, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../services/auth-firebase.service";
import { Injectable, inject } from "@angular/core";

export const AuthGuard: CanActivateFn =
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    
    // Inyectamos los servicios necesarios, no usamos el constructor porque no estamos en una clase.
    const authService =  inject(AuthService);
    const router = inject(Router);

    //Si el usuario no está logueado, lo redirigimos a la página de login
    authService.isUserLoggedIn || router.navigate(['/login']);
    return true;
}