import { Component, OnInit, ViewChild } from '@angular/core';
import { PageTitleModule } from "../../../shared/page-title/page-title.module";
import { SharedModule } from "../../../shared/shared.module";
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estufagem } from '../models/estufagem.model';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';
import Swal from 'sweetalert2';
import { CommonModule } from "@angular/common";
import { FormValidationService } from 'src/app/shared/services/Messages/form-validation.service';

@Component({
  selector: 'app-estufagem-container',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule, AdvancedTableModule, CommonModule],
  templateUrl: './estufagem-container.component.html',
  styleUrl: './estufagem-container.component.scss'
})

export class EstufagemContainerComponent implements OnInit {
  onSubmit() {
    console.log(this.form.value);
    if (this.form.invalid) return;
  }

  searchData($event: string) {
    throw new Error('Method not implemented.');
  }
  @ViewChild("advancedTable") advancedTable: any;

  onConferenteSelectChange($event: any) {
    throw new Error('Method not implemented.');
  }

  form: FormGroup;
  pageTitle: BreadcrumbItem[] = [];
  columns: Column[] = [];
  estufagemList: Estufagem[] = [];

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: true, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: true, visible: true },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };
  conferentes = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' },];

  equipes = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' },];

  modos = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' },];



  constructor(private formBuilder: FormBuilder, public formValidationService: FormValidationService) {
    this.form = this.getNewForm();
  }

  ngOnInit(): void {
    this.initAdvancedTableData();
  }

  get conferenteControl(): FormControl {
    return this.form.get('conferente') as FormControl;
  }

  get equipeControl(): FormControl {
    return this.form.get('conferente') as FormControl;
  }

  get modoControl(): FormControl {
    return this.form.get('conferente') as FormControl;
  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "numero",
        label: "Numero",
        formatter: (item: Estufagem) => item.numero
      },
      {
        name: "reserva",
        label: "Reserva",
        formatter: (item: Estufagem) => item.reserva,
      },
      {
        name: "nf",
        label: "NF",
        formatter: (item: Estufagem) => item.nf,
      },
      {
        name: "embalagem",
        label: "Embalagem",
        formatter: (item: Estufagem) => item.embalagem,
      },
      {
        name: "lote",
        label: "Lote",
        formatter: (item: Estufagem) => item.lote,
      },
      {
        name: "mercadoria",
        label: "Mercadoria",
        formatter: (item: Estufagem) => item.mercadoria,
      },
      {
        name: "codBarras",
        label: "Cod. Barras",
        formatter: (item: Estufagem) => item.codBarras,
      },
      {
        name: "quantidade",
        label: "Quantidade",
        formatter: (item: Estufagem) => item.quantidade,
      },
    ];
  }

  clearFomulario() {
    Swal.fire({
      title: 'Limpar formulário!!!',
      text: "Tem certeza que limpar o formulario? Ação não poderá ser desfeita!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'NÃO',
    }).then((result) => { if (result.isConfirmed) { this.form.reset(); } })
  }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      planejamento: ['', Validators.required, Validators.minLength(10)],
      reserva: ['',  Validators.required, Validators.minLength(10)],
      cliente: ['', Validators.required],
      container: ['', Validators.required],
      inicio: ['', Validators.required],
      termino: ['', Validators.required],
      conferente: ['', Validators.required],
      equipe: ['', Validators.required],
      modo: ['', Validators.required],
      produto: ['', Validators.required],
      plan: ['', Validators.required],
      ttl: ['', Validators.required],
      lote: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
