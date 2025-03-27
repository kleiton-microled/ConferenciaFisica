import { Component } from '@angular/core';
import { PageTitleModule } from "../../../shared/page-title/page-title.module";
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from "../../../shared/shared.module";
import { Router } from '@angular/router';

@Component({
  selector: 'app-marcante-carga-solta',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './marcante-carga-solta.component.html',
  styleUrl: './marcante-carga-solta.component.scss'
})
export class MarcanteCargaSoltaComponent {
  filtrarLote() {
    console.log(this.form.value);
  }

  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  container = [
    { id: 1, name: "Importação" },
    { id: 2, name: "Exportação" },
  ];

  get containerControl(): FormControl {
    return this.form.get("container") as FormControl;
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
    save: { enabled: false, visible: false },
    delete: { enabled: false, visible: false },
    photo: { enabled: true, visible: true },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };
  
  /**
   *
   */
  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = this.getNewForm();

  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      ticket: [''],
      placaCarreta: [''],
      quantidade: [0],
      container: [''],
      qtdMarcantes: [0],
      marcante: [''],
      embalagem: [''],
      lote: [''],
    });
  }
}
