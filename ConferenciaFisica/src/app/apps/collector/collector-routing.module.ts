import { RouterModule, Routes } from "@angular/router";
import { CollectorComponent } from "./collector.component";
import { NgModule } from "@angular/core";
import { PhysicalConferenceComponent } from "./physical-conference/physical-conference.component";
import { DescargaExportacaoComponent } from "./descarga-exportacao/descarga-exportacao.component";
import { PreRegistroComponent } from "./pre-registro/pre-registro.component";
import { MovimentacaoCargaSoltaComponent } from "./movimentacao-carga-solta/movimentacao-carga-solta.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { EstufagemContainerComponent } from "./estufagem-container/estufagem-container.component";

const routes: Routes = [{
  path: '',
  component: CollectorComponent
},
{
  path: 'physical-conference',
  component: PhysicalConferenceComponent,
  canActivate: [AuthGuard],
  data: { roles: ['CONF_FISICA'] }
},
{
  path: 'descarga-exportacao',
  component: DescargaExportacaoComponent
},
{
  path: 'pre-registro',
  component: PreRegistroComponent
},
{
  path: 'estufagem-container',
  component: EstufagemContainerComponent
},
{
  path: 'movimentaca-carga-solta',
  component: MovimentacaoCargaSoltaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectorRoutingModule { }