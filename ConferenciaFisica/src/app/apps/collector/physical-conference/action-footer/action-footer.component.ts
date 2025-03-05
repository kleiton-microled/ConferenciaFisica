import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-action-footer',
  templateUrl: './action-footer.component.html',
  styleUrls: ['./action-footer.component.scss']
})
export class ActionFooterComponent {
  
  @Output() saveEvent = new EventEmitter<void>();

  iniciar(): void {
    console.log('Início acionado');
  }

  terminar(): void {
    console.log('Término acionado');
  }

  avarias(): void {
    console.log('Avarias acionado');
  }

  limpar(): void {
    console.log('Limpar acionado');
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
