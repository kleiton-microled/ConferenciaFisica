import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrarSaidaCaminhaoModalComponent } from './modais/registrar-saida-caminhao-modal/registrar-saida-caminhao-modal.component';
import { FormValidationService } from 'src/app/shared/services/Messages/form-validation.service';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-registrar-saida-caminhao',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule, CommonModule],
  templateUrl: './registrar-saida-caminhao.component.html',
  styleUrl: './registrar-saida-caminhao.component.scss'
})
export class RegistrarSaidaCaminhaoComponent {

  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: false },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };

  constructor(
    public formValidationService: FormValidationService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.form = this.getNewForm();
  }
  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  limpar() { this.form.reset(); }

  buscarRegistro() {
    console.log('buscarRegistro');
    
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      return;
    };
    
    const modalRef = this.modalService.open(RegistrarSaidaCaminhaoModalComponent, {
      size: 'xl',
      backdrop: 'static',
      centered: false
    });

    // modalRef.componentInstance.urlPath = 'uploads/fotos';
  }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      numeroProtocolo: ['', Validators.required],
      anoProtocolo: ['', Validators.required],
      placa: ['', Validators.required],
      placaCarreta: ['', Validators.required],
    });
  }
}
