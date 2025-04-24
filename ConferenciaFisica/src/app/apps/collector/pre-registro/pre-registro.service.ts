import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/Http/base-service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Patio } from "./models/patio.model";
import { PRE_REGISTRO_URL } from "src/app/Http/Config/config";
import { Observable } from "rxjs";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, finalize, map, throwError } from "rxjs";
import { an } from "@fullcalendar/core/internal-common";

@Injectable({
    providedIn: 'root'
})

export class PreRegistroService extends BaseService<Patio> {

    constructor(http: HttpClient, private notificationService: NotificationService) {
        super(http, PRE_REGISTRO_URL);
    }


    postBuscarRegistro(input: any): Observable<ServiceResult<any>> {
        return this.http.post<ServiceResult<any>>(`${PRE_REGISTRO_URL}/dados-agendamento`, input).pipe(
            map(response => {
                if (response && !response.status) {
                    this.notificationService.showError(response);
                }
                return response;
            }),
            catchError((error: Error) => {
                this.notificationService.showError(error);
                return throwError(() => error);
            }),
            finalize(() => this.notificationService.hideLoading())
        );
    }

    postRegistrarSaida(input: any): Observable<ServiceResult<any>> {
        console.log(input);
        return this.http.post<ServiceResult<any>>(`${PRE_REGISTRO_URL}/registrar-sem-agendamento`, input).pipe(
            map(response => {
                if (response && !response.status) {
                    this.notificationService.showError(response);
                }
                return response;
            }),
            catchError((error: Error) => {
                this.notificationService.showError(error);
                return throwError(() => error);
            }),
            finalize(() => this.notificationService.hideLoading())
        );
    }

}