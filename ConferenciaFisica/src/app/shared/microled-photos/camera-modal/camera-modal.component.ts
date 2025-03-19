import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FotoCapturada } from './foto-capturada.model';
import { EnumValue } from '../../models/enumValue.model';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss'],
})
export class CameraModalComponent implements OnInit, OnDestroy  {

  @Input() types: EnumValue[] = []; 
  @Output() fotoCapturada = new EventEmitter<FotoCapturada>();
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  private stream: MediaStream | null = null;
  tipoSelecionado: number = 0;

  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log(this.types + 'eee')
    
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

      const fotoBase64 = canvas.toDataURL('image/png');
      console.log({ imagemBase64: fotoBase64, tipo: this.tipoSelecionado })
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

  onTipoSelecionado(value: number): void {// Faz o cast para HTMLSelectElement
    console.log(value);
    if (value) {
        this.tipoSelecionado = value; // Atualiza o tipo selecionado
    }

    console.log( this.tipoSelecionado);
}


  ngOnDestroy(): void {
    this.fecharCamera();
  }
}