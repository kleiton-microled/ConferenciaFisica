import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SelectizeModel {
  id: number | string;
  label: string;
}


@Component({
  selector: 'app-microled-select',
  templateUrl: './microled-select.component.html',
  styleUrls: ['./microled-select.component.scss']
})
export class MicroledSelectComponent {
  @Input() label: string = ''; // Label do select
  @Input() items: SelectizeModel[] = [];
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() control!: FormControl; // Control do Form

  @Output() selectionChange = new EventEmitter<any>(); // Evento para capturar a seleção

  onSelectionChange(event: any): void {
    this.selectionChange.emit(event.target.value);
  }
}
