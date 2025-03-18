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
abrirModalEdicao(_t19: any) {
throw new Error('Method not implemented.');
}
salvarEdicao() {
throw new Error('Method not implemented.');
}
fecharModalEdicao() {
throw new Error('Method not implemented.');
}
  
  tiposFoto: string[] = ['Selfie', 'Documento', 'Outro'];
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
  
    // Passando os tipos de foto para o modal
    modalRef.componentInstance.items = [{id: 1, name:'Tipo1'}]; // Exemplo de tipos de foto
  
    modalRef.componentInstance.fotoCapturada.subscribe((foto: { imagemBase64: string, tipo: string }) => {
      this.adicionarFoto(foto.imagemBase64, foto.tipo); // Ajuste para receber o tipo também
    });
  }
  adicionarFoto(fotoBase64: string, tipo : string) { 
    console.log(tipo)
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
