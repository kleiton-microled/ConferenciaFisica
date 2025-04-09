import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvancedTableModule } from 'src/app/shared/advanced-table/advanced-table.module';
import { SelectizeModel } from 'src/app/shared/microled-select/microled-select.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FormValidationService } from 'src/app/shared/services/Messages/form-validation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TalieItemColectorDescarga } from '../descarga-armazem/models/talie-item-coletor-descarga.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { TalieItem } from '../models/talie-item.model';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { CarregamentoCargaSoltaService } from './carregament-carga-solta.service';
import { ItensCarregadosModel } from './models/itens-carregados.model';
import { ItensCargaModel } from './models/itens-carga.model';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { CarregamentoCargaSoltaModel } from './models/carregamento-carga-solta.model';
import { EnumValue } from 'src/app/shared/models/enumValue.model';

@Component({
  selector: 'app-carregamento-carga-solta',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule, CommonModule, AdvancedTableModule],
  templateUrl: './carregamento-carga-solta.component.html',
  styleUrl: './carregamento-carga-solta.component.scss'
})
export class CarregamentoCargaSoltaComponent {


  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: true, visible: true },
    alert: { enabled: false, visible: false },
    clear: { enabled: true, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false },
    estufar: { enabled: false, visible: false }
  };


  get conferenteControl(): FormControl {
    return this.form.get("conferente") as FormControl;
  }

  get veiculosControl(): FormControl {
    return this.form.get("veiculo") as FormControl;
  }

  get modoControl(): FormControl {
    return this.form.get("modo") as FormControl;
  }

  columns: Column[] = [];
  columnsOrdens: Column[] = [];

  conferentes: SelectizeModel[] = [];
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];

  veiculos: SelectizeModel[] = [];
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];

  modos: SelectizeModel[] = [];
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];
  itensList: CarregamentoCargaSoltaModel[] = [];
  ordensList: ItensCarregadosModel[] = [];

  constructor(
    public formValidationService: FormValidationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private service: CarregamentoCargaSoltaService
  ) {
    this.form = this.getNewForm();
    this.getVeiculos();
    this.initAdvancedTableData();
  }

  getVeiculos() {
    this.service.getVeiculos().subscribe((response: ServiceResult<EnumValue[]>) => {
      this.veiculos = response.result?.map(item => ({
        id: item.id,
        label: item.descricao
      })) || [];
    });
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  limpar() { this.form.reset(); }

  getNewForm(): FormGroup {
    let result = this.formBuilder.group({
      marcante: ['', Validators.required],
      local: ['',],
      inicio: [''],
      lote: [''],
      veiculo: [''],
      quantidade: [''],
      container: [''],
      reserva: [''],
      conferente: [''],
      modo: [''],
      talieCompleto: [false],
      estufagemCompleta: [false],
    });


    return result;
  }

  onSelectChange($event: any) {
    console.log($event)
  }

  gravar() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      return;
    };
  }

  buscar() {
    console.log(this.form.get("marcante")?.value)
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      return;
    };

    console.log(this.form.get("marcante")?.value)
    console.log('eeee')

    this.service.getByMarcante(this.form.get("marcante")?.value).subscribe((response: ServiceResult<ItensCargaModel>) => {
console.log(response.result?.carregamento)
    });


  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "numOc",
        label: "num oc",
        formatter: (item: CarregamentoCargaSoltaModel) => item.numOc
      },
      {
        name: "lote",
        label: "lote",
        formatter: (item: CarregamentoCargaSoltaModel) => item.lote,
      },
      {
        name: "qtde",
        label: "qtde",
        formatter: (item: CarregamentoCargaSoltaModel) => item.quantidade,
      },
      {
        name: "carregado",
        label: "Carregado",
        formatter: (item: CarregamentoCargaSoltaModel) => item.carregado,
      },
      {
        name: "embalagem",
        label: "Embalagem",
        formatter: (item: CarregamentoCargaSoltaModel) => item.embalagem,
      },

    ];

    this.columnsOrdens = [
      {
        name: "marcante",
        label: "marcante",
        formatter: (item: ItensCarregadosModel) => item.marcante
      },
      {
        name: "lote",
        label: "lote",
        formatter: (item: ItensCarregadosModel) => item.lote
      },
      {
        name: "quantidade",
        label: "quantidade",
        formatter: (item: ItensCarregadosModel) => item.quantidade
      },
    ]
  }

  onRowSelected($event: any) {

  }


  handleTableLoad($event: any) {

  }
}
