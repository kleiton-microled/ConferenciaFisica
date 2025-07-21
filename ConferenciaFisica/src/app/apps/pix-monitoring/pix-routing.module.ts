import { RouterModule, Routes } from "@angular/router";
import { PixMonitoringComponent } from "./pix-monitoring.component";
import { NgModule } from "@angular/core";

const routes: Routes = [{
  path: '',
  component: PixMonitoringComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixRoutingModule { }