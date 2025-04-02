import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, map, Observable, throwError } from "rxjs";
import { BaseService } from "src/app/Http/base-service";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Marcante } from "./models/marcante.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ColetorService extends BaseService<any> {

    private urlApi = "";
    constructor(http: HttpClient, private configService: ConfigService, private notificationService: NotificationService) {
        super(http, configService.getConfig('COLETOR_URL_SERVICE'));

        this.urlApi = configService.getConfig('COLETOR_URL_SERVICE');
    }

    /**
     * 
     * @param term 
     * @returns Marcante[]
     */
    getMarcantes(term: string): Observable<Marcante[]> {
        return this.http.get<Marcante[]>(`${this.urlApi}/marcantes?termo=${term}`).pipe(
            map(response => {
                if (!response) {
                    this.notificationService.showAlert(response);
                    throw new Error('Erro');
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