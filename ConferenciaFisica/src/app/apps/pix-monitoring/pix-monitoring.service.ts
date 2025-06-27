import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { BaseService } from "src/app/Http/base-service";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { TotalPix } from "./model/total-pix.model";
import { PixModel } from "./model/pix.model";

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
     * 
     * @returns PixModel[]
     */
    list(): Observable<ServiceResult<PixModel[]>> {
        return this.http.get<ServiceResult<PixModel[]>>(`${this.urlApi}/list`).pipe(
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

}