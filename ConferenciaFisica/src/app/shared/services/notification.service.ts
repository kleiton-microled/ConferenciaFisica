import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ServiceResult } from '../models/serviceresult.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private isLoading = false; // Variável de controle para o estado do loading

  constructor() { }

  // Exibe um alerta de sucesso baseado no ServiceResult<T>
  showSuccess<T>(response: ServiceResult<T>, title: string = 'Sucesso') {
    this.hideLoading(); // Garante que o loading seja fechado antes
    Swal.fire({
      title,
      text: response.mensagens?.join('\n') || 'Operação realizada com sucesso!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  showAlert<T>(response: ServiceResult<T>, title: string = 'Info') {
    this.hideLoading();
    setTimeout(() => { // Pequeno delay para evitar que a modal de erro feche antes de abrir
      Swal.fire({
        title: 'Info',
        text: response.mensagens[0],
        icon: 'info',
        confirmButtonText: 'Fechar'
      });
    }, 200);
  }

  // Exibe um alerta de erro formatado com base no ServiceResult<T>
  showError(errorResponse: any) {
    this.hideLoading();

    let errorMessage = 'Ocorreu um erro desconhecido.';

    if (errorResponse?.error) {
      const serviceResult = errorResponse.error as ServiceResult<any>;

      if (serviceResult.mensagens && serviceResult.mensagens.length > 0) {
        errorMessage = serviceResult.mensagens.join('\n'); // Junta mensagens de erro
      } else if (serviceResult.error) {
        errorMessage = serviceResult.error; // Usa a propriedade `error` se presente
      }
    }

    setTimeout(() => { // Pequeno delay para evitar que a modal de erro feche antes de abrir
      Swal.fire({
        title: 'Erro',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Fechar'
      });
    }, 200);
  }

  // Exibe um alerta de carregamento
  showLoading(message: string = 'Carregando dados...') {
    this.isLoading = true;
    Swal.fire({
      title: message,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Fecha o alerta de carregamento
  hideLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      Swal.close();
    }
  }
}
