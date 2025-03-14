import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { PhysicalConferenceService } from '../physical-conference/physical-conference.service';
import { AvariaDescarga } from './models/avaria-descarga.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-descarga-exportacao',
  templateUrl: './descarga-exportacao.component.html',
  styleUrls: ['./descarga-exportacao.component.scss']
})
export class DescargaExportacaoComponent implements OnInit, OnDestroy {
  pageTitle: BreadcrumbItem[] = [];

  private subscription!: Subscription;
  descargaAtual!: DescargaExportacao;

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
  avariaDescarga!: AvariaDescarga;

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
  editItemForm: FormGroup;
  itemSelecionado!: TalieItem;

  @ViewChild('editItemModal') editItemModal!: TemplateRef<any>;
  itensList: TalieItem[] = [];

  constructor(private fb: FormBuilder,
    private service: DescargaExportacaoService,
    private conferenceService: PhysicalConferenceService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal) {
    this.form = this.fb.group({
      id: new FormControl({ value: '', disabled: false }),
      inicio: new FormControl({ value: '', disabled: true }),
      termino: new FormControl({ value: '', disabled: true }),
      talie: new FormControl({ value: '', disabled: true }),
      placa: new FormControl({ value: '', disabled: true },),
      reserva: new FormControl({ value: '', disabled: true },),
      cliente: new FormControl({ value: '', disabled: true },),
      conferente: new FormControl('', Validators.required),
      equipe: new FormControl(null, Validators.required),
      operacao: new FormControl('', Validators.required),
    });

    this.editItemForm = this.fb.group({
      notaFiscal: ['', Validators.required],
      quantidadeDescarga: ['', Validators.required],
      codigoEmbalagem: ['', Validators.required],
      embalagem: ['', Validators.required],
      comprimento: [''],
      largura: [''],
      altura: [''],
      madeira: [false],
      fragil: [false],
      numerada: [false],
      carimbo: [false],
      peso: [''],
      imo: [''],
      imo2: [''],
      imo3: [''],
      imo4: [''],
      uno: [''],
      uno2: [''],
      uno3: [''],
      uno4: [''],
      fumigacao: [''],
      remonte: [false],
      observacao: ['']
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

  ngAfterViewInit(): void {
    document.addEventListener('click', (event: any) => this.handleActionClick(event));
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

  limpar() {
    Swal.fire({
      title: "Limpar Descarga!!!",
      text: "Deseja limpar a descarga atual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "SIM",
      cancelButtonText: "NÃO",
    }).then((result) => {
      if (result.isConfirmed) {
        this.Reset();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  Reset() {
    this.form.reset();
    this.service.deletarDescarga();
    this.itensList = [];
    this.atualizarBotoes([
      { nome: 'stop', enabled: false, visible: true },
      { nome: 'alert', enabled: false, visible: true },
      { nome: 'clear', enabled: false, visible: true },
      { nome: 'delete', enabled: false, visible: true },
      { nome: 'marcante', enabled: false, visible: true },
      { nome: 'observacao', enabled: false, visible: true },
      { nome: 'save', enabled: false, visible: true },
      { nome: 'photo', enabled: false, visible: true }
    ]);
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

  serviceActionFormatter(item: TalieItem): any {
    return this.sanitizer.bypassSecurityTrustHtml(`
      <a href="javascript:void(0);" class="action-icon view-btn" data-id="${item.id}">
        <i class="mdi mdi-eye"></i>
      </a>
      <a href="javascript:void(0);" class="action-icon edit-btn" data-id="${item.id}">
        <i class="mdi mdi-square-edit-outline"></i>
      </a>
      <a href="javascript:void(0);" class="action-icon delete-btn" data-id="${item.id}">
        <i class="mdi mdi-delete"></i>
      </a>
    `);
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

  //#region MODAIS
  /**
     * Modal Avarias
     */
  getModalAvaria() {
    this.avariaDescarga = new AvariaDescarga();
    console.log(this.avariaDescarga);
    this.abrirModalAvarias<AvariaDescarga>(this.avariaDescarga);
  }

  /**
   * Faz a abertura da modal de itens recebendo a Modal que será utilizada
   * @param avariaModel 
   */
  abrirModalAvarias<T extends Record<string, any>>(avariaModel: T) {
    const modalRef = this.modalService.open(AvariasModalComponent, {
      size: "xl",
      backdrop: "static",
      centered: false,
    });

    // Passa a model genérica para a modal
    modalRef.componentInstance.avariaModel = avariaModel;

    // Passa os tipos de avarias e embalagens
    modalRef.componentInstance.tiposAvarias = this.tiposAvarias;
    modalRef.componentInstance.listLocal = [{ id: 1, codigo: 1, descricao: 'Fumigação' },
    { id: 2, codigo: 2, descricao: 'Identificação' }];


    // ✅ Ouvindo o evento de salvamento da modal
    modalRef.componentInstance.avariasSalvas.subscribe((avaria: AvariaDescarga) => {
      avaria.talieId = this.descargaAtual.talie?.id ?? 0;

      this.service.saveAvaria(avaria).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
    });

    // ✅ Tratando o fechamento da modal
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

  /**
   * Abre a modal para edicao de itens 
   * @param item 
   */
  handleActionClick(event: any): void {
    const target = event.target.closest('.action-icon');
    if (!target) return;

    const id = target.getAttribute('data-id');
    if (!id) return;

    if (target.classList.contains('edit-btn')) {
      this.abrirModalEditarItem(id);
    } else if (target.classList.contains('delete-btn')) {
      this.deletarItem(id);
    } else if (target.classList.contains('view-btn')) {
      //this.visualizarItem(id);
    }
  }

  abrirModalEditarItem(id: any): void {
    const item = this.descargaAtual.talie?.talieItem.find(i => i.id == id);
    if (!item) return;

    this.itemSelecionado = item;
    this.editItemForm.patchValue(item);

    this.editItemForm.valueChanges.subscribe(updatedValues => {
      Object.assign(this.itemSelecionado, updatedValues);
    });

    this.modalService.open(this.editItemModal, { size: 'xl', backdrop: 'static', centered: false });
  }
  //#endregion MODAIS
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
          { nome: 'stop', enabled: true, visible: true },
          { nome: 'save', enabled: true, visible: true },
          { nome: 'alert', enabled: true, visible: true },
          { nome: 'clear', enabled: true, visible: true },
          { nome: 'delete', enabled: true, visible: true },
          { nome: 'marcante', enabled: true, visible: true },
          { nome: 'observacao', enabled: true, visible: true },
          { nome: 'photo', enabled: true, visible: true },
        ]);

        this.conferenceService
          .getTiposAvarias()
          .subscribe((ret: ServiceResult<TiposAvarias[]>) => {
            if (ret.status) {
              this.tiposAvarias = ret.result ?? [];
            }
          });
      } else {
        this.notificationService.showAlert(ret);
      }
    });
  }

  /**
   * Executa o metodo de gravacao da descarga
   */
  gravarDescarga() {
    this.service.saveDescargaExportacao(this.descargaAtual).subscribe((ret: ServiceResult<boolean>) => {
      if (ret.status) {
        this.notificationService.showSuccess(ret);
        this.buscarRegistro(this.descargaAtual?.registro ?? 0);
      } else {
        this.notificationService.showAlert(ret);
      }
    });
  }

  /**
   * Salvar alteracoes no item do talie
   * @param modal 
   */
  salvarAlteracoes(modal: any): void {
    if (this.editItemForm.valid) {
      this.service.saveTalieItem(this.itemSelecionado, this.descargaAtual.registro).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          //this.buscarRegistro(this.descargaAtual.registro);
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
      //modal.close();
    }
  }

  deletarItem(id: number): void {
    console.log('Item deletado:', id);
    this.service.deleteTalieItem(id).subscribe((ret: ServiceResult<boolean>) => {
      if (ret.status) {
        this.buscarRegistro(this.descargaAtual.registro);
        this.notificationService.showSuccess(ret);
      } else {
        this.notificationService.showAlert(ret);
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
