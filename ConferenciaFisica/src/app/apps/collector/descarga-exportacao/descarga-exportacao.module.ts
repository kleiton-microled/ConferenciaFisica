import { NgModule } from "@angular/core";
import { DescargaExportacaoComponent } from "./descarga-exportacao.component";
import { CommonModule } from "@angular/common";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";
import { AdvancedTableModule } from "src/app/shared/advanced-table/advanced-table.module";

@NgModule({
    declarations: [DescargaExportacaoComponent],
    imports: [CommonModule,
        SharedModule,
        AdvancedTableModule,
        PageTitleModule, 
        ReactiveFormsModule, 
        FormsModule, 
        NgbModule ]
})
export class DescargaExportacaoModule { }