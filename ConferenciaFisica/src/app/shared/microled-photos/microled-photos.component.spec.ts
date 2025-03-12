import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CameraModalComponent } from './camera-modal/camera-modal.component';

interface Foto {
  id: number;
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
  private nextId = 1; // Gerador de ID para fotos

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

    modalRef.componentInstance.fotoCapturada.subscribe((fotoBase64: string) => {
      this.adicionarFoto(fotoBase64);
    });
  }

  adicionarFoto(fotoBase64: string) {
    const novaFoto: Foto = {
      id: this.nextId++,
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
}
