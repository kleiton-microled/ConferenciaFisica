import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize, map, Observable, of, throwError } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { CONTEINERS, LOTES } from './mock/data';
import { PhysicalConferenceModel } from './models/physical-conference.model';
import { CadastroAdicionalModel } from './models/cadastro-adicional.model';
import { TipoLacre } from './models/tipo-lacre.model';
import { LacresModel } from './models/lacres.model';
import { TiposDocumentos } from './models/tipos-documentos.model';
import { DocumentosConferencia } from './models/documentos-conferencia.model';
import { TiposAvarias } from 'src/app/shared/avarias/tipos-avarias.model';
import { AvariaConferencia } from './models/avaria.model';
import { TiposEmbalagens } from './models/tipos-embalagens.model';
import { ConfigService } from 'src/app/shared/services/config.service';

export interface ConferenceContainer {
  display: string;
  autonum: string;
}

export interface ConferenceLotes {
  display: string;
  autonum: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicalConferenceService {
  //private apiUrl = 'https://api-conferenciafisicadev.bandeirantesdeicmar.com.br/api';
  private apiUrl = "";//AppUrls.CONFERENCIA_FISICA;

  constructor(private http: HttpClient, private configService: ConfigService,
    private notificationService: NotificationService) {
      this.apiUrl = this.configService.getConfig('CONFERENCIA_FISICA_URL');
  }

  /**
   * 🔥 Método que retorna os dados mockados de containers
   */
  getMockContainers(): Observable<ServiceResult<ConferenceContainer[]>> {
    console.warn('🚨 Sem conexão com a API, utilizando dados mockados.');
    return of({
      status: true,
      mensagens: ['Dados mockados carregados com sucesso.'],
      error: null,
      result: CONTEINERS
    } as ServiceResult<ConferenceContainer[]>);
  }

  /**
   * 🔥 Método que retorna os dados mockados de containers
   */
  getMockLotes(): Observable<ServiceResult<ConferenceLotes[]>> {
    console.warn('🚨 Sem conexão com a API, utilizando dados mockados.');
    return of({
      status: true,
      mensagens: ['Dados mockados carregados com sucesso.'],
      error: null,
      result: LOTES
    } as ServiceResult<ConferenceLotes[]>);
  }

  /**
   * Busca os contêineres agendados para conferência.
   * @param filtro (opcional) Filtro de busca
   * @returns Observable<ConferenceContainer[]>
   */
  getContainers(): Observable<ServiceResult<any>> {
    this.notificationService.showLoading(); // Mostra loading

    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/conteineres`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showAlert(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error); // Exibe erro no SweetAlert
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading()) // Fecha loading corretamente
    );
  }

  /**
   * Carrega os tipos de lacres
   * @returns 
   */
  getTipoLacres(): Observable<ServiceResult<TipoLacre[]>> {
    this.notificationService.showLoading();

    return this.http.get<ServiceResult<TipoLacre[]>>(`${this.apiUrl}/conferencia/tipos-lacres`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showAlert(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Busca a conferencia.
   * @param filtro (opcional) Filtro de busca
   * @returns Observable<ConferenceContainer[]>
   */
  getConference(filter: { conteiner?: string; lote?: string; numero?: string }): Observable<ServiceResult<PhysicalConferenceModel>> {
    this.notificationService.showLoading();
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/buscar?cntr=${filter.conteiner}`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error); // Exibe erro no SweetAlert
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading()) // Fecha loading corretamente
    );
  }

  /**
   * Inicia a conferencia fisica do conteiner
   * @param conference 
   * @returns 
   */
  startConference(conference: PhysicalConferenceModel | null): Observable<ServiceResult<any>> {
    this.notificationService.showLoading();

    return this.http.post<ServiceResult<any>>(`${this.apiUrl}/conferencia/iniciar-conferencia`, conference).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Atualiza a conferencia
   * @param conference 
   * @returns 
   */
  updatePhysicalConference(conference: PhysicalConferenceModel): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/atualizar-conferencia`, conference).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Lista os cadastros adicionais da conferencia - Ajudantes...
   * @param idConferencia 
   * @returns 
   */
  getCadastrosAdicionais(idConferencia: number): Observable<ServiceResult<CadastroAdicionalModel[]>> {
    this.notificationService.showLoading();
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/carregar-cadastros-adicionais?idConferencia=${idConferencia}`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Chama o metodo de persistencia de dados na API
   * @param cadastro 
   * @returns 
   */
  saveCadastroAdicional(cadastro: CadastroAdicionalModel): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/cadastro-adicional`, cadastro).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Exclui cadastro adicional
   * @param id 
   * @returns 
   */
  deleteCadastroAdicional(id: number): Observable<ServiceResult<boolean>> {
    return this.http.delete<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/excluir-cadastro-adicional?id=${id}`,).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  //#region Lacres da Conferencia

  /**
   * Adiciona um novo lacre a conferencia
   * @param lacre 
   * @returns 
   */
  saveLacreConferencia(lacre: LacresModel): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/cadastro-lacres-conferencia`, lacre).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Lista de lacres da conferencia
   * @param idConferencia 
   * @returns 
   */
  getLacresConferencia(idConferencia: number): Observable<ServiceResult<LacresModel[]>> {
    this.notificationService.showLoading();
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/lacres-conferencia?idConferencia=${idConferencia}`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Atualiza um lacre da conferencia
   * @param conference 
   * @returns 
   */
  updateLacreConferencia(conference: LacresModel): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/atualizar-lacre-conferencia`, conference).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Exclui um lacre da conferencia
   * @param id 
   * @returns 
   */
  deleteLacreConferencia(id: number): Observable<ServiceResult<boolean>> {
    return this.http.delete<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/excluir-lacre-conferencia?id=${id}`,).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Lista os tipos de documentos
   * @returns ServiceResult<TiposDocumentos[]>
   */
  getTiposDocumentos(): Observable<ServiceResult<TiposDocumentos[]>> {
    this.notificationService.showLoading();

    return this.http.get<ServiceResult<TiposDocumentos[]>>(`${this.apiUrl}/tipos-documentos/listar`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showAlert(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Lista os documentos atrelados a conferencia
   * @param idConferencia 
   * @returns ServiceResult<DocumetosConferencia[]
   */
  getDocumentosConferencia(idConferencia: number): Observable<ServiceResult<DocumentosConferencia[]>> {
    this.notificationService.showLoading();
    return this.http.get<ServiceResult<DocumentosConferencia[]>>(`${this.apiUrl}/conferencia/documentos-conferencia?idConferencia=${idConferencia}`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Cadastra um novo documento a conferencia
   * @param lacre 
   * @returns bool
   */
  saveDocumentoConferencia(data: DocumentosConferencia): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/cadastro-documento-conferencia`, data).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Atualiza um documento da conferencia
   * @param conference 
   * @returns bool
   */
  updateDocumentosConferencia(conference: DocumentosConferencia): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/atualizar-documento-conferencia`, conference).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Exclui um documento da conferencia
   * @param id 
   * @returns bool
   */
  deleteDocumentoConferencia(id: number): Observable<ServiceResult<boolean>> {
    return this.http.delete<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/excluir-documento-conferencia?id=${id}`,).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  //#region Subscribe PhysicalConference

  private conferenceSubject = new BehaviorSubject<PhysicalConferenceModel>(new PhysicalConferenceModel);

  /**
   * Obtém a conferência atual como um Observable, permitindo que outros componentes se inscrevam.
   */
  getConference$(): Observable<PhysicalConferenceModel> {
    return this.conferenceSubject.asObservable();
  }

  // Método para obter a conference atual sem Observable
  getCurrentConference(): PhysicalConferenceModel {
    return this.conferenceSubject.value;
  }

  /**
   * Atualiza a conferência, notificando todos os inscritos.
   */
  updateConference(conference: PhysicalConferenceModel) {
    const updatedConference = { ...conference };
    this.conferenceSubject.next(updatedConference);
  }

  //EMBALAGENS

  /**
   * Carrega os tipos de embalagens
   * @returns 
   */
  getTiposEmbalagens(): Observable<ServiceResult<TiposEmbalagens[]>> {
    this.notificationService.showLoading();

    return this.http.get<ServiceResult<TiposEmbalagens[]>>(`${this.apiUrl}/embalagens/listar`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showAlert(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  //AVARIAS
  /**
   * Lista todos os tipos disponiveis de Avarias
   * @returns TiposAvarias[]
   */
  getTiposAvarias(): Observable<ServiceResult<TiposAvarias[]>> {
    this.notificationService.showLoading();

    return this.http.get<ServiceResult<TiposAvarias[]>>(`${this.apiUrl}/avarias/tipos-listar`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showAlert(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }

  /**
   * Carrega as avarias da conferencia
   * @param idConferencia 
   * @returns AvariaConferencia
   */
  getAvariaConferencia(idConferencia: number): Observable<ServiceResult<AvariaConferencia>> {
    //this.notificationService.showLoading();
    return this.http.get<ServiceResult<AvariaConferencia>>(`${this.apiUrl}/avarias/avarias-conferencia?idConferencia=${idConferencia}`).pipe(
      map(response => {
        if (!response.status && response.error) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => '')
    );
  }

  saveAvariaConferencia(data: AvariaConferencia): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/avarias/cadastrar-avaria`, data).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading())
    );
  }
  /**
   * Reseta a conferência para null.
   */
  // clearConference(): void {
  //   this.conferenceSubject.next(null);
  // }

  //#endregion
}
