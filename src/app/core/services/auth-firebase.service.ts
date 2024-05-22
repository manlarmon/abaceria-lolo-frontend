import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAuthProvider, user } from "@angular/fire/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { SnackBarService } from "./snack-bar.service";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  userData: any; // Guarda los datos del usuario logueado 
  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,

    private snackBarService: SnackBarService
  ) {
    // Guarda el usuario en el local storage cuando se loguea y lo settea a null cuando se desloguea
    // AuthState es un observable que se dispara cada vez que el usuario se loguea o desloguea
    this.firebaseAuthenticationService.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.setItem('user', 'null');
      }
    })

  }

  // Registro con Email y Password
  // Devuelve una promesa con el usuario registrado o un error

  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState()
      })
      .catch((error) => {
        this.snackBarService.showError("Registro fallido")
      })
  }

  // Login con Email y Password
  // Devuelve una promesa con el usuario logueado o un error
  // 
  signInWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.snackBarService.showSuccess("Inicio de sesión correcto")
        this.userData = userCredential.user
        this.observeUserState()

      })
      .catch((error) => {
        this.snackBarService.showError("Inicio de sesión fallido")
      })
  }

  // Observa el estado del usuario y redirige a la página de layout si el usuario está logueado
  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['']))
    })
  }

  // Retorna True cuando el usuario está logueado
  // Se pone Get para que se pueda acceder a la propiedad como si fuera un método
  get isUserLoggedIn(): boolean {
    // Si el usuario está logueado, el método getItem() retorna un objeto, de lo contrario retorna null
    const user = JSON.parse(localStorage.getItem('user')!);
    // Si el usuario no es null, retorna true
    return user !== null;

  }

  // LogOut
  logOut() {
    // SignOut() es un método de firebase que desloguea al usuario
    return this.firebaseAuthenticationService.signOut().then(() => {
      // Cuando el usuario se desloguea, se remueve el usuario del local storage y se redirige a la página de login
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    })
  }


}
