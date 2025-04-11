import { Component, OnInit } from "@angular/core";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";
import { TOOLS } from "./data";
import { ToolsModel } from "./tools.model";
import { ToolsService } from "./tools.service";
import { GetAllRequest } from "src/app/Http/models/Input/get-all-request.model";
import { SelectizeModel } from "src/app/shared/microled-select/microled-select.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ServiceResult } from "src/app/shared/models/serviceresult.model";
import { Patio } from "./model/patio.model";

@Component({
  selector: "app-tools",
  templateUrl: "./tools.component.html",
  styleUrl: "./tools.component.scss",
})
export class ToolsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  tools: ToolsModel[] = [];
  listaDePatios: SelectizeModel[] = [];

  form: FormGroup;

  constructor(private service: ToolsService, private fb: FormBuilder) {
    this.form = this.fb.group({
      patio: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Home", path: "/", active: true }];

    //this.tools = TOOLS;
    //this.loadToolsCard();
  }

  loadToolsCard(): void {
    // this.service.getModules().subscribe((result) => {
    //   if (result.statusCode == 200) {
    //     console.log(result);
    //     this.tools = result.content;
    //     console.log(this.tools);
    //   } else {
    //     console.error(result.message);
    //   }
    // })
  }

  get patioControl(): FormControl {
    return this.form.get('patio') as FormControl;
  }

  carregarPatios() {
    this.service.getListaPatios().subscribe((ret: ServiceResult<Patio[]>) => {
      if (ret.status && ret.result) {
        this.listaDePatios = ret.result.map(p => ({
          id: p.id,
          label: p.descricao
        }));
      } else {
        this.listaDePatios = [];
      }

    });
  }

  onSelectChange(value: any) {
    this.form.controls['patio'].setValue(value);
  }
}
