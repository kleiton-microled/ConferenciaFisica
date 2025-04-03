import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EstufagemConteinerService } from './estufagem-conteiner.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { Planejamento } from './planejamento.model';
import { Subscription } from 'rxjs';
import { ItensEstufados } from './itens-estufados.model';
import { Etiquetas } from './etiquetas.model';
import { ConferenteModel } from "../models/conferente.model";

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
  formFilter: FormGroup;
  private planejamentoSub!: Subscription;

  planejamentoAtual!: Planejamento;

  pageTitle: BreadcrumbItem[] = [];
  columns: Column[] = [];
  estufagemList: ItensEstufados[] = [];
  etiquetasList: Etiquetas[] = [];

  conferentes = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
    { id: 2, name: 'EQUIPE TARDE (15h-23h' },
    { id: 3, name: 'EQUIPE NOITE (23h-07h' },];

  equipes = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' },];

  modos = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' },];



  constructor(private formBuilder: FormBuilder,
    public formValidationService: FormValidationService,
    private modalService: NgbModal,
    private _service: EstufagemConteinerService) {

    this.form = this.getNewForm();
    this.formFilter = this.formBuilder.group({
      planejamento: ['']
    });
  }

  ngOnInit(): void {
    this.initAdvancedTableData();

    this.planejamentoSub = this._service.getPlanejamentoAtual().subscribe(plan => {
      if (plan)
        this.planejamentoAtual = plan;
    });
  }


  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: "lg" });

  }

  async filterConferences() {
    const filter = {
      planejamento: this.formFilter.get('planejamento')?.value || undefined,
    };

    if (filter.planejamento != '' && filter.planejamento != undefined) {
      this.buscarPlanejamento(filter);
    }
  }

  /**
   * Fecha a modal do filtro
   */
  closeModal() {
    this.modalService.dismissAll();
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

  //#region TABLE
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "numero",
        label: "Numero",
        formatter: (item: ItensEstufados) => item.nr
      },
      {
        name: "reserva",
        label: "Reserva",
        formatter: (item: ItensEstufados) => item.reserva,
      },
      {
        name: "nf",
        label: "NF",
        formatter: (item: ItensEstufados) => item.numeroNotaFiscal,
      },
      {
        name: "embalagem",
        label: "Embalagem",
        formatter: (item: ItensEstufados) => item.descricaoEmbalagem,
      },
      {
        name: "lote",
        label: "Lote",
        formatter: (item: ItensEstufados) => item.lote,
      },
      {
        name: "mercadoria",
        label: "Mercadoria",
        formatter: (item: ItensEstufados) => item.descricaoProduto,
      },
      {
        name: "codBarras",
        label: "Cod. Barras",
        formatter: (item: ItensEstufados) => item.codigoBarra,
      },
      {
        name: "quantidade",
        label: "Quantidade",
        formatter: (item: ItensEstufados) => item.qtdeSaida,
      },
    ];
  }
  //#endregion TABLE

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
      planejamento: [{ value: '', disabled: true }],
      reserva: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      conteiner: [{ value: '', disabled: true }],
      inicio: [''],
      termino: [''],
      conferente: [''],
      equipe: [''],
      modo: [''],
      produto: [''],
      plan: [{ value: '', disabled: true }],
      ttl: [{ value: '', disabled: true }],
      lote: [''],
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  //#region SERVICES HTTP
  buscarPlanejamento(filter: { planejamento: string }) {
    this._service.getPlanejamento(filter).subscribe((ret: ServiceResult<Planejamento>) => {
      this.form.patchValue(this.planejamentoAtual);

      if (this.planejamentoAtual.autonumPatio) {
        this._service.getItensEstufados(this.planejamentoAtual.autonumPatio).subscribe((ret: ServiceResult<ItensEstufados[]>) => {
          if (ret.status && ret.result)
            this.estufagemList = ret.result ?? [];
        });

        this._service.getEtiquetas(filter.planejamento).subscribe((ret: ServiceResult<Etiquetas[]>) => {
          if (ret.status && ret.result)
            this.etiquetasList = ret.result ?? [];
        });

      }
      this.closeModal();
    });
  }
  //#endregion

  //#region HELPER
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

  private formatarDataString(isoDate: Date): string | null {
    if (!isoDate) return null;

    const data = new Date(isoDate);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
  }
  //#endregion
}
