import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageTitleModule } from "src/app/shared/page-title/page-title.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MovimentaCargaComponent } from "./movimenta-carga/movimenta-carga.component";
import { MovimentacaoCargaSoltaComponent } from "./movimentacao-carga-solta.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        MovimentacaoCargaSoltaComponent,
        MovimentaCargaComponent],
    imports: [
        SharedModule,
        PageTitleModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule
    ],
})
export class MovimentacaoCargaSoltaModule { }