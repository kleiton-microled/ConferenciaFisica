import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { BaseService } from "src/app/Http/base-service";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { TotalPix } from "./model/total-pix.model";
import { PixModel } from "./model/pix.model";
import { PixPaginatedResult } from "./model/pix-paginated-result.model";

@Injectable({
    providedIn: 'root'
})
export class PixMonitoringService extends BaseService<any> {

    private urlApi = "";

    constructor(http: HttpClient, private configService: ConfigService, private notificationService: NotificationService) {
        super(http, configService.getConfig('PIX_MONITORING_URL'));
        this.urlApi = configService.getConfig('PIX_MONITORING_URL');
    }

    /**
     * 
     * @returns TotalPix
     */
    getTotals(): Observable<ServiceResult<TotalPix>> {
        return this.http.get<ServiceResult<TotalPix>>(`${this.urlApi}/total`).pipe(
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
     * Busca o total de PIX ativos
     * @returns Observable<ServiceResult<number>>
     */
    getTotalPixAtivos(): Observable<ServiceResult<number>> {
        return this.http.get<ServiceResult<number>>(`${this.urlApi}/get-total-pix-ativos`).pipe(
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
     * Busca o total de PIX pagos
     * @returns Observable<ServiceResult<number>>
     */
    getTotalPixPagos(): Observable<ServiceResult<number>> {
        return this.http.get<ServiceResult<number>>(`${this.urlApi}/get-total-pix-pagos`).pipe(
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
     * Busca o total de PIX cancelados
     * @returns Observable<ServiceResult<number>>
     */
    getTotalPixCancelados(): Observable<ServiceResult<number>> {
        return this.http.get<ServiceResult<number>>(`${this.urlApi}/get-total-pix-cancelados`).pipe(
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
     * Lista PIX com paginação
     * @param pageNumber Número da página (padrão: 1)
     * @param pageSize Tamanho da página (padrão: 25)
     * @returns ServiceResult<PixPaginatedResult>
     */
    listWithPagination(pageNumber: number = 1, pageSize: number = 25): Observable<ServiceResult<PixPaginatedResult>> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<ServiceResult<PixPaginatedResult>>(`${this.urlApi}/list-all-pix`, { params }).pipe(
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
     * Lista PIX (método legado para compatibilidade)
     * @returns PixModel[]
     */
    list(): Observable<ServiceResult<PixModel[]>> {
        return this.listWithPagination(1, 25).pipe(
            map(response => {
                if (response.result) {
                    return {
                        status: response.status,
                        mensagens: response.mensagens,
                        error: response.error,
                        result: response.result.data
                    };
                }
                return {
                    status: response.status,
                    mensagens: response.mensagens,
                    error: response.error,
                    result: []
                };
            })
        );
    }
}