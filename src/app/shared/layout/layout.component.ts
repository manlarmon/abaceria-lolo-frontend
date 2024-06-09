import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../core/services/auth-firebase.service';
import { filter } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmLogoutDialogComponent } from '../components/confirm-logout-dialog/confirm-logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'layout',
  standalone: true,
  imports: [MatIconModule, MatSidenavModule, MatListModule, RouterModule, MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
http: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
  ) {}

  @ViewChild('matDrawer', { static: true })
  matDrawer!: MatDrawer;
  drawerMode!: 'side' | 'over';

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.matDrawer.mode = 'over';
        this.matDrawer.close();

        this.router.events.pipe(
          filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
          this.matDrawer.close();
        });
      } else {
        this.matDrawer.mode = 'side';
        this.matDrawer.open();
      }
    });
  }
  toggleDrawer() {
    this.matDrawer.toggle();
  }
  panelOpenState = false;

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logOut();
        console.log('Sesión cerrada');
      }
    });
  }

  openMenuVisualization(): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/menu-visualization']));
    window.open(url, '_blank');
  }
}
