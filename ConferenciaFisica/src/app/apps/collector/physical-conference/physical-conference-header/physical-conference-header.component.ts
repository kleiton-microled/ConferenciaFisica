import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConferenceContainer, ConferenceLotes, PhysicalConferenceService } from '../physical-conference.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { CONTEINERS } from '../mock/data';
import { PhysicalConferenceStorageService } from '../physical-conference-storage.service';
import { PhysicalConferenceModel } from '../models/physical-conference.model';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, skip, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { CadastroAdicionalModel } from '../models/cadastro-adicional.model';
import { TipoLacre } from '../models/tipo-lacre.model';
import { LacresModel } from '../models/lacres.model';
import { DocumentosComponent } from '../documentos/documentos.component';
import { TiposDocumentos } from '../models/tipos-documentos.model';
import { DocumentosConferencia } from '../models/documentos-conferencia.model';

@Component({
  selector: 'app-physical-conference-header',
  templateUrl: './physical-conference-header.component.html',
  styleUrl: './physical-conference-header.component.scss'
})
export class PhysicalConferenceHeaderComponent {
  form!: FormGroup;
  containers: ConferenceContainer[] = [];
  lotes: ConferenceLotes[] = [];
  tipolacres: TipoLacre[] = [];
  lacresConferencia: LacresModel[] = [];

  conferences: PhysicalConferenceModel[] = [];

  //SUBS 
  private conferenceSubscription!: Subscription;
  private formSubscription!: Subscription;

  //Filtro
  selectedContainer: string = "0"; // Variável para armazenar a seleção do container
  selectedLote: string = "0"; // Variável para armazenar a seleção do lote
  selectedNumero: string = ""; // Variável para armazenar a pesquisa por número

  conference: PhysicalConferenceModel = new PhysicalConferenceModel();

  ajudantes: CadastroAdicionalModel[] = [];
  representantes: CadastroAdicionalModel[] = [];
  operadores: CadastroAdicionalModel[] = [];
  documentos: DocumentosConferencia[] = [];

  filtro: string = '';
  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private conferenceService: PhysicalConferenceService,
    private storageService: PhysicalConferenceStorageService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    //this.loadConferences();
    this.inicializarFormulario();

    // 🔥 Escutar mudanças na conference e atualizar o formulário
    this.conferenceSubscription = this.conferenceService.getConference$()
      .pipe(skip(1)) // Evita rodar na primeira execução
      .subscribe(conference => {
        if (conference) {
          this.form.patchValue(conference, { emitEvent: false });
        }
      });

    // 🔥 Escutar mudanças no formulário e atualizar a conference
    this.formSubscription = this.form.valueChanges
      .pipe(
        debounceTime(300), // Evita chamadas excessivas
        distinctUntilChanged() // Apenas dispara se houver mudança real
      )
      .subscribe(values => {
        this.atualizarConference(values);
      });

    //Validar QuantidadeDivergente
    this.form.controls["quantidadeDivergente"].valueChanges.subscribe(value => {
      console.log(value);
      if (value === "0" || value === "2") {
        this.form.controls["qtdVolumesDivergentes"].setValue('', { emitEvent: false });
        this.form.controls["qtdVolumesDivergentes"].disable();
      } else {
        this.form.controls["qtdVolumesDivergentes"].enable();
      }
    });

    this.loadTiposLAcres();
  }

  ngOnDestroy(): void {
    // Evita vazamento de memória ao desinscrever quando o componente for destruído
    if (this.conferenceSubscription) {
      this.conferenceSubscription.unsubscribe();
    }
    this.formSubscription?.unsubscribe();
  }

  /**
   * Inicializa od formulario
   */
  inicializarFormulario(): void {
    this.form = this.fb.group({
      id: [{ value: 0 }],
      numeroConteiner: [{ value: '', disabled: true }],
      numerolote: [{ value: '', disabled: true }],
      conteiner: [''],
      lote: [''],
      //numero: [{ value: '', disabled: true }],
      tipoCarga: [{ value: '', disabled: false }],
      viagem: [{ value: '', disabled: false }],
      motivoAbertura: [{ value: '', disabled: false }],
      embalagem: [''],
      quantidade: [{ value: '', disabled: false }],
      tipoConferencia: [{ value: '', disabled: false }],
      inicioConferencia: [{ value: '', disabled: false }],
      fimConferencia: [{ value: '', disabled: false }],
      cpfCliente: [{ value: '', disabled: false }],
      nomeCliente: [{ value: '', disabled: false }],
      retiradaAmostra: [{ value: '', disabled: false }],
      cpfConferente: [{ value: '', disabled: false }],
      nomeConferente: [{ value: '', disabled: false }],
      qtdDocumento: [{ value: '', disabled: false }],
      dataPrevista: [{ value: '', disabled: false }],
      quantidadeDivergente: [{ value: '', disabled: false }],
      qtdVolumesDivergentes: [{ value: '', disabled: true }],
      qtdRepresentantes: [{ value: '', disabled: false }],
      qtdAjudantes: [{ value: '', disabled: false }],
      qtdOperadores: [{ value: '', disabled: false }],
      divergenciaQualificacao: [{ value: '', disabled: false }],
      movimentacao: [{ value: '', disabled: false }],
      desunitizacao: [{ value: '', disabled: false }],
    });
  }

  /**
   * Atualiza o fomulario com a conferencia atual
   * @param conference 
   */
  atualizarFormulario(conference: PhysicalConferenceModel): void {
    console.log('Conferencia Form: ', conference);
    this.form.patchValue({
      id: conference?.id,
      tipo: conference?.tipo,
      numeroConteiner: conference?.cntr,
      conteiner: conference?.cntr,
      tipoCarga: conference?.tipoCarga,
      viagem: conference?.viagem,
      motivoAbertura: conference?.motivoAbertura,
      embalagem: conference?.embalagem,
      quantidade: conference?.quantidade,
      tipoConferencia: conference?.tipo,
      inicioConferencia: conference?.inicio,
      fimConferencia: conference?.fim,
      cpfCliente: conference?.cpfCliente,
      nomeCliente: conference?.nomeCliente,
      retiradaAmostra: conference?.retiradaAmostra,
      cpfConferente: '457.244.118-32',
      nomeConferente: 'Microled',
      qtdDocumento: conference?.qtdDocumento,
      dataPrevista: conference?.dataPrevista,
      quantidadeDivergente: conference?.quantidadeDivergente,
      qtdVolumesDivergentes: conference?.quantidadeVolumesDivergentes,
      qtdRepresentantes: conference?.quantidadeRepresentantes,
      qtdAjudantes: conference?.quantidadeAjudantes,
      qtdOperadores: conference?.quantidadeOperadores,
      divergenciaQualificacao: conference?.divergenciaQualificacao.toString().trim(),
      movimentacao: conference?.movimentacao,
      desunitizacao: conference?.desunitizacao
    });

    this.conferenceService.updateConference(conference);

    this.loadLacresConferencia(conference.id);

    this.loadCadastrosAdicionais(conference?.id || 0);

    this.loadDocumentosConferencia(conference?.id || 0);
  }

  /**
   * Update conference SUB
   * @param values 
   */
  atualizarConference(values: any): void {
    const updatedConference: PhysicalConferenceModel = {
      //...this.conferenceService.getCurrentConference(), // Mantém os valores atuais
      ...values // Substitui pelos novos valores do formulário
    };

    this.conferenceService.updateConference(updatedConference);
  }

  /**
   * Carregar os conteiners disponíveis para conferencia
   */
  loadContainers() {
    this.conferenceService.getContainers().subscribe({
      next: (response: ServiceResult<any>) => {
        if (response.status) {
          this.containers = response.result;
        } else {
          Swal.fire({
            title: 'Info',
            text: response.mensagens[0],
            icon: 'info',
            confirmButtonText: 'Fechar'
          });
        }
      },
      //error: (err) => console.error('Erro na requisição:', err)
    });
  }

  /**
   * Carregar os lotes
   */
  loadLotes() {
    this.conferenceService.getMockLotes().subscribe({
      next: (response: ServiceResult<any>) => {
        if (response.status) {
          this.lotes = response.result;
        }
      },
      error: (err) => console.error('Erro na requisição:', err)
    });
  }

  /**
   * Carregar os tipos de Lacres
   */
  loadTiposLAcres() {
    this.conferenceService.getTipoLacres().subscribe({
      next: (response: ServiceResult<TipoLacre[]>) => {
        if (response.status) {
          this.tipolacres = response.result != null ? response.result : [];
        } else {
          Swal.fire({
            title: 'Info',
            text: response.mensagens[0],
            icon: 'info',
            confirmButtonText: 'Fechar'
          });
        }
      },
      //error: (err) => console.error('Erro na requisição:', err)
    });
  }

  /**
   * Listar os lacres da conferencia na tabela
   * @param id 
   */
  loadLacresConferencia(id: number) {
    this.conferenceService.getLacresConferencia(id).subscribe({
      next: (response: ServiceResult<LacresModel[]>) => {
        if (response.status) {
          this.lacresConferencia = response.result != null ? response.result : [];
        } else {
          Swal.fire({
            title: 'Info',
            text: response.mensagens[0],
            icon: 'info',
            confirmButtonText: 'Fechar'
          });
        }
      },
      //error: (err) => console.error('Erro na requisição:', err)
    });
  }

  onTipoLacreRecebido(tipoLacre: TipoLacre): void {
    console.log('Tipo de Lacre Recebido:', tipoLacre);
  }

  limparConferenciaAtual() {
    Swal.fire({
      title: 'Inicio de Conferência!!!',
      text: 'Deseja limpar a conferência atual?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'NÃO',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ResetConferencia();
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });

  }
  ResetConferencia() {
    this.form.reset();
    this.lacresConferencia = [];
    this.representantes = [];
    this.documentos = [];
    this.operadores = [];
    this.ajudantes = [];
  }

  applyFilter(): void {
    this.loadContainers();
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulário enviado:', this.form.value);
    } else {
      console.log('Formulário inválido');
    }
  }

  startPhysicalConference() {
    this.conferenceService.getConference$().subscribe(conference => {
      if (conference) {
        conference.inicio = new Date();
        this.conferenceService.updateConference(conference);
      }
    });

    this.conferenceService.startConference(this.conferenceService.getCurrentConference())
      .subscribe({
        next: (response) => {
          if (response.status) {
            this.notificationService.showSuccess(response);
            this.closeModal();
          } else {
            this.notificationService.showAlert(response);
          }
        },
        error: (error) => {
          console.error('Erro ao iniciar conferência', error);
        }
      });

  }

  //#region MOCK
  /**
   * 🔥 Carrega todas as conferências simuladas
   */
  // loadConferences() {
  //   this.storageService.getConferences().subscribe(data => {
  //     this.conferences = data;
  //   });
  // }

  async filterConferences() {
    const filter = {
      conteiner: this.selectedContainer || undefined,
      lote: this.selectedLote || undefined,
      numero: this.selectedNumero || undefined
    };

    //this.conferences = await this.storageService.searchConferences(filtro);
    this.conferenceService.getConference(filter).subscribe({
      next: (response: ServiceResult<PhysicalConferenceModel>) => {
        if (response.status) {
          if (response.result?.id === 0) {
            let infoResponse = "Conferência não encontrada para esse conteiner, deseja iniciar uma nova conferência?";
            this.modalService.dismissAll();
            setTimeout(() => {
              Swal.fire({
                title: 'Inicio de Conferência!!!',
                text: infoResponse,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'SIM',
                cancelButtonText: 'NÃO',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.startPhysicalConference();
                } else if (result.dismiss === Swal.DismissReason.cancel) {

                }
              });
            }, 200);
          } else {
            let infoResponse = "Conferência encontrada, abrindo para edição?";
            this.modalService.dismissAll();
            setTimeout(() => {
              Swal.fire({
                title: 'Conferência Encontrada!!!',
                text: infoResponse,
                icon: 'success',
                confirmButtonText: 'OK',
              });
            }, 200);
          }

          this.atualizarFormulario(response.result != null ? response.result : this.conference);
        }
      },
      error: (err) => console.error('Erro na requisição:', err)
    });

    this.conferenceService.updateConference(this.conference);

    // 🔥 Atualiza o formulário com os dados filtrados
    this.atualizarFormulario(this.conferences[0]);

  }

  updatePhysicalConference() {
    let conference = this.conferenceService.getCurrentConference();

    this.conferenceService.updatePhysicalConference(conference).subscribe(((ret: ServiceResult<boolean>) => {
      if (ret.result) {
        this.notificationService.showSuccess(ret);
      } else {
        this.notificationService.showError(ret);
      }
    }))
  }
  /**
   * 🔍 Pesquisa uma conferência específica pelo CPF
   */
  searchByCntr(cntr: string) {
    this.storageService.searchByContainerNumber(cntr).subscribe(conference => {
      if (conference) {
        console.log('Conferência encontrada:', conference);
      } else {
        console.log('Nenhuma conferência encontrada para esse CNTR.');
      }
    });
  }
  //#endregion

  //#region FILTRO AVANCADO
  /**
   * Abre a modal do filtro
   * @param content 
   */
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' });
    this.loadContainers();
  }

  /**
   * Fecha a modal do filtro
   */
  closeModal() {
    this.modalService.dismissAll();
  }
  //#endregion

  //#region Cadastro de Representantes, Operadores e Ajudantes
  abrirModalAjudantes() {
    const modalRef = this.modalService.open(GenericFormComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.titulo = 'AJUDANTES';
    modalRef.componentInstance.frase = 'Cadastro de Ajudantes';
    modalRef.componentInstance.opcoesSelect = ['Ajudante'];
    modalRef.componentInstance.registros = this.ajudantes;

    modalRef.componentInstance.saveEvent.subscribe((reg: any) => {
      let conference = this.conferenceService.getCurrentConference();
      let cadastro = CadastroAdicionalModel.New(conference.id, reg.nome, reg.cpf, reg.qualificacao, "Ajudantes");

      this.saveCadastroAdicional(cadastro).subscribe((result) => {
        if (result) {
          this.ajudantes.push(reg);
        } else {
          console.log('Falha no cadastro.');
        }
      });
    });

    // 🔥 Captura o evento de remoção
    modalRef.componentInstance.removeEvent.subscribe((id: number) => {
      this.excluirCadastroAdicional(id);
    });
  }

  abrirModalOperadores() {
    const modalRef = this.modalService.open(GenericFormComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.titulo = 'OPERADORES';
    modalRef.componentInstance.frase = 'Cadastro de Operadores';
    modalRef.componentInstance.opcoesSelect = ['Operador'];
    modalRef.componentInstance.registros = this.operadores;

    modalRef.componentInstance.saveEvent.subscribe((reg: any) => {
      let conference = this.conferenceService.getCurrentConference();
      console.log('ConferenciaExata: ', conference);
      let cadastro = CadastroAdicionalModel.New(conference.id, reg.nome, reg.cpf, reg.qualificacao, "Representantes");
      this.saveCadastroAdicional(cadastro).subscribe((result) => {
        if (result) {
          this.operadores.push(reg);
        } else {
          console.log('Falha no cadastro.');
        }
      });

    });

    // 🔥 Captura o evento de remoção
    modalRef.componentInstance.removeEvent.subscribe((id: number) => {
      this.excluirCadastroAdicional(id);
    });
  }

  abrirModalRepresentantes() {
    const modalRef = this.modalService.open(GenericFormComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.titulo = 'REPRESENTATES';
    modalRef.componentInstance.frase = 'Cadastro de Representantes';
    modalRef.componentInstance.opcoesSelect = ['Despachante', 'Engenheiro'];
    modalRef.componentInstance.registros = this.representantes;

    modalRef.componentInstance.saveEvent.subscribe((reg: any) => {
      let conference = this.conferenceService.getCurrentConference();
      let cadastro = CadastroAdicionalModel.New(conference.id, reg.nome, reg.cpf, reg.qualificacao, "Representantes");

      this.saveCadastroAdicional(cadastro).subscribe((result) => {
        if (result) {
          this.representantes.push(reg);
        } else {
          console.log('Falha no cadastro.');
        }
      });
    });

    // 🔥 Captura o evento de remoção
    modalRef.componentInstance.removeEvent.subscribe((id: number) => {
      this.excluirCadastroAdicional(id);
    });
  }

  abrirModalDocumentos() {
    const modalRef = this.modalService.open(DocumentosComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.registros = this.documentos;

    this.conferenceService.getTiposDocumentos().subscribe((ret: ServiceResult<TiposDocumentos[]>) => {
      if (ret.status) {
        modalRef.componentInstance.tiposDocumentos = ret.result
      }
    });

    modalRef.componentInstance.saveEvent.subscribe((reg: DocumentosConferencia) => {
      let conference = this.conferenceService.getCurrentConference();
      let cadastro = DocumentosConferencia.New(conference.id, reg.numero, reg.tipo);

      this.saveDocumentoConferencia(cadastro).subscribe((result) => {
        if (result) {
          this.documentos.push(reg);
        } else {
          console.log('Falha no cadastro.');
        }
      });
    });

    modalRef.componentInstance.removeEvent.subscribe((id: number) => {
      this.excluirDocumentoConferencia(id);
    });
  }

  /**
   * Salvar um novo cadastro adicional
   * @param cadastro 
   */
  saveDocumentoConferencia(cadastro: DocumentosConferencia): Observable<boolean> {
    return this.conferenceService.saveDocumentoConferencia(cadastro).pipe(
      map((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
        return ret.status;
      }),
      catchError((error) => {
        this.notificationService.showError(error);
        return of(false);
      })
    );
  }

  /**
   * Chama o metodo de exclusao de documentos da conferencia
   * @param id 
   */
  excluirDocumentoConferencia(id: number): void {

    this.conferenceService.deleteDocumentoConferencia(id).subscribe((ret: ServiceResult<boolean>) => {
      if (ret.status) {
        this.notificationService.showSuccess(ret);
      } else {
        this.notificationService.showAlert(ret);
      }
    });

  }

  /**
   * Chama o metodo que lista os documentos da conferencia
   * @param idConferencia 
   */
  loadDocumentosConferencia(idConferencia: number) {
    this.conferenceService.getDocumentosConferencia(idConferencia).subscribe(((ret: ServiceResult<DocumentosConferencia[]>) => {
      if (ret.status) {
        this.documentos = ret.result || [];
      } else {
        this.notificationService.showAlert(ret);
      }
    }))
  }

  /**
   * Salvar um novo cadastro adicional
   * @param cadastro 
   */
  saveCadastroAdicional(cadastro: CadastroAdicionalModel): Observable<boolean> {
    cadastro.cpf = cadastro.cpf.replace('.', '').replace('-', '');

    return this.conferenceService.saveCadastroAdicional(cadastro).pipe(
      map((ret: ServiceResult<boolean>) => {
        if (ret.status) {
          this.notificationService.showSuccess(ret);
        } else {
          this.notificationService.showAlert(ret);
        }
        return ret.status; // 🔥 Retorna um Observable<boolean>
      }),
      catchError((error) => {
        this.notificationService.showError(error);
        return of(false); // 🔥 Retorna um Observable com `false` em caso de erro
      })
    );
  }

  /**
   * Carregar os cadastros referente a conferencia 
   * @param idConferencia 
   */
  loadCadastrosAdicionais(idConferencia: number) {
    this.conferenceService.getCadastrosAdicionais(idConferencia).subscribe(((ret: ServiceResult<CadastroAdicionalModel[]>) => {
      if (ret.status) {
        this.ajudantes = ret.result?.filter(x => x.qualificacao === "Ajudante") || [];
        this.representantes = ret.result?.filter(x => x.qualificacao === "Engenheiro" || x.qualificacao === "Despachante") || [];
        this.operadores = ret.result?.filter(x => x.qualificacao === "Operador") || [];
      } else {
        this.notificationService.showAlert(ret);
      }
    }))
  }

  /**
   * Chama o metodo de exclusao de cadastro adicional
   * @param id 
   */
  excluirCadastroAdicional(id: number): void {

    this.conferenceService.deleteCadastroAdicional(id).subscribe((ret: ServiceResult<boolean>) => {
      if (ret.status) {
        this.notificationService.showSuccess(ret);
      } else {
        this.notificationService.showAlert(ret);
      }
    });

  }


  //#endregion
}
