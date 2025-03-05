import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfMaskDirective } from './directives/cpf-mask.directive';


@NgModule({
  declarations: [
    CpfMaskDirective 
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
