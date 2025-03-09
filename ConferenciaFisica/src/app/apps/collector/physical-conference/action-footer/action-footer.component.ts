import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-footer',
  templateUrl: './action-footer.component.html',
  styleUrls: ['./action-footer.component.scss']
})
export class ActionFooterComponent {

  // Recebe um objeto do pai para controlar quais botões ficam habilitados
  @Input() buttonsState: { [key: string]: boolean } = {};

  @Output() startEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();
  @Output() cleanupEvent = new EventEmitter<void>();
  @Output() avariasEvent = new EventEmitter<void>();

  iniciar(): void {
    if (this.buttonsState['start']) {
      console.log('Início acionado');
      this.startEvent.emit();
    }
  }

  terminar(): void {
    if (this.buttonsState['stop']) {
      console.log('Término acionado');
    }
  }

  avarias(): void {
    if (this.buttonsState['alert']) {
      console.log('Avarias acionado');
      this.avariasEvent.emit();
    }
  }

  limpar(): void {
    if (this.buttonsState['clear']) {
      console.log('Limpar acionado');
      this.cleanupEvent.emit();
    }
  }

  sair(): void {
    if (this.buttonsState['exit']) {
      console.log('Sair acionado');
    }
  }

  gravar(): void {
    if (this.buttonsState['save']) {
      console.log('Gravar acionado');
      this.saveEvent.emit();
    }
  }

  excluir(): void {
    if (this.buttonsState['delete']) {
      console.log('Excluir acionado');
    }
  }

  fotosContainer(): void {
    if (this.buttonsState['photo']) {
      console.log('Fotos Container acionado');
    }
  }
}
