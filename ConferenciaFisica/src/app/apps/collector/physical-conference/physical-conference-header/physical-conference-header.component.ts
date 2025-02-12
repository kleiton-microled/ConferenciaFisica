import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-physical-conference-header',
  templateUrl: './physical-conference-header.component.html',
  styleUrl: './physical-conference-header.component.scss'
})
export class PhysicalConferenceHeaderComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      pesquisa: [''],
      conteiner: [''],
      lote: [''],
      numero: [{ value: '', disabled: true }],
      tipoCarga: [{ value: '', disabled: true }],
      viagem: [{ value: '', disabled: true }],
      motivoAbertura: [{ value: '', disabled: true }],
      embalagem: [''],
      quantidade: [{ value: '', disabled: true }]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulário enviado:', this.form.value);
    } else {
      console.log('Formulário inválido');
    }
  }
}
