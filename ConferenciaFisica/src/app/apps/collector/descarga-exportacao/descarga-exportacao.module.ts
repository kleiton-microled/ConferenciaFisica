import { NgModule } from "@angular/core";
import { DescargaExportacaoComponent } from "./descarga-exportacao.component";
import { CommonModule } from "@angular/common";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [DescargaExportacaoComponent],
    imports: [CommonModule, PageTitleModule, ReactiveFormsModule, FormsModule]
})
export class DescargaExportacaoModule { }