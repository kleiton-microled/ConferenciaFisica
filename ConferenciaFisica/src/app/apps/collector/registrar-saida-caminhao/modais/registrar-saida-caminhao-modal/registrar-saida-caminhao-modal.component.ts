import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-registrar-saida-caminhao-modal',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './registrar-saida-caminhao-modal.component.html',
  styleUrl: './registrar-saida-caminhao-modal.component.scss'
})
export class RegistrarSaidaCaminhaoModalComponent {
  form: FormGroup;
  urlBasePhotos: string ='';

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.form = this.getNewForm();
  }

  RegitrarSaida() {
   console.log('RegitrarSaida');
  }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      protocolo: [''],
      placa: [''],
      ticketEntrada: [''],
      pesoBruto: [''],
      // arm: [''],
      // arm: [''],
      // arm: [''],
    });
  }
}
