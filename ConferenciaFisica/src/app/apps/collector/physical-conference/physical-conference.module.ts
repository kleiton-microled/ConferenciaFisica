import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhysicalConferenceHeaderComponent } from "./physical-conference-header/physical-conference-header.component";
import { PhysicalConferenceComponent } from "./physical-conference.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { LacresFormComponent } from "./lacres-form/lacres-form.component";
import { ActionFooterComponent } from "./action-footer/action-footer.component";

@NgModule({
  declarations: [PhysicalConferenceComponent,
    PhysicalConferenceHeaderComponent,
    LacresFormComponent,
    ActionFooterComponent],
  imports: [CommonModule, PageTitleModule, ReactiveFormsModule],
})
export class PhysicalConferenceModule { }