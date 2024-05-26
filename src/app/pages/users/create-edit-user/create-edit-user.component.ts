import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatError,
    MatButtonModule
  ],
  templateUrl: './create-edit-user.component.html',
  styleUrl: './create-edit-user.component.scss'
})
export class CreateEditUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBarService: SnackBarService,
    public dialogRef: MatDialogRef<CreateEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.isEditMode = !!data.user;
    this.userForm = this.fb.group({
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      userName: [data.user?.userName || '', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      ...this.data.user,
      ...this.userForm.value
    };

    if (this.isEditMode) {
      this.userService.updateUser(user).subscribe(() => {
        this.snackBarService.showSuccess('Usuario actualizado con éxito');
        this.dialogRef.close(true);
      }, () => {
        this.snackBarService.showError('Error al actualizar el usuario');
      });
    } else {
      this.userService.getUserByEmail(user.email).subscribe(existingUser => {
        if (existingUser) {
          this.snackBarService.showError('El email ya está registrado en la base de datos');
        } else {
          this.userService.createUser(user).subscribe(() => {
            this.snackBarService.showSuccess('Usuario creado con éxito');
            this.dialogRef.close(true);
          }, () => {
            this.snackBarService.showError('Error al crear el usuario');
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
