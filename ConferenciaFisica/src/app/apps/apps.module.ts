import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppsRoutingModule } from './apps-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbDatepickerPtDirective } from '../shared/directives/ngb-datepicker-pt.directive';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-i18n';
import { CustomDatepickerI18n, I18n } from '../shared/directives/ngb-datepicker-i18n';

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
