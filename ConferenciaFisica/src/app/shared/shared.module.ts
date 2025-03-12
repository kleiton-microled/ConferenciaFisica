import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvariasModalComponent } from './avarias/avarias-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MicroledSelectComponent } from './microled-select/microled-select.component';
import { ActionFooterComponent } from './action-footer/action-footer.component';
import { MicroledPhotosComponent } from './microled-photos/microled-photos.component';


@NgModule({
  declarations: [
    AvariasModalComponent,
    MicroledSelectComponent,
    ActionFooterComponent,
    MicroledPhotosComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MicroledSelectComponent, 
    ActionFooterComponent, 
    MicroledPhotosComponent
  ]
})
export class SharedModule { }
