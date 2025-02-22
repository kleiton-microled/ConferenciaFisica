import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-physical-conference-header',
  templateUrl: './physical-conference-header.component.html',
  styleUrl: './physical-conference-header.component.scss'
})
export class PhysicalConferenceHeaderComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  // Método para abrir a modal
  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg' }); // Abre a modal com tamanho grande (lg)
  }

  // Método para fechar a modal
  closeModal() {
    this.modalService.dismissAll(); // Fecha todas as modais abertas
  }
  
  inicializarFormulario(): void {
    this.form = this.fb.group({
      //pesquisa: [''],
      conteiner: [''],
      lote: [''],
      //numero: [{ value: '', disabled: true }],
      tipoCarga: [{ value: '', disabled: true }],
      viagem: [{ value: '', disabled: true }],
      motivoAbertura: [{ value: '', disabled: true }],
      embalagem: [''],
      quantidade: [{ value: '', disabled: true }],
      tipoConferencia: [{ value: '', disabled: false }],
      inicioConferencia: [{ value: '', disabled: false }],
      fimConferencia: [{ value: '', disabled: false }],
      cpfCliente: [{ value: '', disabled: true }],
      nomeCliente: [{ value: '', disabled: true }],
      retiradaAmostra: [{ value: '', disabled: true }],
      cpfConferente: [{ value: '', disabled: true }],
      nomeConferente: [{ value: '', disabled: true }],
      qtdDocumento: [{ value: '', disabled: true }],
      dataPrevista: [{ value: '', disabled: true }],
      quantidadeDivergente: [{ value: '', disabled: true }],
      qtdVolumesDivergentes: [{ value: '', disabled: true }],
      qtdRepresentantes: [{ value: '', disabled: true }],
      qtdAjudantes: [{ value: '', disabled: true }],
      qtdOperadores: [{ value: '', disabled: true }],
      divergenciaQualificacao: [{ value: '', disabled: true }],
      movimentacao: [{ value: '', disabled: true }],
      desunitizacao: [{ value: '', disabled: true }],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulário enviado:', this.form.value);
    } else {
      console.log('Formulário inválido');
    }
  }
}
