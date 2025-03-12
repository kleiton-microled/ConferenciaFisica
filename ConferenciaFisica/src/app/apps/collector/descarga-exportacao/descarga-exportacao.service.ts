import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DescargaExportacao } from "./models/descarga-exportacao.model";
import { BaseService } from "src/app/Http/base-service";
import { DESCARGA_EXPORTACAO_URL } from "src/app/Http/Config/config";
import { BehaviorSubject, Observable } from "rxjs";
import { Talie } from "../models/talie.model";

@Injectable({
    providedIn: 'root'
})
export class DescargaExportacaoService extends BaseService<DescargaExportacao> {

    private descargaSubject = new BehaviorSubject<DescargaExportacao | null>(null);

    constructor(http: HttpClient) {
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
           registro:0,
           talie:null,
           placa:'',
           reserva:'',
           cliente:''
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

}