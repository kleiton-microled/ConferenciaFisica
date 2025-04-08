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
import { map, Observable, Subscription } from 'rxjs';
import { ItensEstufados } from './itens-estufados.model';
import { Etiquetas } from './etiquetas.model';
import { ConferenteModel } from "../models/conferente.model";
import { SelectizeModel } from 'src/app/shared/microled-select/microled-select.component';
import { ColetorService } from '../collector.service';
import { SaldoCargaMarcante } from './model/saldo-carga-marcante.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { FormControlToggleService } from 'src/app/core/services/form-control-toggle.service';

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

  onConferenteSelectChange(value: any) {
    this.form.controls['conferente'].setValue(value);
    this.planejamentoAtual.conferente = value;
  }

  onEquipeSelectChange(value: any) {
    this.form.controls['equipe'].setValue(value);
    this.planejamentoAtual.equipe = value;
  }

  onModoSelectChange(value: any) {
    this.form.controls['modo'].setValue(value);
    this.planejamentoAtual.operacao = value;
  }



  form: FormGroup;
  formFilter: FormGroup;
  private planejamentoSub!: Subscription;

  isDisabled: boolean = false;
  planejamentoAtual!: Planejamento;

  pageTitle: BreadcrumbItem[] = [];
  columns: Column[] = [];
  estufagemList: ItensEstufados[] = [];
  etiquetasList: Etiquetas[] = [];

  conferentes: SelectizeModel[] = [];

  equipes: SelectizeModel[] = [];

  modos: SelectizeModel[] = [];
  quantidade: number = 0;

  constructor(private formBuilder: FormBuilder,
    public formValidationService: FormValidationService,
    private modalService: NgbModal,
    private _service: EstufagemConteinerService,
    private coletorService: ColetorService,
    public messageValidationService: FormValidationService,
    private notificationService: NotificationService,
    private toggleService: FormControlToggleService) {

    this.form = this.getNewForm();
    this.formFilter = this.formBuilder.group({
      planejamento: ['']
    });
  }

  ngOnInit(): void {
    this.initAdvancedTableData();
    this.listarConferentes();
    this.listarEquipes();
    this.listarModos();

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

  //#region  FORM
  getNewForm(): FormGroup {
    return this.formBuilder.group({
      planejamento: [{ value: '', disabled: true }],
      reserva: [{ value: '', disabled: true }],
      cliente: [{ value: '', disabled: true }],
      conteiner: [{ value: '', disabled: true }],
      inicio: [''],
      termino: [''],
      conferente: ['', Validators.required],
      equipe: ['', Validators.required],
      modo: ['', Validators.required],
      produto: [''],
      plan: [{ value: '', disabled: true }],
      ttl: [{ value: '', disabled: true }],
      lote: [''],
    });
  }

  get conferenteControl(): FormControl {
    return this.form.get('conferente') as FormControl;
  }

  get equipeControl(): FormControl {
    return this.form.get('equipe') as FormControl;
  }

  get modoControl(): FormControl {
    return this.form.get('modo') as FormControl;
  }
  //#endregion

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
    }).then((result) => {
      if (result.isConfirmed) {
        this.form.reset();
        this.estufagemList = [];
      }
    })
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

        // this._service.getEtiquetas(filter.planejamento).subscribe((ret: ServiceResult<Etiquetas[]>) => {
        //   if (ret.status && ret.result)
        //     this.etiquetasList = ret.result ?? [];
        // });
        this.atualizarBotoes([
          { nome: 'start', enabled: ret.result?.inicio ? false : true, visible: true },
          { nome: 'stop', enabled: ret.result?.termino ? false : true, visible: true },
          { nome: 'clear', enabled: true, visible: true }

        ]);

        if (ret.result?.termino) {
          this.toggleService.toggleFormControls(this.form, true);
          this.isDisabled = true;
        }


      }
      this.closeModal();
    });
  }

  listarConferentes() {
    this.coletorService.getConferentes().subscribe((ret: ServiceResult<ConferenteModel[]>) => {
      if (ret.status && ret.result) {
        this.conferentes = ret.result.map(c => ({
          id: c.id,
          label: c.nome
        }));
      } else {
        this.conferentes = [];
      }
    });
  }

  listarEquipes() {
    this.coletorService.getEquipes().subscribe((ret: ServiceResult<ConferenteModel[]>) => {
      if (ret.status && ret.result) {
        this.equipes = ret.result.map(c => ({
          id: c.id,
          label: c.nome
        }));
      } else {
        this.equipes = [];
      }
    });
  }

  listarModos() {
    this.modos = [{ id: 1, label: "Manual" }, { id: 1, label: "Automatizado" }]
  }

  iniciarEstufagem(): void {
    const filter = {
      planejamento: this.formFilter.get('planejamento')?.value || undefined,
    };
    if (this.form.get('equipe')?.value == 0)
      this.notificationService.showMessage('Campo Equipe é obrigatório!', 'Alert');

    if (this.form.get('conferente')?.value == 0)
      this.notificationService.showMessage('Campo Conferente é obrigatório!', 'Alert');

    if (this.form.get('modo')?.value == 0)
      this.notificationService.showMessage('Campo Modo é obrigatório!', 'Alert');

    if (this.form.valid) {
      this._service.postIniciarEstufagem(this.planejamentoAtual).subscribe((ret: ServiceResult<boolean>) => {
        console.log(ret);
        if (ret.status && ret.result) {
          this.buscarPlanejamento(filter);
        }
      });
    }
  }

  estufar() {
    //TODO verificar com Valdemir
    this._service.getEstufar().subscribe((ret: ServiceResult<boolean>) => {
      console.log(ret);
      this.notificationService.showMessage('Carga estufada com sucesso!', 'Sucesso');
    });
  }

  finalizar() {
    const filter = {
      planejamento: this.formFilter.get('planejamento')?.value || undefined,
    };

    this._service.postFinalizar(this.planejamentoAtual).subscribe((ret: ServiceResult<boolean>) => {
      if (ret.status && ret.result) {
        this.notificationService.showSuccess(ret);
        this.buscarPlanejamento(filter);

        this.toggleService.toggleFormControls(this.form, true);
      }
    });
  }

  buscarMarcantes = (termo: string): Observable<{ value: any; descricao: string }[]> => {
    return this.coletorService.getMarcantes(termo).pipe(
      map((res: any[]) => res.map(item => ({
        value: item.id,
        descricao: item.numero
      })))
    );
  };

  onMarcanteSelecionado(marcante: { value: any; descricao: string }) {
    if (marcante) {
      this._service.getSaldoCargaMarcante(this.planejamentoAtual.autonumRo, marcante.descricao).subscribe((ret: ServiceResult<SaldoCargaMarcante>) => {
        console.log(ret);
        this.quantidade = ret.result?.saldo ?? 0;
        this.atualizarBotoes([
          { nome: 'estufar', enabled: true, visible: true }
        ]);
      });
    }
  }
  //#endregion

  //#region HELPER
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: true },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false },
    estufar: { enabled: false, visible: true }
  };

  atualizarBotoes(botoes: { nome: string; enabled?: boolean; visible?: boolean }[]): void {
    const novoEstado = { ...this.footerButtonsState };

    botoes.forEach(botao => {
      if (novoEstado[botao.nome]) {
        if (botao.enabled !== undefined) {
          novoEstado[botao.nome].enabled = botao.enabled;
        }
        if (botao.visible !== undefined) {
          novoEstado[botao.nome].visible = botao.visible;
        }
      }
    });

    this.footerButtonsState = novoEstado;
  }

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
