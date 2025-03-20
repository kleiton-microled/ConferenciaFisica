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
import { Foto, MicroledPhotosComponent } from 'src/app/shared/microled-photos/microled-photos.component';
import { Subscription } from 'rxjs';
import { TalieItem } from '../models/talie-item.model';
import { PhysicalConferenceService } from '../physical-conference/physical-conference.service';
import { AvariaDescarga } from './models/avaria-descarga.model';
import Swal from 'sweetalert2';
import { Armazen } from '../models/armazens.model';
import { Marcante } from '../models/marcante.model';
import { Router } from '@angular/router';
import { EnumValue } from 'src/app/shared/models/enumValue.model';
import { BASE_IMAGES, DESCARGA_EXPORTACAO_URL } from 'src/app/Http/Config/config';

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
  marcante = new Marcante();
  listaMarcantes: Marcante[] = [];

  // Simulação de dados para o select de armazéns
  armazens: Armazen[] = [];

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

  constructor(private router: Router,
    private fb: FormBuilder,
    private service: DescargaExportacaoService,
    private conferenceService: PhysicalConferenceService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal) {
    this.form = this.fb.group({
      id: new FormControl({ value: '', disabled: false }),
      inicio: new FormControl({ value: '', disabled: true }),
      termino: new FormControl({ value: '', disabled: false }),
      talie: new FormControl({ value: '', disabled: true }),
      placa: new FormControl({ value: '', disabled: true },),
      reserva: new FormControl({ value: '', disabled: true },),
      cliente: new FormControl({ value: '', disabled: true },),
      conferente: new FormControl({ value: 'Microled', disabled: true }),
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
      remonte: [''],
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
          termino: this.convertDateToNgbDateStruct(this.descargaAtual?.talie?.termino ?? null),
        });

      }
    });

    /**
     * Atualiza a descargaatual em tempo real
     */
    this.form.valueChanges.subscribe((values) => {
      console.log(values, this.descargaAtual);

      if (!this.descargaAtual) return;

      // Atualiza normalmente os valores
      Object.assign(this.descargaAtual, values);

      // Atualiza especificamente o "termino" dentro do objeto talie
      if (this.descargaAtual.talie) {
        this.descargaAtual.talie.termino = values.termino;//;
      }

      console.log(this.descargaAtual, 'Values Termino', values.termino);
    });

    // this.form.valueChanges.subscribe((values) => {
    //   console.log(values, this.descargaAtual);

    //   if (!this.descargaAtual) return;
    //   Object.assign(this.descargaAtual, values);
    // });

    this.marcanteForm.valueChanges.subscribe((values) => {
      if (!this.marcante) return;

      Object.assign(this.marcante, values);
    });

    // this.form.controls['termino'].valueChanges.subscribe(value => {
    //   this.validarDataTermino(value);
    // });

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

  onRowSelected(item: any): void {

    this.itemSelecionado = item;
    this.buscarArmazens();
    this.buscarMarcantesTalieItem(item.id);
    this.atualizarBotoes([
      { nome: 'marcante', enabled: true, visible: true }
    ]);
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
      <a href="javascript:void(0);" class="action-icon edit-btn" data-id="${item.id}">
        <i class="mdi mdi-square-edit-outline"></i>
      </a>
      <a href="javascript:void(0);" class="action-icon delete-btn" data-id="${item.id}"}">
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
    modalRef.componentInstance.urlBasePhotos = BASE_IMAGES;
    this.service.getListarTiposProcessos().subscribe((ret: ServiceResult<EnumValue[]>) => {
      if (ret.status) {
        modalRef.componentInstance.photosTypes = ret.result;
      } else { }
    });

    this.service.getProcessosByTalie(this.descargaAtual.talie?.id ?? 0).subscribe((ret: ServiceResult<Foto[]>) => {
      console.log(ret.result)
      if (ret.status) {
        modalRef.componentInstance.fotos = ret.result;
      } else { }
    });

    modalRef.componentInstance.salvarFotoEmitter.subscribe((resultado: Foto) => {

      resultado.talieId = this.descargaAtual.talie?.id ?? 0;
      this.service.postProcessoFoto(resultado).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });

      this.service.getProcessosByTalie(this.descargaAtual.talie?.id ?? 0).subscribe((ret: ServiceResult<Foto[]>) => {
        
        if (ret.status) {
          modalRef.componentInstance.fotos = ret.result;
        } else { }
      });
    });

    modalRef.componentInstance.salvarAlteracaoFotoEmitter.subscribe((resultado: Foto) => {

      this.service.putProcessoFoto(resultado).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });

      this.service.getProcessosByTalie(this.descargaAtual.talie?.id ?? 0).subscribe((ret: ServiceResult<Foto[]>) => {
        
        if (ret.status) {
          modalRef.componentInstance.fotos = ret.result;
        } else { }
      });
    });

    modalRef.componentInstance.excluirFotoEmitter.subscribe((resultado: Foto) => {

      this.service.deleteProcessoFoto(resultado).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
    });


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
  buscarRegistro() {
    let registro = this.form.controls['id'].value;
    this.service.findById(registro).subscribe((ret: ServiceResult<DescargaExportacao>) => {
      if (ret.status) {
        this.service.updateDescarga(ret.result);
        this.atualizarBotoes([
          { nome: 'stop', enabled: ret.result?.talie?.termino == null ? true : false, visible: true },
          { nome: 'save', enabled: ret.result?.talie?.termino == null ? true : false, visible: true },
          { nome: 'alert', enabled: ret.result?.talie?.termino == null ? true : false, visible: true },
          { nome: 'clear', enabled: true, visible: true },
          { nome: 'delete', enabled: false, visible: true },
          { nome: 'observacao', enabled: ret.result?.talie?.termino == null ? true : false, visible: true },
          { nome: 'photo', enabled: ret.result?.talie?.termino == null ? true : false, visible: true },
        ]);

        this.observacaoForm.controls['observacao'].setValue(this.descargaAtual.talie?.observacao);

        this.conferenceService
          .getTiposAvarias()
          .subscribe((ret: ServiceResult<TiposAvarias[]>) => {
            if (ret.status) {
              this.tiposAvarias = ret.result ?? [];
            }
          });

        this.buscarArmazens();
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
        this.buscarRegistro();
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
        if (ret.status && ret.result) {
          this.buscarRegistro();
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
      modal.close();
    }
  }

  /**
   * Salvar Observacao
   */
  salvarObservacao(): void {
    if (this.observacaoForm.valid) {
      let observacao = this.observacaoForm.value.observacao;
      let talieId = this.descargaAtual.talie?.id ?? 0;

      this.service.saveObservacao(observacao, talieId).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {

          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
      //modal.close();
    }
  }

  salvarMarcante() {
    if (this.marcanteForm.valid) {

      this.marcante.registro = this.descargaAtual.registro;
      this.marcante.talieId = this.descargaAtual.talie?.id ?? 0;
      this.marcante.talieItemId = this.itemSelecionado.id;

      this.service.saveMarcante(this.marcante).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status && ret.result) {
          this.buscarMarcantesTalieItem(this.descargaAtual.talie?.id ?? 0);
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
      });
    }
  }

  getArmazemDescricao(id: number): string {
    const armazem = this.armazens.find(a => a.id === id);
    return armazem ? armazem.descricao : 'Desconhecido';
  }

  /**
   * Lista os armazens
   */
  buscarArmazens() {
    this.service.getArmazens(2).subscribe((ret: ServiceResult<Armazen[]>) => {
      if (ret.status) {
        this.armazens = ret.result ?? [];
      } else {
        this.notificationService.showAlert(ret);
      }
    });
  }
  /**
   * Exclui o talie Item
   * @param id 
   */
  deletarItem(id: number): void {
    Swal.fire({
      title: 'Excluir Registro!!!',
      text: "Tem certeza que deseja excluir o registro? Ação não poderá ser desfeita!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'NÃO',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteTalieItem(id, this.descargaAtual.registro).subscribe((ret: ServiceResult<boolean>) => {
          if (ret.status && ret.result) {
            this.buscarRegistro();
            this.notificationService.showSuccess(ret);
          } else {
            this.notificationService.showAlert(ret);
          }
        });
      }
    })
  }
  /**
   * Excluir marcante do talie item
   * @param id 
   */
  deletarMarcanteTalieItem(id: number): void {
    Swal.fire({
      title: 'Excluir Registro!!!',
      text: "Tem certeza que deseja excluir o registro? Ação não poderá ser desfeita!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'NÃO',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteMarcanteTalieItem(id).subscribe((ret: ServiceResult<boolean>) => {
          if (ret.status && ret.result) {
            this.notificationService.showSuccess(ret);
            this.buscarMarcantesTalieItem(this.descargaAtual.talie?.id ?? 0);
          } else {
            this.notificationService.showAlert(ret);
          }
        });
      }
    })
  }

  /**
   * Carrega os marcantes do talie item
   */
  buscarMarcantesTalieItem(id: number) {
    this.service.getMarcanteTaliItem(id).subscribe((ret: ServiceResult<Marcante[]>) => {
      if (ret.status) {
        this.listaMarcantes = ret.result ?? [];
      } else {
        this.notificationService.showAlert(ret);
      }
    });
  }

  /**
   * Chama o servico de finaliziar processo
   */
  finalizarProcessoDescarga() {
    if (this.descargaAtual.talie?.id) {
      this.service.getFinalizarProcesso(this.descargaAtual.talie?.id, false).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
          this.buscarRegistro();
        } else {
          this.notificationService.showAlert(ret);
        }
      });
    }
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

  /**
   * Limpeza do formulario
   */
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
    this.form.controls['conferente'].setValue('Microled');
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

  validarDataTermino(value: any): void {
    let isValid = false;
    if (!value)
      isValid = false;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Remove a hora para comparar apenas a data

    const dataSelecionada = new Date(value.year, value.month - 1, value.day);

    if (dataSelecionada < hoje) {
      isValid = false;
      this.form.controls['termino'].setValue(null); // Reseta o campo se for inválido
    } else {
      isValid = true;
    }

    // ✅ Chama o método desejado se a data for válida
    this.liberarBtnFinalizar(isValid);
  }

  liberarBtnFinalizar(value: boolean): void {
    if (value) {
      this.atualizarBotoes([{ nome: 'stop', enabled: true, visible: true }]);
    } else {
      this.atualizarBotoes([{ nome: 'stop', enabled: false, visible: true }]);
    }

  }

  sair() {
    this.router.navigate(['/apps/tools']);
  }

  //#endregion
}
