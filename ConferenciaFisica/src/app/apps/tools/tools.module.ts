import { NgModule } from "@angular/core";
import { ToolsComponent } from "./tools.component";
import { ToolsRoutingModule } from "./tools-routing.module";
import { PageTitleModule } from "../../shared/page-title/page-title.module";
import { CardComponent } from "./card/card.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ToolsComponent, CardComponent],
  imports: [
    CommonModule,
    SharedModule,
    ToolsRoutingModule,
    PageTitleModule,
    ReactiveFormsModule,
    FormsModule],
})
export class ToolsModule { }
