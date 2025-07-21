import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDecimalInput]'
})
export class DecimalInputDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Substitui vírgula por ponto
    const newValue = input.value.replace(',', '.');

    // Atualiza o valor do controle e do input
    this.control.control?.setValue(newValue, { emitEvent: false });
    input.value = newValue;
  }
}
