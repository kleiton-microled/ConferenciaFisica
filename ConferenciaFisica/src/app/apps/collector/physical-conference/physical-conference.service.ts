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
  private apiUrl = 'https://localhost:5000/api/Conferencia';

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

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

    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conteineres`).pipe(
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
  
  getTipoLacres(): Observable<ServiceResult<TipoLacre[]>> {
    this.notificationService.showLoading();

    return this.http.get<ServiceResult<TipoLacre[]>>(`${this.apiUrl}/tipos-lacres`).pipe(
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
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/buscar?cntr=${filter.conteiner}`).pipe(
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

    return this.http.post<ServiceResult<any>>(`${this.apiUrl}/iniciar-conferencia`, conference).pipe(
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

  updatePhysicalConference(conference: PhysicalConferenceModel): Observable<ServiceResult<boolean>> {
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/atualizar-conferencia`, conference).pipe(
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


  getCadastrosAdicionais(idConferencia: number): Observable<ServiceResult<CadastroAdicionalModel[]>> {
    this.notificationService.showLoading();
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/carregar-cadastros-adicionais?idConferencia=${idConferencia}`).pipe(
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
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/cadastro-adicional`, cadastro).pipe(
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

  deleteCadastroAdicional(id: number): Observable<ServiceResult<boolean>> {
    return this.http.delete<ServiceResult<boolean>>(`${this.apiUrl}/excluir-cadastro-adicional?id=${id}`,).pipe(
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
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/cadastro-lacres-conferencia`, lacre).pipe(
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
    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/lacres-conferencia?idConferencia=${idConferencia}`).pipe(
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
    return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/atualizar-lacre-conferencia`, conference).pipe(
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
    return this.http.delete<ServiceResult<boolean>>(`${this.apiUrl}/excluir-lacre-conferencia?id=${id}`,).pipe(
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
  getCurrentConference(): PhysicalConferenceModel{
    return this.conferenceSubject.value;
  }

  /**
   * Atualiza a conferência, notificando todos os inscritos.
   */
  updateConference(conference: PhysicalConferenceModel) {
    const updatedConference = { ...conference };
    this.conferenceSubject.next(updatedConference);
  }

  /**
   * Reseta a conferência para null.
   */
  // clearConference(): void {
  //   this.conferenceSubject.next(null);
  // }

  //#endregion
}
