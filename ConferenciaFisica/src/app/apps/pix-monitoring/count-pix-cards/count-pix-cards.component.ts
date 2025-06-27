import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-count-pix-cards',
  templateUrl: './count-pix-cards.component.html',
  styleUrls: ['./count-pix-cards.component.scss']
})
export class CountPixCardsComponent {
   @Input() cards = [
    { title: 'Pix Ativos', count: 52 },
    { title: 'Pix Pagos', count: 33 },
    { title: 'Pix Cancelados', count: 2 }
  ];

  getClassByTitle(title: string): string {
    switch (title) {
      case 'Pix Pagos':
        return 'value paid';
      case 'Pix Cancelados':
        return 'value canceled';
      default:
        return 'value';
    }
  }
}
