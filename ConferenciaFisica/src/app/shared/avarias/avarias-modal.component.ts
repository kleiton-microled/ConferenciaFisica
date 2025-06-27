import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TiposAvarias } from "./tipos-avarias.model";
import { CdkDragDrop } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-avarias-modal",
  templateUrl: "./avarias-modal.component.html",
  styleUrls: ["./avarias-modal.component.scss"],
})
export class AvariasModalComponent<T extends Record<string, any>> implements OnInit {
  avariasForm!: FormGroup;

  @Input() avariaModel!: T;
  @Input() tiposAvarias: TiposAvarias[] = [];
  @Input() embalagens: { id: number; descricao: string }[] = [];
  @Input() listLocal: { id: number; descricao: string }[] = [];
  @Input() conteiner!: string;
  @Input() idConferencia!: number;

  @Input() tipoAvaria: string = "";

  @Output() avariasSalvas = new EventEmitter<T>();
  @Output() closeAvariasEvent = new EventEmitter<number>();

  avariasSelecionadas: TiposAvarias[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.inicializarFormulario();

    if (this.conteiner) {
      this.avariasForm.controls['conteiner'].setValue(this.conteiner);
      this.avariasForm.controls['conteiner'].disable();
    }
  }

  inicializarFormulario(): void {
    if (!this.avariaModel || typeof this.avariaModel !== "object") {
      console.error("AvariaModel inválido ou não definido.");
      return;
    }

    // Criar um novo FormGroup baseado nas chaves da avariaModel
    const formControls: any = {};
    Object.keys(this.avariaModel).forEach((key) => {
      const value = this.avariaModel[key];

      // Definir o tipo correto para o FormControl
      if (typeof value === "number") {
        formControls[key] = [value, Validators.required]; // Mantém como number
      } else if (typeof value === "boolean") {
        formControls[key] = [value, Validators.required]; // Mantém como boolean
      } else {
        formControls[key] = [value || "", Validators.required]; // Mantém como string ou outro tipo
      }
    });

    this.avariasForm = this.fb.group(formControls);



    // Se a model tiver `tiposAvarias`, inicializa a lista
    if ("tiposAvarias" in this.avariaModel && Array.isArray((this.avariaModel as any).tiposAvarias)) {
      this.avariasSelecionadas = [...(this.avariaModel as any).tiposAvarias];
    }
  }

  fecharModal() {
    this.closeAvariasEvent.emit((this.avariaModel as any)?.id);
    this.activeModal.dismiss();
  }

  salvarAvarias() {
    const dadosAvaria: T = {
      ...this.avariaModel,
      ...this.avariasForm.value,
      tiposAvarias: this.avariasSelecionadas,
    };

    this.avariasSalvas.emit(dadosAvaria);
    //this.activeModal.close();
  }

  // onDragStart(event: DragEvent, tipo: TiposAvarias): void {
  //   event.dataTransfer?.setData("text", JSON.stringify(tipo));
  // }

  // allowDrop(event: DragEvent) {
  //   event.preventDefault();
  // }

  // onDragOver(event: DragEvent) {
  //   event.preventDefault();
  // }

  // onDrop(event: DragEvent): void {
  //   event.preventDefault();
  //   const data = event.dataTransfer?.getData("text");
  //   if (data) {
  //     const avaria = JSON.parse(data) as TiposAvarias;
  //     if (!this.avariasSelecionadas.some((a) => a.id === avaria.id)) {
  //       this.avariasSelecionadas.push(avaria);
  //     }
  //   }
  // }
 onDropAvaria(event: CdkDragDrop<TiposAvarias[]>) {
  const avaria = event.item.data;
  if (!this.avariasSelecionadas.some(a => a.id === avaria.id)) {
    this.avariasSelecionadas.push(avaria);
  }
}

  removerAvaria(avaria: TiposAvarias): void {
    this.avariasSelecionadas = this.avariasSelecionadas.filter((a) => a.id !== avaria.id);
  }
}
