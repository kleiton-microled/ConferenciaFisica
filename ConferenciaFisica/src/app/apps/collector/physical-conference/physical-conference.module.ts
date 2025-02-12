import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PhysicalConferenceHeaderComponent } from "./physical-conference-header/physical-conference-header.component";
import { PhysicalConferenceComponent } from "./physical-conference.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";

@NgModule({
  declarations: [PhysicalConferenceComponent, PhysicalConferenceHeaderComponent],
  imports: [CommonModule,PageTitleModule, ReactiveFormsModule],
})
export class PhysicalConferenceModule {}