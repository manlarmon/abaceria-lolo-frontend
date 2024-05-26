import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CreateEditUserComponent } from '../create-edit-user/create-edit-user.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth-firebase.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  adminUser: User | null = null;
  displayedColumns: string[] = ['email', 'userName', 'enabled', 'actions'];
  displayedAdminColumns: string[] = ['email', 'userName'];

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
      this.users = users.filter(user => !user.isAdmin);
      this.adminUser = users.find(user => user.isAdmin) || null;
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
