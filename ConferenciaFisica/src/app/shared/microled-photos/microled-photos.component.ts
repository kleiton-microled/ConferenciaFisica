import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CameraModalComponent } from './camera-modal/camera-modal.component';
import { EnumValue } from '../models/enumValue.model';
import { FotoCapturada } from './camera-modal/foto-capturada.model';

export interface Foto {
  talieId: number | null;
  id: number;
  descricao: string;
  observacao: string;
  type: number;
  typeDescription: string;
  imagemBase64: string;
  imagemPath: string | null;
}

@Component({
  selector: 'app-microled-photos',
  templateUrl: './microled-photos.component.html',
  styleUrls: ['./microled-photos.component.scss']
})
export class MicroledPhotosComponent implements OnInit {

  @Input() conteiner: string = '';
  @Input() photosTypes: EnumValue[] = [];
  @Output() salvarFotoEmitter = new EventEmitter<Foto>();
  @Output() salvarAlteracaoFotoEmitter = new EventEmitter<Foto>();
  @Output() excluirFotoEmitter = new EventEmitter<Foto>();
  fotos: Foto[] = [];
  urlBasePhotos: string ='';
  fotosForm: FormGroup;
  fotoEditando!: Foto | null;

  private modalRef!: NgbModalRef;

  private nextId = 1; // Gerador de ID para fotos
  @ViewChild('editPhotoModal') editPhotoModal!: any;
  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {
    this.fotosForm = this.fb.group({
      descricao: ['', Validators.required],
      observacao: ['']
    });
  }

  ngOnInit(): void { }

  abrirCamera() {
    const modalRef = this.modalService.open(CameraModalComponent, { size: 'xl', backdrop: 'static', centered: true });
    modalRef.componentInstance.types = this.photosTypes;

    modalRef.componentInstance.fotoCapturada.subscribe((resultado: FotoCapturada) => {
      this.adicionarFoto(resultado);
    });
  }

  adicionarFoto(resultado: FotoCapturada) {
    const novaFoto: Foto = {
      id: this.nextId++,
      descricao: "",
      observacao: "",
      type: resultado.tipo,
      typeDescription: resultado.tipoDescription,
      imagemBase64: resultado.imagemBase64,
      talieId: null,
      imagemPath: null
    };
    
    this.fotos.push(novaFoto);
    
    this.salvarFotoEmitter.emit(novaFoto);
  }

  excluirFoto(id: number) {
    let foto = this.fotos.find(foto => foto.id === id);
    if (foto) {
      this.excluirFotoEmitter.emit(foto);
      this.fotos = this.fotos.filter(foto => foto.id !== id);
    }
   
  }

  fecharModal(): void {
    this.activeModal.dismiss();
  }

  abrirModalEdicao(foto: Foto) {
    this.fotoEditando = foto;
    this.fotosForm.patchValue({
      descricao: foto.descricao,
      observacao: foto.observacao
    });
    this.modalRef = this.modalService.open(this.editPhotoModal, { size: 'md', backdrop: 'static' });
  }

  salvarEdicao() {
    if (this.fotoEditando) {
      this.fotoEditando.descricao = this.fotosForm.value.descricao;
      this.fotoEditando.observacao = this.fotosForm.value.observacao;

      this.salvarAlteracaoFotoEmitter.emit(this.fotoEditando);
    }
    this.fecharModalEdicao();
  }

  salvarFotos() : void {
    // this.salvarFotosEmitter.emit(this.fotos);
  }

  fecharModalEdicao() {
    if (this.modalRef) {
      console.log(this.modalRef);
      this.modalRef.close(); // 🔥 Fecha apenas a modal de edição
    }
  }

}
