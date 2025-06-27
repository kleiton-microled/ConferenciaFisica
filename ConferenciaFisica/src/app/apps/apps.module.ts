import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppsRoutingModule } from './apps-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';

registerLocaleData(localePt);
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AppsRoutingModule,
    FullCalendarModule
  ],
  providers: [
    
  ]
})
export class AppsModule { }
