import { BaseService } from "src/app/Http/base-service";
import { HttpClient } from "@angular/common/http";
import { ToolsModel } from "./tools.model";
import { Injectable } from "@angular/core";
import { TOOLS_URL } from "src/app/Http/Config/config";
import { ConfigService } from "src/app/shared/services/config.service";
import { NotificationService } from "src/app/shared/services/notification.service";

@Injectable({
    providedIn: 'root'
})

export class ToolsService extends BaseService<ToolsModel> {
    private urlApi = "";
    constructor(http: HttpClient,
        private configService: ConfigService,
        private notificationService: NotificationService) {
        super(http, configService.getConfig('COLETOR_URL_SERVICE'));
        this.urlApi = configService.getConfig('COLETOR_URL_SERVICE');
    }

    
}