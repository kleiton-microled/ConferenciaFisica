import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DescargaExportacao } from "./models/descarga-exportacao.model";
import { BaseService } from "src/app/Http/base-service";
import { DESCARGA_EXPORTACAO_URL } from "src/app/Http/Config/config";

@Injectable({
    providedIn: 'root'
})
export class DescargaExportacaoService extends BaseService<DescargaExportacao> {

    constructor(http: HttpClient) {
        super(http, DESCARGA_EXPORTACAO_URL);
    }

}