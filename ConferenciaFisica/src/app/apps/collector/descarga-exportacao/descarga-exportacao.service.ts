import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DescargaExportacao } from "./models/descarga-exportacao.model";
import { BaseService } from "src/app/Http/base-service";
import { DESCARGA_EXPORTACAO_URL } from "src/app/Http/Config/config";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { Talie } from "../models/talie.model";
import { AvariaDescarga } from "./models/avaria-descarga.model";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { NotificationService } from "src/app/shared/services/notification.service";

@Injectable({
    providedIn: 'root'
})
export class DescargaExportacaoService extends BaseService<DescargaExportacao> {

    private descargaSubject = new BehaviorSubject<DescargaExportacao | null>(null);

    constructor(http: HttpClient, private notificationService: NotificationService) {
        super(http, DESCARGA_EXPORTACAO_URL);
    }

    // Obtém o estado atual da DescargaExportacao
    getCurrentDescarga(): Observable<DescargaExportacao | null> {
        return this.descargaSubject.asObservable();
    }

    // Atualiza o objeto no Subject
    updateDescarga(descarga: DescargaExportacao | null): void {
        this.descargaSubject.next(descarga);
    }

    // Inicia um novo objeto padrão
    iniciarDescarga(): void {
        const novaDescarga: DescargaExportacao = {
            registro: 0,
            talie: null,
            placa: '',
            reserva: '',
            cliente: ''
        };
        this.descargaSubject.next(novaDescarga);
    }

    // Remove o estado atual
    limparDescarga(): void {
        this.descargaSubject.next(null);
    }

    // Deleta a descarga e reseta o Subject
    deletarDescarga(): void {
        this.descargaSubject.next(null);
    }



    /**
     * CAdastro de avaria 
     * @param data 
     * @returns 
     */
    saveAvaria(data: AvariaDescarga): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${DESCARGA_EXPORTACAO_URL}/cadastrar-avaria`, data).pipe(
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
     * Cria o talie ou atualiza
     * @param data 
     * @returns 
     */
    saveDescargaExportacao(data: DescargaExportacao | null): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${DESCARGA_EXPORTACAO_URL}/gravar-talie`, data).pipe(
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