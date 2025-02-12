import { NgModule } from "@angular/core";
import { CollectorComponent } from "./collector.component";
import { PhysicalConferenceComponent } from "./physical-conference/physical-conference.component";
import { CommonModule } from "@angular/common";
import { CollectorRoutingModule } from "./collector-routing.module";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { PhysicalConferenceModule } from "./physical-conference/physical-conference.module";

@NgModule({
  declarations: [CollectorComponent],
  imports: [CommonModule,
    PhysicalConferenceModule,
    CollectorRoutingModule
    
  ],
})
export class CollectorModule { }