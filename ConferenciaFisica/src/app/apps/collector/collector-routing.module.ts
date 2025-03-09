import { RouterModule, Routes } from "@angular/router";
import { CollectorComponent } from "./collector.component";
import { NgModule } from "@angular/core";
import { PhysicalConferenceComponent } from "./physical-conference/physical-conference.component";
import { DescargaExportacaoComponent } from "./descarga-exportacao/descarga-exportacao.component";

const routes: Routes = [{
  path: '',
  component: CollectorComponent
},
{
  path: 'physical-conference',
  component: PhysicalConferenceComponent
},
{
  path: 'descarga-exportacao',
  component: DescargaExportacaoComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectorRoutingModule { }