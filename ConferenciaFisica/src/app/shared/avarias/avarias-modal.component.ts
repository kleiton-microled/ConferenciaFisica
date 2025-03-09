import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TiposAvarias } from "./tipos-avarias.model";
import { AvariaConferencia } from "src/app/apps/collector/physical-conference/models/avaria.model";

@Component({
  selector: "app-avarias-modal",
  templateUrl: "./avarias-modal.component.html",
  styleUrls: ["./avarias-modal.component.scss"],
})
export class AvariasModalComponent implements OnInit {
  avariasForm: FormGroup;

  @Input() avariaConferencia?: AvariaConferencia | null;

  @Input() tiposAvarias: TiposAvarias[] = [];
  @Input() embalagens: { id: number; descricao: string }[] = [];
  @Input() conteiner!: string;
  @Input() idConferencia!: number;

  @Output() avariasSalvas = new EventEmitter<any>();
  @Output() closeAvariasEvent = new EventEmitter<any>();

  avariasSelecionadas: TiposAvarias[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.avariasForm = this.fb.group({
      idConferencia: [0],
      quantidadeAvariada: [""],
      pesoAvariado: [""],
      embalagem: [""],
      conteiner: [{ value: "", disabled: false }],
      observacao: [""],
    });
  }

  ngOnInit(): void {

    this.avariasForm.controls["conteiner"].setValue(this.conteiner);
    this.avariasForm.controls["idConferencia"].setValue(this.idConferencia);

    if (this.avariaConferencia) {
      // ✅ Preenche os campos se houver valores passados pelo pai
      this.avariasForm.patchValue({
        quantidadeAvariada: this.avariaConferencia.quantidadeAvariada,
        pesoAvariado: this.avariaConferencia.pesoAvariado,
        idEmbalagem: this.avariaConferencia.idEmbalagem,
        conteiner: this.conteiner,
        observacao: this.avariaConferencia.observacao
      });

      // ✅ Se houver avarias, preenche a lista
      if (this.avariaConferencia.tiposAvarias) {
        this.avariasSelecionadas = [...this.avariaConferencia.tiposAvarias];
      }
    }
  }

  fecharModal() {
    this.closeAvariasEvent.emit(this.avariaConferencia?.id);
    this.activeModal.dismiss();
  }

  salvarAvarias() {
    const dadosAvaria: AvariaConferencia = {
      ...this.avariaConferencia, // Mantém o ID caso esteja editando
      ...this.avariasForm.value,
      tiposAvarias: this.avariasSelecionadas,
    };
    this.avariasSalvas.emit(dadosAvaria);
    //this.activeModal.close();
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
    console.log(avaria);
    this.avariasSelecionadas = this.avariasSelecionadas.filter(a => a.id !== avaria.id);
  }
}
