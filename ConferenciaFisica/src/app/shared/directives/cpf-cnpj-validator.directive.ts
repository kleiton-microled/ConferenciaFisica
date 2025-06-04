import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[cpfCnpjValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CpfCnpjValidatorDirective,
      multi: true
    }
  ]
})
export class CpfCnpjValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').replace(/\D/g, '');

    if (value.length === 11 && !this.isValidCpf(value)) {
      return { cpfInvalid: true };
    }

    if (value.length === 14 && !this.isValidCnpj(value)) {
      return { cnpjInvalid: true };
    }

    return null;
  }

  private isValidCpf(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf) || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    if (digit1 !== Number(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    return digit2 === Number(cpf[10]);
  }

  private isValidCnpj(cnpj: string): boolean {
    if (!/^\d{14}$/.test(cnpj)) return false;

    const calc = (x: number) => {
      const weights = x === 12 ? [5,4,3,2,9,8,7,6,5,4,3,2] : [6,5,4,3,2,9,8,7,6,5,4,3,2];
      const sum = cnpj
        .split('')
        .slice(0, x)
        .reduce((acc, val, i) => acc + Number(val) * weights[i], 0);
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const digit1 = calc(12);
    const digit2 = calc(13);
    return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
  }
}
