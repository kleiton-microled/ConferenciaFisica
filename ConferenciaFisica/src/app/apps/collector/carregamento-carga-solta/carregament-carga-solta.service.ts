import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/Http/base-service";
import { DESCARGA_UTIL_URL } from "src/app/Http/Config/config";
import { BehaviorSubject, catchError, finalize, map, Observable, throwError } from "rxjs";
import { Talie } from "../models/talie.model";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { NotificationService } from "src/app/shared/services/notification.service";
import { TalieItem } from "../models/talie-item.model";
import { Armazen } from "../models/armazens.model";
import { Marcante } from "../models/marcante.model";
import { EnumValue } from "src/app/shared/models/enumValue.model";
import { Foto } from "src/app/shared/microled-photos/microled-photos.component";
import { ConfigService } from "src/app/shared/services/config.service";
import { Yard } from "../models/yard.model";
import { CarregamentoCargaSoltaModel } from "./models/carregamento-carga-solta.model";
import { ItensCargaModel } from "./models/itens-carga.model";

@Injectable({
    providedIn: 'root'
})
export class CarregamentoCargaSoltaService extends BaseService<CarregamentoCargaSoltaModel> {

    private descargaSubject = new BehaviorSubject<CarregamentoCargaSoltaModel | null>(null);
    private urlApi = "";


    constructor(http: HttpClient, private configService: ConfigService, private notificationService: NotificationService) {
        super(http, configService.getConfig('DESCARGA_CARGA_SOLTA_URL'));

        this.urlApi = configService.getConfig('DESCARGA_CARGA_SOLTA_URL');
    }



    // Obtém o estado atual da DescargaExportacao
    getCurrentDescarga(): Observable<CarregamentoCargaSoltaModel | null> {
        return this.descargaSubject.asObservable();
    }

    getByMarcante(marcante: string, local: string, placa:string): Observable<ServiceResult<any>> {
        let patio = 7;
        return this.http.get<ServiceResult<ItensCargaModel>>(`${this.urlApi}/buscar?marcante=${marcante}&patio=${patio}&local=${local}&placa=${placa}`).pipe(
            map(response => {
                if (!response.status) {
                    // this.notificationService.showAlert(response);
                    throw new Error(response.error || 'Erro desconhecido');
                }
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                // this.notificationService.showError(error);
                return throwError(() => error);
            }),
            finalize(() => this.notificationService.hideLoading())
        );
    }

    getOrdensByMarcante( placa:string): Observable<ServiceResult<ItensCargaModel>> {
        let patio = 7;
        return this.http.get<ServiceResult<ItensCargaModel>>(`${this.urlApi}/ordens?patio=${patio}&veiculo=${placa}'`).pipe(
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

    postByMarcante(marcante: string, local: string, placa:string): Observable<ServiceResult<ItensCargaModel>> {
        let patio = 7;
        return this.http.get<ServiceResult<ItensCargaModel>>(`${this.urlApi}/buscar?marcante=${marcante}&patio=${patio}&local=${local}&placa=${placa}`).pipe(
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

    getVeiculos(): Observable<ServiceResult<EnumValue[]>> {
        let patio = 2;
        return this.http.get<ServiceResult<EnumValue[]>>(`${this.urlApi}/veiculos?patio=${patio}`).pipe(
            map(response => {
                if (!response.status) {
                    throw new Error(response.error || 'Erro desconhecido');
                }
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            }),
            finalize(() => this.notificationService.hideLoading())
        );    }



    // Atualiza o objeto no Subject
    updateDescarga(descarga: CarregamentoCargaSoltaModel | null): void {
        this.descargaSubject.next(descarga);
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
     * Cadastra ou atualiza o talie item na base
     * @param data 
     * @returns bool
     */
    saveTalieItem(data: TalieItem, registro: number): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}/salvar-talie-item?registro=${registro}`, data).pipe(
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
     * Exclui um item do talie
     * @param id 
     * @returns 
     */
    deleteTalieItem(id: number, registro: number, notaFiscal: string): Observable<ServiceResult<boolean>> {
        return this.http.delete<ServiceResult<boolean>>(`${this.urlApi}/excluir-talie-item/${registro}?talieItemId=${id}&notaFiscal=${notaFiscal}`,).pipe(
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
     * Salva a observacao do Talie
     * @param observacao 
     * @param talieId 
     * @returns 
     */
    saveObservacao(observacao: string, talieId: number): Observable<ServiceResult<boolean>> {
        const url = `${this.urlApi}/gravar-observacao?observacao=${encodeURIComponent(observacao)}&talieId=${talieId}`;

        return this.http.post<ServiceResult<boolean>>(url, null).pipe(
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
     * Lista os armazens do patio
     * @param patio 
     * @returns 
     */
    getArmazens(patio: number = 1): Observable<ServiceResult<Armazen[]>> {
        return this.http.get<ServiceResult<Armazen[]>>(`${this.urlApi}/carregar-armazens?patio=${patio}`).pipe(
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
     * Metodo utilizado para input with select, pois ele traz o resultado de acordo com o que é digitado
     * @param term 
     * @returns 
     */
    getYard(term: string): Observable<Yard[]> {
        return this.http.get<Yard[]>(`${this.urlApi}/locais?termo=${term}`).pipe(
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

    /**
     * Associa um marcante ao talie e talie item
     * @param data 
     * @returns 
     */
    saveMarcante(data: Marcante): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}/gravar-marcante`, data).pipe(
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
     * Carrega os marcantes associados ao talie item
     * @param talieItemId 
     * @returns 
     */
    getMarcanteTaliItem(talieItemId: number): Observable<ServiceResult<Marcante[]>> {
        return this.http.get<ServiceResult<Marcante[]>>(`${this.urlApi}/carregar-marcantes-talie-item?talieItemId=${talieItemId}`).pipe(
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
     * Retira a associacao do Marcante dentro do talie item
     * @param id 
     * @returns bool
     */
    deleteMarcanteTalieItem(id: number): Observable<ServiceResult<boolean>> {
        return this.http.delete<ServiceResult<boolean>>(`${this.urlApi}/excluir-marcante-talie-item/?id=${id}`,).pipe(
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
     * Finalizar processo de descarga
     * @param data 
     * @returns 
     */
    getFinalizarProcesso(talieId: number, crossdock: boolean, usuario: string = '', container: number | null = null): Observable<ServiceResult<boolean>> {
        return this.http.get<ServiceResult<boolean>>(`${this.urlApi}/finalizar-processo`, {
            params: {
                id: talieId.toString(),
                crossdock: crossdock.toString(),
                usuario: usuario,
                container: container ?? 0
            }
        }).pipe(
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

    getListarTiposProcessos(nomeProcesso: string): Observable<ServiceResult<EnumValue[]>> {
        return this.http.get<ServiceResult<EnumValue[]>>(`${DESCARGA_UTIL_URL}/processo/${nomeProcesso}`).pipe(
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

    getProcessosByTalie(talieId: number): Observable<ServiceResult<Foto[]>> {
        return this.http.get<ServiceResult<Foto[]>>(`${this.urlApi}/processo/${talieId}`).pipe(
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

    getProcessosByContainer(container: string): Observable<ServiceResult<Foto[]>> {
        return this.http.get<ServiceResult<Foto[]>>(`${this.urlApi}/processo-container/${container}`).pipe(
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

    postProcessoFoto(data: Foto): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}/processo`, data).pipe(
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

    putProcessoFoto(data: Foto): Observable<ServiceResult<boolean>> {
        return this.http.put<ServiceResult<boolean>>(`${this.urlApi}/processo`, data).pipe(
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

    deleteProcessoFoto(data: Foto): Observable<ServiceResult<boolean>> {
        return this.http.delete<ServiceResult<boolean>>(`${this.urlApi}/processo/${data.id}`).pipe(
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

    saveFotos(data: Marcante): Observable<ServiceResult<boolean>> {
        return this.http.post<ServiceResult<boolean>>(`${this.urlApi}/salvar-fotos`, data).pipe(
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