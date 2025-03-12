import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/Http/base-service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { Patio } from "./models/patio.model";
import { PRE_REGISTRO_URL } from "src/app/Http/Config/config";

@Injectable({
    providedIn: 'root'
})

export class PreRegistroService extends BaseService<Patio>{

    constructor(http: HttpClient, notificationService: NotificationService) {
        super(http, PRE_REGISTRO_URL);
    }


    
}