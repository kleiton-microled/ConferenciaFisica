import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { BaseService } from "src/app/Http/base-service";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { MovimentacaoCargaSolta } from "./carga.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class MovimentacaoCargaSoltaService extends BaseService<any> {
    private urlApi = "";
    private cargaSubject = new BehaviorSubject<MovimentacaoCargaSolta | null>(null);

    constructor(http: HttpClient,
        private configService: ConfigService,
        private notificationService: NotificationService) {
        super(http, configService.getConfig('MOVIMENTACAO_CARGA_SOLTA_URL'));

        this.urlApi = configService.getConfig('MOVIMENTACAO_CARGA_SOLTA_URL');
    }

    // Obtém o estado atual da DescargaExportacao
    getCargaAtual(): Observable<MovimentacaoCargaSolta | null> {
        return this.cargaSubject.asObservable();
    }

    // Atualiza o objeto no Subject
    updateCarga(carga: MovimentacaoCargaSolta | null): void {
        this.cargaSubject.next(carga);
    }

    // Inicia um novo objeto padrão
    iniciarDescarga(): void {
        const novaCarga: MovimentacaoCargaSolta = {
            idMarcante: 0,
            numeroMarcante: '--',
            registro: '--',
            armazem: 0,
            local: '--',
            lote: '--',
            etiquetaPrateleira: '--',
            notaFiscal: '--',
            quantidade: 0,
            embalagem: '--',
            anvisa: '--',
            reserva: '--',
            imo: '--',
            uno: '--'
        };
        this.cargaSubject.next(novaCarga);
    }

    // Remove o estado atual
    limparDescarga(): void {
        this.cargaSubject.next(null);
    }

    // Deleta a descarga e reseta o Subject
    deletarDescarga(): void {
        this.cargaSubject.next(null);
    }

    /**
     * 
     * @param talieItemId 
     * @returns MovimentacaoCargaSolta
     */
    getCargaParaMovimentacao(talieItemId: number): Observable<ServiceResult<MovimentacaoCargaSolta>> {
        return this.http.get<ServiceResult<MovimentacaoCargaSolta>>(`${this.urlApi}?idMarcante=${talieItemId}`).pipe(
            map(response => {
                // if (!response.status) {
                //     this.notificationService.showAlert(response);
                //     //throw new Error(response.error || 'Erro desconhecido');
                // }
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
     * @param data 
     * @returns boolean
     */
    movimentarCargaSolta(data: MovimentacaoCargaSolta): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}/movimentar`, data).pipe(
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