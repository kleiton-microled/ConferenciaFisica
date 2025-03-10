import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhysicalConferenceHeaderComponent } from "./physical-conference-header/physical-conference-header.component";
import { PhysicalConferenceComponent } from "./physical-conference.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { LacresFormComponent } from "./lacres-form/lacres-form.component";
import { ActionFooterComponent } from "../../../shared/action-footer/action-footer.component";
import { CpfMaskDirective } from "src/app/shared/directives/cpf-mask.directive";
import { GenericFormComponent } from "./generic-form/generic-form.component";
import { DocumentosComponent } from "./documentos/documentos.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [PhysicalConferenceComponent,
    PhysicalConferenceHeaderComponent,
    LacresFormComponent,
    CpfMaskDirective,
    GenericFormComponent, DocumentosComponent],
  imports: [CommonModule, PageTitleModule, ReactiveFormsModule, FormsModule, SharedModule],
})
export class PhysicalConferenceModule { }