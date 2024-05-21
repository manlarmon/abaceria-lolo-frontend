// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
  })
export class LoaderComponent {
  loading$ = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}
}
