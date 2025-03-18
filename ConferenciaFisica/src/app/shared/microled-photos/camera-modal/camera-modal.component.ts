// camera-modal.component.ts
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss'],
})
export class CameraModalComponent implements OnInit, OnDestroy  {

  @Input() items: { id: number | string, name: string }[] = []; 
  @Output() fotoCapturada = new EventEmitter<{ imagemBase64: string, tipo: string }>(); // Emite a foto e o tipo
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private stream: MediaStream | null = null;
  tipoSelecionado: string = '';

  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log(this.items)
    
    this.abrirCamera();
  }

  abrirCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      this.stream = stream;
      const video = this.videoElement.nativeElement;
      this.renderer.setProperty(video, 'srcObject', stream);
      video.play();
    }).catch(err => {
      console.error("Erro ao acessar a câmera:", err);
      this.activeModal.dismiss();
    });
  }

  capturarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Converte a imagem para base64 e emite junto com o tipo selecionado
      const fotoBase64 = canvas.toDataURL('image/png');
      this.fotoCapturada.emit({ imagemBase64: fotoBase64, tipo: this.tipoSelecionado });
    }

    this.fecharCamera();
  }

  fecharCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.activeModal.dismiss();
  }

  onTipoSelecionado(event: Event): void {
    const target = event.target as HTMLSelectElement; // Faz o cast para HTMLSelectElement
    if (target) {
        this.tipoSelecionado = target.value; // Atualiza o tipo selecionado
    }
}


  ngOnDestroy(): void {
    this.fecharCamera();
  }
}