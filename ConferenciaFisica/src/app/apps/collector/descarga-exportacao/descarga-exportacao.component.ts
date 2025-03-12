import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DescargaExportacaoItens } from './models/descarga-exportacao-itens.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AvariasModalComponent } from 'src/app/shared/avarias/avarias-modal.component';
import { TiposAvarias } from 'src/app/shared/avarias/tipos-avarias.model';
import { DescargaExportacaoService } from './descarga-exportacao.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { DescargaExportacao } from './models/descarga-exportacao.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { MicroledPhotosComponent } from 'src/app/shared/microled-photos/microled-photos.component';

@Component({
  selector: 'app-descarga-exportacao',
  templateUrl: './descarga-exportacao.component.html',
  styleUrls: ['./descarga-exportacao.component.scss']
})
export class DescargaExportacaoComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
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
    start: { enabled: true, visible: true },
    stop: { enabled: false, visible: true },
    alert: { enabled: true, visible: true },
    clear: { enabled: false, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: true },
    delete: { enabled: false, visible: true },
    photo: { enabled: true, visible: true },
    marcante: { enabled: true, visible: true },
    observacao: { enabled: true, visible: true }
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

  columns: Column[] = [];
  @ViewChild("advancedTable") advancedTable: any;
  itensList: DescargaExportacaoItens[] = [{ id: 1, notaFiscal: '9988788-0', item: 9987, embalagem: 'VOLUME', quantidadeNf: 1, quantidadeDescarregada: 1 },
  { id: 1, notaFiscal: '9988788-0', item: 9987, embalagem: 'VOLUME', quantidadeNf: 1, quantidadeDescarregada: 1 }
  ];

  constructor(private fb: FormBuilder, 
    private service: DescargaExportacaoService, 
    private notificatioService: NotificationService,
    private sanitizer: DomSanitizer, 
    private modalService: NgbModal) {
    this.form = this.fb.group({
      registro: new FormControl('', Validators.required),
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
    this.initAdvancedTableData();
  }

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

  onSelectChange(value: any) {
    console.log('Selecionado:', value);
  }

  get equipeControl(): FormControl {
    return this.form.get('equipe') as FormControl;
  }

  get operacaoControl(): FormControl {
    return this.form.get('operacao') as FormControl;
  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "notafiscal",
        label: "NF",
        formatter: (service: DescargaExportacaoItens) => service.notaFiscal
      },
      {
        name: "item",
        label: "Item",
        formatter: (service: DescargaExportacaoItens) => service.item,
      },
      {
        name: "embalagem",
        label: "Embalagem",
        formatter: (service: DescargaExportacaoItens) => service.embalagem,
      },
      {
        name: "quantidadeNf",
        label: "Quantidade NF",
        formatter: (service: DescargaExportacaoItens) => service.quantidadeNf,
      },
      {
        name: "quantidadeDescarregada",
        label: "Quantidade Descarga",
        formatter: (service: DescargaExportacaoItens) => service.quantidadeDescarregada,
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

  //#region SERVICE
  buscarRegistro(registro: number) {
    this.service.findById(registro).subscribe((ret: ServiceResult<DescargaExportacao>) => {
      if(ret.status){
        console.log(ret.result);
      }else{
        this.notificatioService.showAlert(ret);
      }
    });
  }
  //#endregion SERVICE

  //#region MODAIS
  abrirModalFotos() {
    const modalRef = this.modalService.open(MicroledPhotosComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: false
    });
  
    modalRef.componentInstance.urlPath = 'uploads/fotos';
    modalRef.componentInstance.conteiner = 'CONT-1234';
  }
  
  //#endregion

}
