import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-descarga-exportacao',
  templateUrl: './descarga-exportacao.component.html',
  styleUrls: ['./descarga-exportacao.component.scss']
})
export class DescargaExportacaoComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;

  equipes = ['Equipe 1', 'Equipe 2', 'Equipe 3'];
  operacoes = ['Operação 1', 'Operação 2', 'Operação 3'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      registro: ['', Validators.required],
      inicio: [null, Validators.required],
      termino: [null, Validators.required],
      talie: ['', Validators.required],
      placa: ['', Validators.required],
      reserva: ['', Validators.required],
      cliente: ['', Validators.required],
      conferente: ['', Validators.required],
      equipe: ['', Validators.required],
      operacao: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  buscar(): void {
    if (this.form.valid) {
      console.log('Buscando dados...', this.form.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  limpar(): void {
    this.form.reset();
  }

  limparData(campo: string) {
    this.form.controls[campo].setValue(null);
  }
  
}
