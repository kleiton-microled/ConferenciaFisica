import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { SharedModule } from "../../../shared/shared.module";
import { PageTitleModule } from "../../../shared/page-title/page-title.module";

@Component({
  selector: 'app-movimentacao-container',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './movimentacao-container.component.html',
  styleUrl: './movimentacao-container.component.scss'
})
export class MovimentacaoContainerComponent {


  historicoMovimentos() {
    throw new Error('Method not implemented.');
  }

  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  containers = [
    { id: 1, name: "Importação" },
    { id: 2, name: "Exportação" },
  ];

  get containerControl(): FormControl {
    return this.form.get("motivo") as FormControl;
  }

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: true, visible: true },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.getNewForm();
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  filtrar() {
    throw new Error('Method not implemented.');
  }

  limparForm() { this.form.reset(); }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      sigla: [''],
      localAtual: [''],
      local: [''],
      container: [''],
      motivo: [''],
      marcante: [''],
      tamanho: [''],
      tipo: [''],
      gwt: [''],
      temperatura: [''],
      imo: [''],
      entrada: [''],
      viagem: [''],
      ef: [''],
      posicionar: [''],
    });
  }
}
