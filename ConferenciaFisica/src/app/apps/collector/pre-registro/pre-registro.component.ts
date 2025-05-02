import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { PageTitleModule } from "../../../shared/page-title/page-title.module";
import { PreRegistroService } from "./pre-registro.service";
import { NotificationService } from "src/app/shared/services/notification.service";
import { SharedModule } from "../../../shared/shared.module";
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { HttpStatusCode } from "@angular/common/http";
import { SelectizeModel } from "src/app/shared/microled-select/microled-select.component";
import { ToolsService } from "../../tools/tools.service";
import { FormValidationService } from "src/app/shared/services/Messages/form-validation.service";
import { CommonModule } from "@angular/common";
import { AdvancedTableModule } from "src/app/shared/advanced-table/advanced-table.module";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-pre-registro",
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule, CommonModule, AdvancedTableModule],
  templateUrl: "./pre-registro.component.html",
  styleUrl: "./pre-registro.component.scss",
})
export class PreRegistroComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  formModal: FormGroup;
formValue: any = null;

  patiosDestino: SelectizeModel[] = [];

  finalidade: SelectizeModel[] = [{ id: 1, label: "Importarcao" }, { id: 2, label: "Exportacao" }];


  @ViewChild('cargaModal') cargaModal!: TemplateRef<any>;
  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: false },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: false },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false },
    estufar: { enabled: false, visible: false }
  };

  constructor(
    public formValidationService: FormValidationService,
    private formBuilder: FormBuilder,
    private service: PreRegistroService,
    private notificationService: NotificationService,
    private router: Router,
    private serviceTools: ToolsService,
    private modalService: NgbModal,
  ) {
    this.form = this.formBuilder.group({
      finalidade: new FormControl("", Validators.required),
      patioDestino: new FormControl(""),
      placa:new FormControl("", Validators.required),
      placaCarreta: new FormControl("", Validators.required),
      ticket: new FormControl("", Validators.required),
    });

    this.formModal = this.formBuilder.group({
      protocolo: new FormControl({ value: '', disabled: true }),
      periodo: new FormControl({ value: '', disabled: true }),
      periodoInicial: new FormControl({ value: '', disabled: true }),
      periodoFinal: new FormControl({ value: '', disabled: true }),
      placa: new FormControl({ value: '', disabled: true }),
      placaCarreta: new FormControl({ value: '', disabled: true }),
      motorista: new FormControl({ value: '', disabled: true }),
      cnh: new FormControl({ value: '', disabled: true })
    });
  }

  ngOnInit(): void {
    this.carregarPatios();

  }

  RegitrarSaida() {
    this.service.postRegistrarSaida(this.formModal.value).subscribe((response: ServiceResult<any>) => {
      if (!response || response.result == null || !response.status || response.error) return;
    });
  }

  async carregarPatios(): Promise<void> {
    await this.serviceTools.getListaPatios().subscribe((ret) => {
      if (ret.status && ret.result) {
        this.patiosDestino = ret.result.map((p) => ({
          id: p.id,
          label: p.descricao,
        }));
      } else {
        this.patiosDestino = [];
      }
    });
  }
  get patioDestinoControl(): FormControl {
    return this.form.get("patioDestino") as FormControl;
  }

  get finalidadeControl(): FormControl {
    return this.form.get("finalidade") as FormControl;
  }

  onSelectChange(value: any): void {
    console.log("Selecionado:", value);
  }

  buscarRegistro() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    const filter = {
      finalidade: this.form.get("finalidade")?.value,
      patioDestino: this.form.get("patioDestino")?.value,
      placa: this.form.get("placa")?.value,
      placaCarreta: this.form.get("placaCarreta")?.value,
      ticket: this.form.get("ticket")?.value,
      LocalPatio: 1
    };

    this.service.postBuscarRegistro(filter).subscribe((response: ServiceResult<any>) => {
      if (!response || response.result == null || !response.status || response.error) return;
     
      this.formValue = response.result;
      this.formModal.patchValue({
        protocolo: response.result.protocolo,
        periodo: response.result.periodo,
        periodoInicial: response.result.periodoInicial,
        periodoFinal: response.result.periodoFinal,
        placa: response.result.placa,
        placaCarreta: response.result.placaCarreta,
        motorista: response.result.motorista,
        cnh: response.result.cnh
      });

      this.modalService.open(this.cargaModal, { size: 'xl', backdrop: 'static', centered: false });
    });
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  limpar(): void {
    this.form.reset();
  }
}
