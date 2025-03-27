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


@NgModule({
  declarations: [
    AvariasModalComponent,
    MicroledSelectComponent,
    ActionFooterComponent,
    CameraModalComponent,
    MicroledPhotosComponent,
    MicroledInputWithSelectComponent,
    DateFormatPipe],
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
    DateFormatPipe
  ]
})
export class SharedModule { }
