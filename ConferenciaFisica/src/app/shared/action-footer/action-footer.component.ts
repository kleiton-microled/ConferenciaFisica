import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-footer',
  templateUrl: './action-footer.component.html',
  styleUrls: ['./action-footer.component.scss']
})
export class ActionFooterComponent {

  // Agora o objeto de estado inclui também uma propriedade para controlar a visibilidade dos botões
  @Input() buttonsState: { [key: string]: { enabled: boolean, visible: boolean } } = {};

  @Output() startEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();
  @Output() cleanupEvent = new EventEmitter<void>();
  @Output() avariasEvent = new EventEmitter<void>();
  @Output() marcanteEvent = new EventEmitter<void>();
  @Output() observacaoEvent = new EventEmitter<void>();
  @Output() photoEvent = new EventEmitter<void>();
  @Output() exitEvent = new EventEmitter<void>();
  @Output() finalizarEvent = new EventEmitter<void>();
  @Output() estufarEvent = new EventEmitter<void>();

  iniciar(): void {
    if (this.buttonsState['start']?.enabled) {
      console.log('Início acionado');
      this.startEvent.emit();
    }
  }

  terminar(): void {
    if (this.buttonsState['stop']?.enabled) {
      console.log('Término acionado');
      this.finalizarEvent.emit();
    }
  }

  avarias(): void {
    if (this.buttonsState['alert']?.enabled) {
      console.log('Avarias acionado');
      this.avariasEvent.emit();
    }
  }

  limpar(): void {
    if (this.buttonsState['clear']?.enabled) {
      console.log('Limpar acionado');
      this.cleanupEvent.emit();
    }
  }

  sair(): void {
    if (this.buttonsState['exit']?.enabled) {
      console.log('Sair acionado');
      this.exitEvent.emit();
    }
  }

  gravar(): void {
    if (this.buttonsState['save']?.enabled) {
      console.log('Gravar acionado');
      this.saveEvent.emit();
    }
  }

  excluir(): void {
    if (this.buttonsState['delete']?.enabled) {
      console.log('Excluir acionado');
    }
  }

  fotosContainer(): void {
    if (this.buttonsState['photo']?.enabled) {
      console.log('Fotos Container acionado');
      this.photoEvent.emit();
    }
  }

  marcante(): void {
    if (this.buttonsState['marcante']?.enabled) {
      console.log('Marcante acionado');
      this.marcanteEvent.emit();
    }
  }

  observacao(): void {
    if (this.buttonsState['observacao']?.enabled) {
      console.log('Observação acionado');
      this.observacaoEvent.emit();
    }
  }

  estufar(): void {
    if (this.buttonsState['estufar']?.enabled) {
      console.log('Estufar acionado');
      this.estufarEvent.emit();
    }
  }
}
