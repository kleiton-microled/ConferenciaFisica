import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FormValidationService } from 'src/app/shared/services/Messages/form-validation.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { TalieItem } from '../models/talie-item.model';
import { DomSanitizer } from '@angular/platform-browser';
import { AdvancedTableModule } from "src/app/shared/advanced-table/advanced-table.module";
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { TalieItemColectorDescarga } from '../descarga-armazem/models/talie-item-coletor-descarga.model';
import { SelectizeModel } from 'src/app/shared/microled-select/microled-select.component';
// import { TalieItemColectorDescarga } from './models/talie-item-coletor-descarga.model';


@Component({
  selector: 'app-descarga-cd',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule, CommonModule, AdvancedTableModule],
  templateUrl: './descarga-cd.component.html',
  styleUrl: './descarga-cd.component.scss'
})
export class DescargaCdComponent {

  columns: Column[] = [];
  pageTitle: BreadcrumbItem[] = [];
  itensList: TalieItemColectorDescarga[] = [];

  form: FormGroup;
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: true, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };

  get conferenteControl(): FormControl {
    return this.form.get("conferente") as FormControl;
  }

  get equipeControl(): FormControl {
    return this.form.get("equipe") as FormControl;
  }

  get modoControl(): FormControl {
    return this.form.get("modo") as FormControl;
  }

  conferentes: SelectizeModel[] =[]; 
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];

  equipes: SelectizeModel[] =[];
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];

  modos : SelectizeModel[] =[];
  // [
  //   { id: 1, name: "Importação" },
  //   { id: 2, name: "Exportação" },
  // ];
  /**
   *
   */
  constructor(
    public formValidationService: FormValidationService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) {
    this.form = this.getNewForm();
    this.initAdvancedTableData();

  }

  getNewForm(): FormGroup {
    let result = this.formBuilder.group({
      registro: ['', Validators.required],
      talie: ['',],
      inicio: [''],
      termino: ['', Validators.required],
      cliente: ['', Validators.required],
      placa: ['', Validators.required],
      container: ['', Validators.required],
      reserva: ['', Validators.required],
      conferente: ['', Validators.required],
      equipe: ['', Validators.required],
      modo: ['', Validators.required],
      talieCompleto: [false, Validators.required],
      estufagemCompleta: [false, Validators.required],
    });
    result.get('talie')?.disable();
    result.get('inicio')?.disable();
    result.get('termino')?.disable();
    result.get('cliente')?.disable();
    result.get('placa')?.disable();
    result.get('reserva')?.disable();
    result.get('conferente')?.disable();

    return result;
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "lote",
        label: "lote",
        formatter: (item: TalieItemColectorDescarga) => item.lote
      },
      {
        name: "talie",
        label: "talie",
        formatter: (item: TalieItemColectorDescarga) => item.id,
      },
      {
        name: "inicio",
        label: "Inicio",
        formatter: (item: TalieItemColectorDescarga) => item.inicio,
      },
      {
        name: "placa",
        label: "Placa",
        formatter: (item: TalieItemColectorDescarga) => item.placa,
      },
      {
        name: "container",
        label: "Container",
        formatter: (item: TalieItemColectorDescarga) => item.container,
      },
      {
        name: "reserva",
        label: "Reserva",
        formatter: (item: TalieItemColectorDescarga) => item.reserva,
      },
      {
        name: "instrucao",
        label: "Instrução",
        formatter: (item: TalieItemColectorDescarga) => item.instrucao,
      },
      {
        name: "fantasia",
        label: "Fantasia",
        formatter: (item: TalieItemColectorDescarga) => item.fantasia,
      },
      {
        name: "Action",
        label: "Action",
        sort: false,
        formatter: this.serviceActionFormatter.bind(this),
      },
    ];
  }

  serviceActionFormatter(item: TalieItem): any {
    return this.sanitizer.bypassSecurityTrustHtml(`
        <a href="javascript:void(0);" class="action-icon edit-btn" data-id="${item.id}">
          <i class="mdi mdi-square-edit-outline"></i>
        </a>
        <a href="javascript:void(0);" class="action-icon delete-btn" data-id="${item.id}">
          <i class="mdi mdi-delete"></i>
        </a>
      `);
  }

  limpar() { this.form.reset(); this.itensList = [] }

  onSelectChange($event: any) {
    console.log($event)
  }

  buscarRegistro() {
    let itemToInsert = new TalieItemColectorDescarga();
    itemToInsert.id = 0;
    itemToInsert.lote = 0;
    itemToInsert.notaFiscal = 'teste nota';
    itemToInsert.embalagem = 'teste embalagem';
    itemToInsert.quantidadeNf = 1;
    itemToInsert.quantidadeDescarga = 2;
    itemToInsert.inicio = new Date(2025).toDateString();
    itemToInsert.placa = 'teste placa';
    itemToInsert.fantasia = 'teste fantasia';
    itemToInsert.instrucao = 'teste instrucao';
    itemToInsert.reserva = 'teste reserva';
    itemToInsert.container = 'teste container';

  this.itensList.push(itemToInsert)
  }

  onRowSelected($event: any) {
    throw new Error('Method not implemented.');
  }

  handleTableLoad($event: any) {
    throw new Error('Method not implemented.');
  }
}
