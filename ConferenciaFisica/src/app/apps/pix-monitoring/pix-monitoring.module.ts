import { NgModule } from "@angular/core";
import { PixMonitoringComponent } from "./pix-monitoring.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { AdvancedTableModule } from "src/app/shared/advanced-table/advanced-table.module";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PixRoutingModule } from "./pix-routing.module";
import { CountPixCardsComponent } from "./count-pix-cards/count-pix-cards.component";

@NgModule({
    declarations: [PixMonitoringComponent, CountPixCardsComponent],
    imports: [CommonModule,
        //SharedModule,
        AdvancedTableModule,
        PixRoutingModule,
        PageTitleModule,
        NgbModule]
})
export class PixMonitoringModule { }