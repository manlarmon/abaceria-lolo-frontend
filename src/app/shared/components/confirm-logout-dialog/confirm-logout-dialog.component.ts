import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-logout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
  <h2 mat-dialog-title>Confirmar cerrar sesión</h2>
  <mat-dialog-content>
    <p>¿Estás seguro de que deseas cerrar esta sesión?</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="onCancel()">Cancelar</button>
    <button mat-raised-button color="warn" (click)="onConfirm()">Cerrar sesión</button>
  </mat-dialog-actions>
`,
})
export class ConfirmLogoutDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
