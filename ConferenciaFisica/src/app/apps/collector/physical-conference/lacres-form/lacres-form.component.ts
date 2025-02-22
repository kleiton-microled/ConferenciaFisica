import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Lacre {
  NumeroLacre: string;
  TipoLacre: string;
  LacreFechamento: string;
}

@Component({
  selector: 'app-lacres-form',
  templateUrl: './lacres-form.component.html',
  styleUrls: ['./lacres-form.component.scss']
})
export class LacresFormComponent implements OnInit {
  lacresForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.lacresForm = this.fb.group({
      lacres: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.adicionarLacre(); // Inicializa com uma linha padrão
  }

  get lacres(): FormArray {
    return this.lacresForm.get('lacres') as FormArray;
  }

  novoLacre(): FormGroup {
    return this.fb.group({
      NumeroLacre: ['', Validators.required],
      TipoLacre: ['', Validators.required],
      LacreFechamento: ['', Validators.required]
    });
  }

  adicionarLacre(): void {
    this.lacres.push(this.novoLacre());
  }

  removerLacre(index: number): void {
    this.lacres.removeAt(index);
  }

  enviarFormulario(): void {
    console.log('Dados enviados:', this.lacresForm.value);
  }
}
