import { Component } from '@angular/core';
import { PageTitleModule } from "../../../shared/page-title/page-title.module";
import { SharedModule } from "../../../shared/shared.module";
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-estufagem-container',
  standalone: true,
  imports: [PageTitleModule, SharedModule],
  templateUrl: './estufagem-container.component.html',
  styleUrl: './estufagem-container.component.scss'
})
export class EstufagemContainerComponent {
pageTitle: BreadcrumbItem[] = [];
footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
  start: { enabled: false, visible: false },
  stop: { enabled: false, visible: false },
  alert: { enabled: false, visible: false },
  clear: { enabled: false, visible: false },
  exit: { enabled: true, visible: true },
  save: { enabled: false, visible: false },
  delete: { enabled: false, visible: false },
  photo: { enabled: false, visible: false },
  marcante: { enabled: false, visible: false },
  observacao: { enabled: false, visible: false }
};
}
