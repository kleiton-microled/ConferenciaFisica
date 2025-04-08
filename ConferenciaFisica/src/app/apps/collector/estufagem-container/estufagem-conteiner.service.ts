import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { BaseService } from "src/app/Http/base-service";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Planejamento } from "./planejamento.model";
import { ItensEstufados } from "./itens-estufados.model";
import { Etiquetas } from "./etiquetas.model";
import { ConferenteModel } from "../models/conferente.model";
import { SaldoCargaMarcante } from "./model/saldo-carga-marcante.model";
import { Talie } from "../models/talie.model";
@Injectable({
    providedIn: 'root'
})
export class EstufagemConteinerService extends BaseService<any> {
    private apiUrl = "";
    private planejamentoSub = new BehaviorSubject<Planejamento | null>(null);

    constructor(http: HttpClient, private configService: ConfigService, private notificationService: NotificationService) {
        super(http, configService.getConfig('ESTUFAGEM_CONTEINER_URL'));

        this.apiUrl = configService.getConfig('ESTUFAGEM_CONTEINER_URL');
    }

    getPlanejamentoAtual(): Observable<Planejamento | null> {
        return this.planejamentoSub.asObservable();
    }

    updatePlanejamentoAtual(plan: Planejamento | null): void {
        this.planejamentoSub.next(plan);
    }

    /**
     * 
     * @param filter 
     * @returns Planejamento
     */
    getPlanejamento(filter: { planejamento?: string }): Observable<ServiceResult<Planejamento>> {
        this.notificationService.showLoading();
        const params = new HttpParams({
            fromObject: {
                ...(filter.planejamento ? { planejamento: filter.planejamento } : {})
            }
        });

        return this.http.get<ServiceResult<Planejamento>>(`${this.apiUrl}/planejamento?`, { params }).pipe(
            map(response => {
                if (!response.status) {
                    this.notificationService.showError(response);
                    throw new Error(response.error || 'Erro desconhecido');
                } else {
                    if (response.status && response.result) {
                        const planejamento: Planejamento = {
                            cliente: response.result?.cliente,
                            reserva: response.result.reserva,
                            conteiner: response.result.conteiner,
                            inicio: response.result.inicio,
                            termino: response.result.termino,
                            conferente: response.result.conferente,
                            equipe: response.result.equipe,
                            operacao: response.result.operacao,
                            autonumRo: response.result.autonumRo,
                            autonumBoo: response.result.autonumBoo,
                            autonumPatio: response.result.autonumPatio,
                            autonumTalie: response.result.autonumTalie,
                            yard: response.result.yard,
                            possuiMarcantes: response.result.possuiMarcantes,
                            qtdePlanejada: response.result.qtdePlanejada,
                            plan: response.result.plan,
                            ttl: response.result.ttl,
                            talieItem: [],
                            id: 0,
                            observacao: ''
                        }
                        this.planejamentoSub.next(planejamento);
                    }
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
     * 
     * @param patio 
     * @returns ItensEstufados[]
     */
    getItensEstufados(patio: number): Observable<ServiceResult<ItensEstufados[]>> {
        return this.http.get<ServiceResult<ItensEstufados[]>>(`${this.apiUrl}/itens-estufados?patio=${patio}`).pipe(
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
     * 
     * @param planejamento 
     * @returns Etiquetas[]
     */
    getEtiquetas(planejamento: string): Observable<ServiceResult<Etiquetas[]>> {
        return this.http.get<ServiceResult<Etiquetas[]>>(`${this.apiUrl}/etiquetas?planejamento=${planejamento}`).pipe(
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
     * 
     * @param planejamento 
     * @param codigoMarcante 
     * @returns SaldoCargaMarcante
     */
    getSaldoCargaMarcante(planejamento: number, codigoMarcante: string): Observable<ServiceResult<SaldoCargaMarcante>> {
        return this.http.get<ServiceResult<SaldoCargaMarcante>>(`${this.apiUrl}/saldo-carga-marcante?planejamento=${planejamento}&codigoMarcante=${codigoMarcante}`).pipe(
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
     * 
     * @param data Talie
     * @returns boolean
     */
    postIniciarEstufagem(data: Talie): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/iniciar-estufagem`, data).pipe(
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
     * TODO - Preciso entender como estufar uma carga
     * @returns boolean
     */
    getEstufar(): Observable<ServiceResult<boolean>> {
        return this.http.get<ServiceResult<boolean>>(`${this.apiUrl}/estufar`).pipe(
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
     * 
     * @param data Talie
     * @returns boolean
     */
    postFinalizar(data: Talie): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.apiUrl}/finalizar`, data).pipe(
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
}