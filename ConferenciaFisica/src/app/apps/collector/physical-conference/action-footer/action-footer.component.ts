import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-action-footer',
  templateUrl: './action-footer.component.html',
  styleUrls: ['./action-footer.component.scss']
})
export class ActionFooterComponent {

  @Output() startEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();
  @Output() cleanupEvent = new EventEmitter<void>();
  @Output() avariasEvent = new EventEmitter<void>();


  iniciar(): void {
    console.log('Início acionado');
    this.startEvent.emit();
  }

  terminar(): void {
    console.log('Término acionado');
  }

  avarias(): void {
    console.log('Avarias acionado');
    this.avariasEvent.emit();
  }

  limpar(): void {
    console.log('Limpar acionado');
    this.cleanupEvent.emit();
  }

  sair(): void {
    console.log('Sair acionado');
  }

  gravar(): void {
    console.log('Gravar acionado');
    this.saveEvent.emit();
  }

  excluir(): void {
    console.log('Excluir acionado');
  }

  fotosContainer(): void {
    console.log('Fotos Container acionado');
  }
}
