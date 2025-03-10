import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvariasModalComponent } from './avarias/avarias-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MicroledSelectComponent } from './microled-select/microled-select.component';
import { ActionFooterComponent } from './action-footer/action-footer.component';


@NgModule({
  declarations: [
    AvariasModalComponent, MicroledSelectComponent, ActionFooterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    MicroledSelectComponent, ActionFooterComponent
  ]
})
export class SharedModule { }
