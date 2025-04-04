import { Component, OnInit } from "@angular/core";
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

@Component({
  selector: "app-pre-registro",
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule],
  templateUrl: "./pre-registro.component.html",
  styleUrl: "./pre-registro.component.scss",
})
export class PreRegistroComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;

  patiosDestino = [
  ];

  finalidade = [
   
  ];
  
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
    observacao: { enabled: false, visible: false }
  };

  constructor(
    private formBuilder: FormBuilder,
    private service: PreRegistroService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      finalidade: new FormControl("", Validators.required),
      patioDestino: new FormControl(""),
      placa: new FormControl(""),
      placaCarreta: new FormControl("", Validators.required),
      ticket: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {}

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
    const filter = {
      finalidade: this.form.get("finalidade")?.value,
      patioDestino: this.form.get("patioDestino")?.value,
      placa: this.form.get("placa")?.value,
      placaCarreta: this.form.get("placaCarreta")?.value,
      ticket: this.form.get("ticket")?.value,
    };

    this.service.findByFilter(filter).subscribe({
      next: (result) => {
        if (result.statusCode == HttpStatusCode.Ok) {
          console.log(result.content);
        } else {
          this.notificationService.showError(result);
        }
      },
      error: (error) => {
        this.notificationService.showError(error);
      },
    });
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }
  
  limpar(): void {
    this.form.reset();
  }
}
