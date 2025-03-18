import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importe o ReactiveFormsModule
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhysicalConferenceService } from '../physical-conference/physical-conference.service';
import { PhysicalConferenceStorageService } from '../physical-conference/physical-conference-storage.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from "../../../shared/page-title/page-title.module";
import { SharedModule } from "../../../shared/shared.module";

@Component({
  selector: 'app-movimentacao-carga-solta',
  standalone: true,
  imports: [
    PageTitleModule,
    SharedModule,
    ReactiveFormsModule // Adicione o ReactiveFormsModule aqui
  ],
  templateUrl: './movimentacao-carga-solta.component.html',
  styleUrl: './movimentacao-carga-solta.component.scss',
})
export class MovimentacaoCargaSoltaComponent implements OnInit {
  form!: FormGroup;
  pageTitle: BreadcrumbItem[] = [];
  items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  get itemControl(): FormControl {
    return this.form.get("item") as FormControl;
  }

  onSelectChange(value: any): void {
    console.log("Selecionado:", value);
  }

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: false },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private conferenceService: PhysicalConferenceService,
    private storageService: PhysicalConferenceStorageService,
    private notificationService: NotificationService
  ) {

    this.form = this.formBuilder.group({
      // finalidade: new FormControl("", Validators.required),
      item: new FormControl(""),
      // placa: new FormControl(""),
      // placaCarreta: new FormControl("", Validators.required),
      // ticket: new FormControl("", Validators.required),
    });
  }

  ngOnInit(): void {

  }


  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log("Formulário enviado:", this.form.value);
    } else {
      console.log("Formulário inválido");
    }
  }
}