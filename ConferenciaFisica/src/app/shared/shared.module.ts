import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvariasModalComponent } from './avarias/avarias-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MicroledSelectComponent } from './microled-select/microled-select.component';
import { ActionFooterComponent } from './action-footer/action-footer.component';
import { MicroledPhotosComponent } from './microled-photos/microled-photos.component';
import { CameraModalComponent } from './microled-photos/camera-modal/camera-modal.component';
import { DateFormatPipe } from './pipes/date-mask.pipe';
import { MicroledInputWithSelectComponent } from './microled-input-with-select/microled-input-with-select.component';
import { DecimalInputDirective } from './directives/decimal-input.directive';


@NgModule({
  declarations: [
    AvariasModalComponent,
    MicroledSelectComponent,
    ActionFooterComponent,
    CameraModalComponent,
    MicroledPhotosComponent,
    MicroledInputWithSelectComponent,
    DateFormatPipe,
    DecimalInputDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MicroledSelectComponent, 
    ActionFooterComponent, 
    MicroledPhotosComponent,
    MicroledInputWithSelectComponent,
    DateFormatPipe,
    DecimalInputDirective
  ]
})
export class SharedModule { }
