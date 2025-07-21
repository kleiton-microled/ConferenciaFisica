import { NgModule } from "@angular/core";
import { CollectorComponent } from "./collector.component";
import { CommonModule } from "@angular/common";
import { CollectorRoutingModule } from "./collector-routing.module";
import { PhysicalConferenceModule } from "./physical-conference/physical-conference.module";
import { DescargaExportacaoModule } from "./descarga-exportacao/descarga-exportacao.module";
import { SharedModule } from "src/app/shared/shared.module";
import { MovimentacaoCargaSoltaModule } from "./movimentacao-carga-solta/movimentacao-carga-solta.module";

@NgModule({
  declarations: [CollectorComponent],
  imports: [CommonModule,
    //SharedModule,
    DescargaExportacaoModule,
    PhysicalConferenceModule,
    MovimentacaoCargaSoltaModule,
    CollectorRoutingModule
    
  ],
})
export class CollectorModule { }