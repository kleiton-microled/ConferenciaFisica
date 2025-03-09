import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationService } from "src/app/shared/services/notification.service";

@Injectable({
    providedIn: 'root'
})
export class DescargaExportacaoService {
    constructor(private http: HttpClient, private notificationService: NotificationService) { }

    
}