import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DescargaExportacaoItens } from './models/descarga-exportacao-itens.model';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AvariasModalComponent } from 'src/app/shared/avarias/avarias-modal.component';
import { TiposAvarias } from 'src/app/shared/avarias/tipos-avarias.model';
import { DescargaExportacaoService } from './descarga-exportacao.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { DescargaExportacao } from './models/descarga-exportacao.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MicroledPhotosComponent } from 'src/app/shared/microled-photos/microled-photos.component';
import { Subscription } from 'rxjs';
import { TalieItem } from '../models/talie-item.model';

@Component({
  selector: 'app-descarga-exportacao',
  templateUrl: './descarga-exportacao.component.html',
  styleUrls: ['./descarga-exportacao.component.scss']
})
export class DescargaExportacaoComponent implements OnInit, OnDestroy {
  pageTitle: BreadcrumbItem[] = [];

  private subscription!: Subscription;
  descargaAtual!: DescargaExportacao | null;

  form: FormGroup;
  observacaoForm: FormGroup;

  marcanteForm: FormGroup;

  // Simulação de dados para o select de armazéns
  armazens = [
    { id: 1, nome: 'Armazém 1' },
    { id: 2, nome: 'Armazém 2' },
    { id: 3, nome: 'Armazém 3' }
  ];

  listEquipes = [{ id: 1, name: 'EQUIPE MANHÃ (07h-15h' },
  { id: 2, name: 'EQUIPE TARDE (15h-23h' },
  { id: 3, name: 'EQUIPE NOITE (23h-07h' }];

  listOperacoes = [{ id: 1, name: 'Manual' }, { id: 2, name: 'Automatizada' }];

  tiposAvarias: TiposAvarias[] = [];

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: true },
    alert: { enabled: false, visible: true },
    clear: { enabled: false, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: true },
    delete: { enabled: false, visible: true },
    photo: { enabled: false, visible: true },
    marcante: { enabled: false, visible: true },
    observacao: { enabled: false, visible: true }
  };

  columns: Column[] = [];
  @ViewChild("advancedTable") advancedTable: any;
  itensList: TalieItem[] = [];

  constructor(private fb: FormBuilder,
    private service: DescargaExportacaoService,
    private notificatioService: NotificationService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal) {
    this.form = this.fb.group({
      id: new FormControl('', Validators.required),
      inicio: new FormControl(null, Validators.required),
      termino: new FormControl(null, Validators.required),
      talie: new FormControl('', Validators.required),
      placa: new FormControl('', Validators.required),
      reserva: new FormControl('', Validators.required),
      cliente: new FormControl('', Validators.required),
      conferente: new FormControl('', Validators.required),
      equipe: new FormControl(null, Validators.required),
      operacao: new FormControl('', Validators.required),
    });

    this.observacaoForm = this.fb.group({
      observacao: ['', Validators.required]
    });

    this.marcanteForm = this.fb.group({
      marcante: ['', Validators.required],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      armazem: ['', Validators.required],
      local: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.service.iniciarDescarga();

    /**
     * Atualiza o form com o resultada da API
     */
    this.subscription = this.service.getCurrentDescarga().subscribe(descarga => {
      if (descarga) {
        this.descargaAtual = descarga;
        this.itensList = descarga.talie?.talieItem ?? [];
        this.form.patchValue({
          ...this.descargaAtual,
          talie: this.descargaAtual.talie?.id,
          inicio: this.convertDateToNgbDateStruct(this.descargaAtual?.talie?.inicio ?? null),
          termino: this.convertDateToNgbDateStruct(this.descargaAtual?.talie?.inicio ?? null),
        });

      }
    });

    /**
     * Atualiza a descargaatual em tempo real
     */
    this.form.valueChanges.subscribe((values) => {
      if (!this.descargaAtual) return;

      Object.assign(this.descargaAtual, values);
      console.log('DescargaAtualizada: ', this.descargaAtual);
    });


    this.initAdvancedTableData();
  }


  // Atualiza os dados no Subject sempre que houver alterações no form
  atualizarDescarga(): void {
    if (this.form.valid) {
      const dadosAtualizados: DescargaExportacao = {
        ...this.descargaAtual,
        ...this.form.value,
        inicio: this.convertNgbDateStructToString(this.form.value.inicio),
        termino: this.convertNgbDateStructToString(this.form.value.termino),
      };

      this.service.updateDescarga(dadosAtualizados);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  limpar(): void {
    this.form.reset();
  }

  limparData(campo: string) {
    this.form.controls[campo].setValue(null);
  }

  onSelectChange(value: any) {
    console.log('Selecionado:', value);
  }

  get equipeControl(): FormControl {
    return this.form.get('equipe') as FormControl;
  }

  get operacaoControl(): FormControl {
    return this.form.get('operacao') as FormControl;
  }

  /**
   * Inicia a tabela de itens
   */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "notafiscal",
        label: "NF",
        formatter: (item: TalieItem) => item.notaFiscal
      },
      {
        name: "item",
        label: "Item",
        formatter: (item: TalieItem) => item.id,
      },
      {
        name: "embalagem",
        label: "Embalagem",
        formatter: (item: TalieItem) => item.embalagem,
      },
      {
        name: "quantidadeNf",
        label: "Quantidade NF",
        formatter: (item: TalieItem) => item.quantidadeNf,
      },
      {
        name: "quantidadeDescarregada",
        label: "Quantidade Descarga",
        formatter: (item: TalieItem) => item.quantidadeDescarga,
      },
      {
        name: "Action",
        label: "Action",
        sort: false,
        formatter: this.serviceActionFormatter.bind(this),
      },
    ];
  }

  handleTableLoad(event: any): void {
    document.querySelectorAll(".service").forEach((e) => {
      e.addEventListener("click", () => {
        // this.router.navigate(["../order/details"], {
        //   relativeTo: this.route,
        //   queryParams: { id: e.id },
        // });
      });
    });
  }

  serviceActionFormatter(order: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-eye"></i></a>
               <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-square-edit-outline"></i></a>
               <a href="javascript:void(0);" class="action-icon"> <i class="mdi mdi-delete"></i></a>`
    );
  }

  abrirModal(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  abrirModalMarcante(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  salvarMarcante() {
    if (this.marcanteForm.valid) {
      console.log("Marcante salvo:", this.marcanteForm.value);
    }
  }

  salvarObservacao() {
    // if (this.observacaoForm.valid) {
    //   console.log("Observação salva:", this.observacaoForm.value.observacao);
    // }
  }

  /**
     * Modal Avarias
     */
  abrirModalAvarias() {
    const modalRef = this.modalService.open(AvariasModalComponent, {
      size: "xl",
      backdrop: "static",
      centered: false,
    });

    modalRef.componentInstance.tiposAvarias = this.tiposAvarias;

    modalRef.componentInstance.embalagens = [];


    modalRef.componentInstance.avariaConferencia = null;


    //modalRef.componentInstance.conteiner = this.form.controls['numeroConteiner'].value;
    //modalRef.componentInstance.idConferencia = this.conferenceService.getCurrentConference().id;

    // modalRef.componentInstance.avariasSalvas.subscribe((avaria: AvariaConferencia) => {
    //   this.conferenceService.saveAvariaConferencia(avaria).subscribe((ret: ServiceResult<boolean>) => {
    //     if (ret.status) {
    //       this.notificationService.showSuccess(ret);

    //     } else {
    //       this.notificationService.showAlert(ret);
    //     }
    //   });
    // });

    modalRef.result
      .then((dados) => {
        if (dados) {
          console.log("Avarias salvas:", dados);
        }
      })
      .catch(() => { });
  }

  /**
   * Abre a modal de fotos
   */
  abrirModalFotos() {
    const modalRef = this.modalService.open(MicroledPhotosComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: false
    });

    modalRef.componentInstance.urlPath = 'uploads/fotos';
    modalRef.componentInstance.conteiner = 'CONT-1234';
  }

  //#region METODOS SERVICE
  /**
   * Executa a busca pelo numero do registro
   * @param registro 
   */
  buscarRegistro(registro: number) {
    this.service.findById(registro).subscribe((ret: ServiceResult<DescargaExportacao>) => {
      if (ret.status) {
        this.service.updateDescarga(ret.result);
        this.atualizarBotoes([
          { nome: 'stop', enabled: true , visible:true},
          { nome: 'save', enabled: true , visible:true},
          { nome: 'alert', enabled: true , visible:true},
          { nome: 'clear', enabled: true , visible:true},
          { nome: 'delete', enabled: true , visible:true},
          { nome: 'marcante', enabled: true, visible:true },
          { nome: 'observacao', enabled: true, visible:true },
          { nome: 'photo', enabled: true, visible:true },
        ]);
      } else {
        this.notificatioService.showAlert(ret);
      }
    });
  }

  //#endregion SERVICE

  //#region HELPERS
  // 🔄 Converte a string da API para NgbDateStruct
  private convertDateToNgbDateStruct(dateString: string | null): NgbDateStruct | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  // 🔄 Converte o NgbDateStruct de volta para string ISO antes de enviar para API
  private convertNgbDateStructToString(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}T00:00:00`;
  }

  /**
   * Atualiza o estado dos botoes do action footer
   * @param botoes 
   */
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
  
  //#endregion
}
