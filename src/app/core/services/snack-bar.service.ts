import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  showError(message: string) {
    this.openSnackBar(message, "error");
  }

  showWarning(message: string) {
    this.openSnackBar(message, "warning");
  }

  showSuccess(message: string) {
    this.openSnackBar(message, "success");
  }

  showInfo(message: string) {
    this.openSnackBar(message, "info");
  }
  
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.open(message, "Cerrar", {
      horizontalPosition: "center",
      verticalPosition: "top",
      duration: 4000,
      panelClass: `snack-bar-${panelClass}`
    });
  }
}
