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
import { AuthenticationService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-tools",
  templateUrl: "./tools.component.html",
  styleUrl: "./tools.component.scss",
})
export class ToolsComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  tools: ToolsModel[] = [];
  listaDePatios: SelectizeModel[] = [];
  toolsDisabled: boolean = true;

  form: FormGroup;

  constructor(private service: ToolsService, private fb: FormBuilder, private userService: AuthenticationService) {
    this.form = this.fb.group({
      patio: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: "Home", path: "/", active: true }];

    this.carregarPatios();

    this.form.controls['patio'].valueChanges.subscribe(value => {
      if (value != '') {
        this.toolsDisabled = false;
      } else {
        this.toolsDisabled = true;
      }
    })
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
        
        var user = this.userService.currentUser();
        if (user?.patio?.id && user.patio.id > 0) {
          this.form.controls['patio'].setValue(user.patio.id);
        }
      } else {
        this.listaDePatios = [];
      }

    });
  }

  onSelectChange(value: any) {
    const filtro = this.listaDePatios.find(p => +p.id == +value);
    if (!filtro) return;

    const patio = Patio.New(+filtro.id, filtro.label);

    this.form.controls['patio'].setValue(value);
    this.userService.setPatio(patio);
  }


}  
