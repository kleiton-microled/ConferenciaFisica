import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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
import { LotesAgendamentoModel } from './models/lotes.model';

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
  //private apiUrl = 'https://localhost:5000/api';
  private apiUrl = "";//AppUrls.CONFERENCIA_FISICA;

  constructor(private http: HttpClient, private configService: ConfigService,
    private notificationService: NotificationService) {
    this.apiUrl = this.configService.getConfig('CONFERENCIA_FISICA_URL');
  }

  private conferenceSubject = new BehaviorSubject<PhysicalConferenceModel>(new PhysicalConferenceModel());


  /**
   * SUBSCRIPTION REGION
   */
  /**
 * Obtem a conferencia atual iniciada
 */
  getCurrentConference(): Observable<PhysicalConferenceModel> {
    return this.conferenceSubject.asObservable();
  }

  /**
   * Atualiza a conferencia atual
   */
  // updateConference(conference: PhysicalConferenceModel): void {
  //   this.conferenceSubject.next(conference);
  // }

  updateConference(conferencePartial: Partial<PhysicalConferenceModel>): void {
    const current = this.conferenceSubject.getValue();

    if (current) {
      const updated = Object.assign(new PhysicalConferenceModel(), current, conferencePartial);
      this.conferenceSubject.next(updated);
    } else {
      this.conferenceSubject.next(new PhysicalConferenceModel(conferencePartial));
    }
  }

  /**
   * Inicia uma nova conferencia com valores padrões
   */
  iniciarConferencia(): void {
    const novaConferencia = new PhysicalConferenceModel();
    this.conferenceSubject.next(novaConferencia);
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
   * Tras uma lista de lotes agendados
   * @returns LotesAgendamentoModel[]
   */
  getLotes(): Observable<ServiceResult<LotesAgendamentoModel[]>> {
    this.notificationService.showLoading(); // Mostra loading

    return this.http.get<ServiceResult<LotesAgendamentoModel[]>>(`${this.apiUrl}/conferencia/lotes`).pipe(
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

    // Construção dinâmica dos parâmetros
    const params = new HttpParams({
      fromObject: {
        ...(filter.conteiner ? { cntr: filter.conteiner } : {}),
        ...(filter.lote ? { lote: filter.lote } : {}),
        ...(filter.numero ? { numero: filter.numero } : {})
      }
    });

    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/buscar`, { params }).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        } else {
          const novaConferencia = response.result;
          this.conferenceSubject.next(novaConferencia);
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
   * Busca a conferencia pelo ID
   * @param id 
   * @returns 
   */
  getConferencePorId(id: number): Observable<ServiceResult<PhysicalConferenceModel>> {
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conferencia/buscar-por-id?id=${id}`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        } else {
          const novaConferencia = response.result;
          this.conferenceSubject.next(novaConferencia);
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error);
        return throwError(() => error);
      }),
      finalize(() => null)
    );
  }

  /**
   * Inicia a conferencia fisica do conteiner
   * @param conference 
   * @returns 
   */
  startConference(conference: PhysicalConferenceModel | null): Observable<ServiceResult<boolean>> {
    this.notificationService.showLoading();

    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/iniciar-conferencia`, conference).pipe(
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

  /**
   * realiza um update na avaria
   * @param data 
   * @returns 
   */
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
   * Finaliza a conferencia setando uma data de termino
   * @param idConferencia 
   * @returns 
   */
  getFinalizarConferencia(idConferencia: number): Observable<ServiceResult<boolean>> {
    return this.http.get<ServiceResult<boolean>>(`${this.apiUrl}/conferencia/finalizar-conferencia?idConferencia=${idConferencia}`).pipe(
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
