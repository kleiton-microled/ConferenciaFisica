import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValidationService } from 'src/app/shared/services/Messages/form-validation.service';
import { CommonModule } from "@angular/common";
import { RegistrarSaidaCaminhaoService } from './registrar-saida-caminhao.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { RegistrarSaidaCaminhaoInfoCaminhao } from './models/registrar-saida-caminhao-info-caminhao.model';
import { RegistrarSaidaCaminhao } from './models/registrar-saida-caminha';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

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
  formModal: FormGroup;
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: true, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: false },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };
  @ViewChild('cargaModal') cargaModal!: TemplateRef<any>;

  constructor(
    public formValidationService: FormValidationService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private router: Router,
    private modalService: NgbModal,
    private service: RegistrarSaidaCaminhaoService
  ) {
    this.form = this.getNewForm();
    this.formModal = this.formBuilder.group({
      preRegistroId: [''],
      protocolo: [''],
      placa: [''],
      placaCarreta: [''],
      ticketEntrada: [''],
      pesoBruto: [''],
      gateIn:[''],
      gateOut:['']
    });
  }
  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  limpar() { this.form.reset(); }

  async buscarRegistro() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();

      return;
    };
    
    await this.service.getInformacaoCaminhao(
      this.form.get('numeroProtocolo')?.value || '',
      this.form.get('anoProtocolo')?.value || '',
      this.form.get('placa')?.value || '',
      this.form.get('placaCarreta')?.value || '',
      1
    )
    .subscribe((ret: ServiceResult<RegistrarSaidaCaminhaoInfoCaminhao>) => {
      if (ret.status) {
        console.log(ret);

        if (!ret.result) {
          
          this.notificationService.showError(ret.error);

          return;
        }

        this.formModal.patchValue(ret.result);
        this.modalService.open(this.cargaModal, { size: 'xl', backdrop: 'static', centered: false });
      } else { 
        this.notificationService.showError(ret.error);
      }
    });

    
  }

  
RegitrarSaida() {
  
  console.log(this.formModal.value);
let input = new RegistrarSaidaCaminhao({
  preRegistroId:Number( this.formModal.get('preRegistroId')?.value ?? 0),
  placa: this.formModal.get('placa')?.value ?? '',
  protocolo: this.formModal.get('protocolo')?.value ?? '',
  pesoBruto: this.formModal.get('pesoBruto')?.value ?? '',
  gateIn: this.formModal.get('gateIn')?.value ?? '',
  gateOut: this.formModal.get('gateOut')?.value ?? '',
  placaCarreta: this.formModal.get('placaCarreta')?.value ?? ''
});
  this.service.postRegistrarSaida(input)
              .subscribe((ret: ServiceResult<boolean>) => {
                if (ret.status) {
                  console.log(ret);

                  if (!ret.result){
                    this.notificationService.showError(ret.error);
                    return;
                  }
                  this.notificationService.showMessage("Registro salvo com sucesso");

                  this.modalService.dismissAll(this.cargaModal);
                } else { 
                  this.notificationService.showError(ret.error);
                }
              });
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
