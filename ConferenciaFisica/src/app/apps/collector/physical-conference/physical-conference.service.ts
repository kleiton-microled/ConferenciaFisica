import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';

export interface ConferenceContainer {
  display: string;
  autonum: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicalConferenceService {
  private apiUrl = 'https://localhost:5000/api/Conferencia';

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  /**
   * Busca os contêineres agendados para conferência.
   * @param filtro (opcional) Filtro de busca
   * @returns Observable<ConferenceContainer[]>
   */
  getContainers(): Observable<ServiceResult<any>> {
    this.notificationService.showLoading(); // Mostra loading

    return this.http.get<ServiceResult<any>>(`${this.apiUrl}/conteineres`).pipe(
      map(response => {
        if (!response.status) {
          this.notificationService.showError(response);
          throw new Error(response.error || 'Erro desconhecido');
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.notificationService.showError(error); // Exibe erro no SweetAlert
        return throwError(() => error);
      }),
      finalize(() => this.notificationService.hideLoading()) // Fecha loading corretamente
    );
  }
}
