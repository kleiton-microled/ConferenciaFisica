import { RouterModule, Routes } from "@angular/router";
import { CollectorComponent } from "./collector.component";
import { NgModule } from "@angular/core";
import { PhysicalConferenceComponent } from "./physical-conference/physical-conference.component";
import { DescargaExportacaoComponent } from "./descarga-exportacao/descarga-exportacao.component";
import { PreRegistroComponent } from "./pre-registro/pre-registro.component";
import { MovimentacaoCargaSoltaComponent } from "./movimentacao-carga-solta/movimentacao-carga-solta.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { EstufagemContainerComponent } from "./estufagem-container/estufagem-container.component";
import { MarcanteCargaSoltaComponent } from "./marcante-carga-solta/marcante-carga-solta.component";
import { MovimentacaoContainerComponent } from "./movimentacao-container/movimentacao-container.component";

const routes: Routes = [{
  path: '',
  component: CollectorComponent
},
{
  path: 'physical-conference',
  component: PhysicalConferenceComponent,
  canActivate: [AuthGuard],
  data: { roles: ['TODAS','CONF_FISICA'] }
},
{
  path: 'descarga-exportacao',
  component: DescargaExportacaoComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS','DESC_EXPORTACAO']}
},
{
  path: 'pre-registro',
  component: PreRegistroComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS']}
},
{
  path: 'estufagem-container',
  component: EstufagemContainerComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS']}
},
{
  path: 'movimentaca-carga-solta',
  component: MovimentacaoCargaSoltaComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS']}

},
{
  path: 'marcante-carga-solta',
  component: MarcanteCargaSoltaComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS']}
},
{
  path: 'movimentacao-container',
  component: MovimentacaoContainerComponent,
  canActivate:[AuthGuard],
  data: {roles: ['TODAS']}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectorRoutingModule { }