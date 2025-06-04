import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TiposDocumentos } from '../models/tipos-documentos.model';
import { DocumentosConferencia } from '../models/documentos-conferencia.model';
import Swal from 'sweetalert2';

interface Documento {
  numeroDocumento: string;
  tipoDocumento: number;
}

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent {
  @Input() tiposDocumentos:TiposDocumentos[] = [];
  @Input() registros: DocumentosConferencia[] = [];

  @Output() documentoAdicionado = new EventEmitter<Documento>();

  @Output() saveEvent = new EventEmitter<DocumentosConferencia>();
  @Output() removeEvent = new EventEmitter<number>();

  documentoForm: FormGroup;
  documentos: DocumentosConferencia[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.documentoForm = this.fb.group({
      numero: ['', Validators.required],
      tipo: ['', Validators.required]
    });
  }

  adicionarDocumento(): void {
    if (this.documentoForm.valid) {
      let novoDocumento: DocumentosConferencia = this.documentoForm.value;
      novoDocumento.tipoDescricao = this.tiposDocumentos.find(x=>x.id == novoDocumento.tipo)?.descricao ?? "";

      this.documentos.push(novoDocumento);
      this.saveEvent.emit(novoDocumento);
      this.documentoForm.reset();
    }
  }

  /**
   * Evento para remover um registro
   * @param index 
   * @returns 
   */
  removerDocumento(index: number): void {
      const id = this.registros[index]?.id; // Obtém o ID do registro
      if (!id) return;
  
      Swal.fire({
        title: 'Excluir Registro!!!',
        text: "Tem certeza que deseja excluir o documento? Ação não poderá ser desfeita!!!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      }).then((result) => {
        if (result.isConfirmed) {
          this.registros.splice(index, 1);
          this.removeEvent.emit(id); 
        }
      });
    }

  fecharModal(): void {
    this.activeModal.close();
  }
}
