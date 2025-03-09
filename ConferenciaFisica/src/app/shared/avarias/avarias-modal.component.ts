import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TiposAvarias } from "./tipos-avarias.model";

@Component({
  selector: "app-avarias-modal",
  templateUrl: "./avarias-modal.component.html",
  styleUrls: ["./avarias-modal.component.scss"],
})
export class AvariasModalComponent implements OnInit {
  avariasForm: FormGroup;

  @Input() tiposAvarias: TiposAvarias[] = [];
  @Input() embalagens: { id: number; descricao: string }[] = [];
  @Input() conteiners: { id: number; numero: string }[] = [];
  @Output() avariasSalvas = new EventEmitter<any>();

  avariasSelecionadas: TiposAvarias[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.avariasForm = this.fb.group({
      quantidadeAvariada: [""],
      pesoAvariado: [""],
      embalagem: [""],
      conteiner: [""],
      observacao: [""],
    });
  }

  ngOnInit(): void {}

  fecharModal() {
    this.activeModal.dismiss();
  }

  salvarAvarias() {
    const dadosAvaria = {
      ...this.avariasForm.value,
      avariasSelecionadas: this.avariasSelecionadas,
    };
    this.avariasSalvas.emit(dadosAvaria);
    console.log(dadosAvaria);
    this.activeModal.close();
  }

  onDragStart(event: DragEvent, tipo: TiposAvarias): void {
    event.dataTransfer?.setData('text', JSON.stringify(tipo));
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text');
    if (data) {
      const avaria = JSON.parse(data) as TiposAvarias;
      if (!this.avariasSelecionadas.some(a => a.id === avaria.id)) {
        this.avariasSelecionadas.push(avaria);
      }
    }
  }

  removerAvaria(avaria: TiposAvarias): void {
    this.avariasSelecionadas = this.avariasSelecionadas.filter(a => a.id !== avaria.id);
  }
}
