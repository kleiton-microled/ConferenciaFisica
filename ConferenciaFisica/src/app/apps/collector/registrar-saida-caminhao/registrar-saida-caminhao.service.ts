import { Injectable } from "@angular/core";
import { BaseService } from "src/app/Http/base-service";
import { RegistrarSaidaCaminhaoInfoCaminhao } from "./models/registrar-saida-caminhao-info-caminhao.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { RegistrarSaidaCaminhao } from "./models/registrar-saida-caminha";


@Injectable({
    providedIn: 'root'
})
export class RegistrarSaidaCaminhaoService extends BaseService<RegistrarSaidaCaminhaoInfoCaminhao> {
    private urlApi = "";
    constructor(http: HttpClient, private configService: ConfigService, private notificationService: NotificationService) {
        super(http, configService.getConfig('SAIDA_CAMINHAO_URL'));

        this.urlApi = configService.getConfig('SAIDA_CAMINHAO_URL');
    }

    getInformacaoCaminhao(protocolo:string, ano: string, placa: string, placaCarreta: string, patio: number): Observable<ServiceResult<RegistrarSaidaCaminhaoInfoCaminhao>> {
        return this.http.get<ServiceResult<RegistrarSaidaCaminhaoInfoCaminhao>>(`${this.urlApi}?protocolo=${protocolo}&ano=${ano}&placa=${placa}&placaCarreta=${placaCarreta}&patio=${patio}`).pipe(
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

    postRegistrarSaida(input: RegistrarSaidaCaminhao): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}`,input).pipe(
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