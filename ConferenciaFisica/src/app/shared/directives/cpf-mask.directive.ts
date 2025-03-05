import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCpfMask]'
})
export class CpfMaskDirective {
  
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    let value = event.target.value;

    // Remove todos os caracteres não numéricos
    value = value.replace(/\D/g, '');

    // Aplica a máscara: 000.000.000-00
    if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }

    // Atualiza o campo de input com a máscara
    this.el.nativeElement.value = value;
  }
}
