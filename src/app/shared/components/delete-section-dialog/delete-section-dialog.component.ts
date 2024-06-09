import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmLogoutDialogComponent } from '../confirm-logout-dialog/confirm-logout-dialog.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-section-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-section-dialog.component.html',
  styleUrl: './delete-section-dialog.component.scss'
})
export class DeleteSectionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteSectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}