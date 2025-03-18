import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CameraModalComponent } from './camera-modal/camera-modal.component';

interface Foto {
  id: number;
  descricao:string;
  observacao:string;
  imagemBase64: string;
}

@Component({
  selector: 'app-microled-photos',
  templateUrl: './microled-photos.component.html',
  styleUrls: ['./microled-photos.component.scss']
})
export class MicroledPhotosComponent implements OnInit {
  
  @Input() conteiner: string = ''; 
  fotos: Foto[] = [];
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

  ngOnInit(): void {}

  abrirCamera() {
    const modalRef = this.modalService.open(CameraModalComponent, { size: 'xl', backdrop: 'static', centered: true });
    modalRef.componentInstance.items = [{id: 1, name:'Tipo1'}];
    
    modalRef.componentInstance.fotoCapturada.subscribe((fotoBase64: string) => {
      this.adicionarFoto(fotoBase64);
    });
  }

  adicionarFoto(fotoBase64: string) {
    const novaFoto: Foto = {
      id: this.nextId++,
      descricao:"",
      observacao:"",
      imagemBase64: fotoBase64
    };
    
    this.fotos.push(novaFoto);
  }

  excluirFoto(id: number) {
    this.fotos = this.fotos.filter(foto => foto.id !== id);
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
    }
    this.fecharModalEdicao();
  }

  fecharModalEdicao() {
    console.log('tentou fechar');
    console.log(this.modalRef);
    if (this.modalRef) {
      console.log(this.modalRef);
      this.modalRef.close(); // 🔥 Fecha apenas a modal de edição
    }
  }
  
}
