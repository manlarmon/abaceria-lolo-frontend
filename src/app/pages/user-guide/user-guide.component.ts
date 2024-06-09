import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, SafeUrlPipe],
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent {
  pdfSrc = 'assets/pdf/Inventory.pdf';
}
