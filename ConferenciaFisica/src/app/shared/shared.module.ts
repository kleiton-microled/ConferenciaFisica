import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvariasModalComponent } from './avarias/avarias-modal.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AvariasModalComponent 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
