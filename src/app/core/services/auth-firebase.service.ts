import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { SnackBarService } from "./snack-bar.service";
import { UserService } from './user.service';
import { Observable, catchError, map, of } from "rxjs";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private snackBarService: SnackBarService,
    private userService: UserService
  ) {
    this.firebaseAuthenticationService.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
        if (user.email) {
          this.setUserRole(user.email);
        }
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user;
        this.observeUserState();
        this.snackBarService.showSuccess("Registro exitoso");
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          this.snackBarService.showError("El usuario ya está registrado en Firebase.");
        } else {
          this.snackBarService.showError("Registro fallido.");
        }
      });
  }

  signInWithEmailAndPassword(email: string, password: string) {
    this.userService.getUserByEmail(email).subscribe(
      user => {
        if (user && user.enabled) {
          this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              this.snackBarService.showSuccess("Inicio de sesión correcto");
              this.userData = userCredential.user;
              if (this.userData) {
                this.observeUserState();
                this.setUserRole(this.userData.email);
              }
            })
            .catch((error) => {
              this.snackBarService.showError("Inicio de sesión fallido");
            });
        } else {
          this.snackBarService.showError("El email no está registrado en la base de datos o no está habilitado.");
        }
      },
      error => {
        this.snackBarService.showError("Error al verificar el email en la base de datos.");
      }
    );
  }

  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['']));
    });
  }

  get isUserLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      this.router.navigate(['/sign-in']);
    });
  }

  setUserRole(email: string) {
    this.userService.getUserByEmail(email).subscribe(user => {
      localStorage.setItem('isAdmin', user.isAdmin.toString());
    });
  }

  get isAdmin(): boolean {
    return localStorage.getItem('isAdmin') === 'true';
  }

  validateAndSignUp(email: string, password: string) {
    this.userService.getUserByEmail(email).subscribe(
      user => {
        if (user && user.enabled) {
          this.signUpWithEmailAndPassword(email, password).catch(error => {
            this.snackBarService.showError("Registro fallido.");
          });
        } else {
          this.snackBarService.showError("El email no está registrado en la base de datos o no está habilitado.");
        }
      },
      error => {
        this.snackBarService.showError("Error al verificar el email en la base de datos.");
      }
    );
  }

  resetPassword(email: string) {
    return this.firebaseAuthenticationService.sendPasswordResetEmail(email)
      .then(() => {
        this.snackBarService.showSuccess("Se ha enviado un correo para restablecer la contraseña.");
      })
      .catch((error) => {
        this.snackBarService.showError("Error al enviar el correo para restablecer la contraseña.");
      });
  }

  // Add method to check if the user is enabled
  isUserEnabled(email: string): Observable<boolean> {
    return this.userService.getUserByEmail(email).pipe(
      map((user: User) => user.enabled),
      catchError(() => of(false))
    );
  }
}
