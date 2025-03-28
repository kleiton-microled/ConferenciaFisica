import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlToggleService {

  /**
   * Ativa ou desativa todos os controles de um FormGroup
   * @param form FormGroup a ser alterado
   * @param disabled Se true, desativa os controles. Se false, ativa.
   */
  toggleFormControls(form: FormGroup, disabled: boolean): void {
    if (!form) return;

    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      if (control) {
        disabled ? control.disable({ emitEvent: false }) : control.enable({ emitEvent: false });
      }
    });
  }
}
