import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';
import Swal from 'sweetalert2';

interface Registro {
  id: number;
  nome: string;
  cpf: string;
  qualificacao: string;
}

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss']
})
export class GenericFormComponent {
  @Input() titulo: string = 'Título Padrão'; // Título da modal
  @Input() frase: string = 'Cadastro de Registro'; // Frase dinâmica
  @Input() opcoesSelect: string[] = []; // Dados do Select

  @Output() saveEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<number>();

  form: FormGroup;
  @Input() registros: Registro[] = [];

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.form = this.fb.group({
      id: [0],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      ajudante: ['', Validators.required]
    });
  }

  adicionarRegistro(): void {
    if (this.form.valid) {
      const novoRegistro: Registro = {
        id: this.form.value.id,
        cpf: this.form.value.cpf,
        nome: this.form.value.nome,
        qualificacao: this.form.value.ajudante
      };

      this.saveEvent.emit(novoRegistro);
      this.form.reset();
    }
  }

  removerRegistro(index: number): void {
    const id = this.registros[index]?.id; // Obtém o ID do registro
    if (!id) return;

    Swal.fire({
      title: 'Excluir Registro!!!',
      text: "Tem certeza que deseja excluir o registro? Ação não poderá ser desfeita!!!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'SIM',
      cancelButtonText: 'NÃO',
    }).then((result) => {
      if (result.isConfirmed) {
        this.registros.splice(index, 1);
        this.removeEvent.emit(id); // 🔥 Passa o ID para o componente pai
      }
    });
  }

}
