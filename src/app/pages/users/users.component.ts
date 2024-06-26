import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth-firebase.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'users',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    UserListComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['email', 'userName', 'isAdmin', 'enabled', 'actions'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin) {
      this.router.navigate(['sections-and-products']);
      return;
    } else {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  onCreateUser(): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '500px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  onEditUser(user: User): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  onDeleteUser(user: User): void {
    this.userService.deleteUser(user.userId).subscribe(() => {
      this.snackBarService.showSuccess('Usuario eliminado con éxito');
      this.loadUsers();
    });
  }

  toggleUserStatus(user: User): void {
    user.enabled = !user.enabled;
    this.userService.updateUser(user).subscribe(() => {
      this.snackBarService.showSuccess('Estado del usuario actualizado con éxito');
      this.loadUsers();
    });
  }
}