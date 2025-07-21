import { Component } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-collector',
  templateUrl: './collector.component.html',
  styleUrl: './collector.component.scss'
})
export class CollectorComponent {
pageTitle: BreadcrumbItem[] = [];
}
