import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layaout',
  standalone: true,
  imports: [MatIconModule, MatSidenavModule, MatListModule, RouterModule],
  templateUrl: './layaout.component.html',
  styleUrl: './layaout.component.scss'
})
export class LayoutComponent {
  @ViewChild('matDrawer', { static: true })

  matDrawer!: MatDrawer;
  drawerMode!: 'side' | 'over';

  toggleDrawer() {
    this.matDrawer.toggle();
  }
  panelOpenState = false;
}
