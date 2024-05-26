import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth-firebase.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private snackBarService: SnackBarService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.isUserLoggedIn && this.authService.isAdmin) {
            return true;
        } else {
            this.snackBarService.showError('Acceso denegado.');
            this.router.navigate(['']);
            return false;
        }
    }
}
