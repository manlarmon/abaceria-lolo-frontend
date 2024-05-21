import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth-firebase.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'layout',
  standalone: true,
  imports: [MatIconModule, MatSidenavModule, MatListModule, RouterModule, MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
          if (result.matches) {
            this.matDrawer.close();
          }
        });
      }
    });
  }

  @ViewChild('matDrawer', { static: true })
  matDrawer!: MatDrawer;

  toggleDrawer() {
    this.matDrawer.toggle();
  }
  panelOpenState = false;

  logout() {
    this.authService.logOut();
  }
}
