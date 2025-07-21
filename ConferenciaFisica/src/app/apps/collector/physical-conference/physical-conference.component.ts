import { Component } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-physical-conference',
  templateUrl: './physical-conference.component.html',
  styleUrl: './physical-conference.component.scss'
})
export class PhysicalConferenceComponent {
  pageTitle: BreadcrumbItem[] = [];
}
