import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  { path: 'tools', loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule) },
  { path: 'collector', loadChildren: () => import('./collector/collector.module').then(m => m.CollectorModule) },
  { path: 'pix', loadChildren: () => import('./pix-monitoring/pix-monitoring.module').then(m => m.PixMonitoringModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule { }
