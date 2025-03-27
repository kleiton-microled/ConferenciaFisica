import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-inventario-carga-solta',
  standalone: true,
  imports: [PageTitleModule, ReactiveFormsModule, SharedModule],
  templateUrl: './inventario-carga-solta.component.html',
  styleUrl: './inventario-carga-solta.component.scss'
})
export class InventarioCargaSoltaComponent {

  pageTitle: BreadcrumbItem[] = [];
  form: FormGroup;
  arms = [
    { id: 1, name: "Importação" },
    { id: 2, name: "Exportação" },
  ];

  get armControl(): FormControl {
    return this.form.get("arm") as FormControl;
  }

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
  /**
   *
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.getNewForm();
  }


  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  getNewForm(): FormGroup {
    return this.formBuilder.group({
      marcante: [''],
      local: [''],
      localPos: [''],
      arm: [''],
    });
  }

}
