import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss']
})
export class CameraModalComponent implements OnInit, OnDestroy {

  @Output() fotoCapturada = new EventEmitter<string>(); // Emite a foto para o componente pai
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  
  private stream: MediaStream | null = null;

  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) {}

  ngOnInit(): void {
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
      
      // Converte a imagem para base64 e envia para o componente pai
      const fotoBase64 = canvas.toDataURL('image/png');
      this.fotoCapturada.emit(fotoBase64);
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

  ngOnDestroy(): void {
    this.fecharCamera();
  }
}
