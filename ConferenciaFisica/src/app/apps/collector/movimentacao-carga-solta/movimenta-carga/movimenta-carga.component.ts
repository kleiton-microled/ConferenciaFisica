import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovimentacaoCargaSolta } from '../carga.model';
import { map, Observable, Subscription } from 'rxjs';
import { MovimentacaoCargaSoltaService } from '../movimentacao-carga-solta.service';
import { DescargaExportacaoService } from '../../descarga-exportacao/descarga-exportacao.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { Armazen } from '../../models/armazens.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { SelectizeModel } from 'src/app/shared/microled-select/microled-select.component';

@Component({
  selector: 'app-movimenta-carga',
  templateUrl: './movimenta-carga.component.html',
  styleUrls: ['./movimenta-carga.component.scss']
})
export class MovimentaCargaComponent implements OnInit {

  @ViewChild('modalMovimentacao') modalMovimentacaoRef: any;

  form!: FormGroup;
  modalForm!: FormGroup;

  locais = ['Depósito 1', 'Depósito 2'];
  armazens: SelectizeModel[] = [];
  motivos = ['Transferência', 'Ajuste de estoque'];

  cargaSelecionada: MovimentacaoCargaSolta = new MovimentacaoCargaSolta();

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private service: MovimentacaoCargaSoltaService,
    private descargaService: DescargaExportacaoService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.service.getCargaAtual().subscribe(carga => {
      if (carga) {
        this.cargaSelecionada = carga;
        this.form.patchValue(carga);
      }
    });

    this.form = this.fb.group({
      item: [1],
      numeroMarcante: [this.cargaSelecionada.numeroMarcante ?? '--'],
      lote: [this.cargaSelecionada.lote ?? '--'],
      reserva: [this.cargaSelecionada.reserva ?? '--'],
      etiquetaPrateleira: [this.cargaSelecionada.etiquetaPrateleira ?? '--'],
      local: [this.cargaSelecionada.local ?? '--'],
      embalagem: [this.cargaSelecionada.embalagem ?? '--'],
      anvisa: [this.cargaSelecionada.anvisa ?? '--'],
      quantidade: [this.cargaSelecionada.quantidade ?? '--'],
      armazem: [this.cargaSelecionada.armazem ?? '--'],
      imo: [this.cargaSelecionada.imo ?? '--'],
      uno: [this.cargaSelecionada.uno ?? '--']
    });

    this.modalForm = this.fb.group({
      idMarcante: [''],
      local: [''],
      armazem: [''],
      motivo: ['']
    });

    this.buscarArmazens();

    this.atualizarBotoes([{ nome: 'save', enabled: true, visible: true }]);
  }

  openModal(): void {
    if (this.cargaSelecionada.idMarcante > 0) {
      this.modalForm.reset();
      this.modalService.open(this.modalMovimentacaoRef, { centered: true, size: 'lg' });
    } else {
      this.notificationService.showMessage("Selecione uma carga para movimentar.", "Info");
    }

  }

  get armazenControl(): FormControl {
    return this.modalForm.get('armazem') as FormControl;
  }

  get armazemControl(): FormControl {
    return this.modalForm.get('armazem') as FormControl;
  }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  submitMovimentacao(modalRef: any): void {
    if (this.modalForm.valid) {

      this.cargaSelecionada.armazem = this.modalForm.controls['armazem'].value;
      this.cargaSelecionada.local = this.modalForm.controls['local'].value;
      this.cargaSelecionada.motivo = this.modalForm.controls['motivo'].value;

      this.service.movimentarCargaSolta(this.cargaSelecionada).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status && ret.result) {
          this.notificationService.showMessage("Carga movimentada com sucesso!");
          this.service.getCargaParaMovimentacao(this.cargaSelecionada.idMarcante).subscribe((ret: ServiceResult<MovimentacaoCargaSolta>) => {
            if (ret.status && ret.result) {
              this.cargaSelecionada = ret.result;
            }
          });
        } else {
          this.notificationService.showError(ret);
        }
      });
      modalRef.close();
    }
  }

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', 'dragItem');
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text');
    if (data === 'dragItem' && this.cargaSelecionada.idMarcante > 0) {
      this.openModal(); // abre modal ao fazer drop
    }
  }

  buscarLocais = (termo: string): Observable<{ value: any; descricao: string }[]> => {
    return this.descargaService.getYard(termo).pipe(
      // Transforma o retorno em { value, descricao }
      map((res: any[]) => res.map(item => ({
        value: item.id,
        descricao: item.descricao
      })))
    );
  };

  onLocalSelecionado(local: { value: any; descricao: string }) {
    if (!local.value) {
      this.modalForm.get('local')?.reset(); // limpa se inválido
    } else {
      this.modalForm.get('local')?.setValue(local.descricao);
    }
  }

  onArmazemSelectChange(value: any) {
    console.log(value);
    this.form.controls['armazem'].setValue(value);
  }

  buscarArmazens() {
    this.descargaService.getArmazens(2).subscribe((ret: ServiceResult<Armazen[]>) => {
      if (ret.status && ret.result) {
        this.armazens = ret.result.map(c => ({
          id: c.id,
          label: c.descricao
        }));
      } else {
        this.armazens = [];
      }
    });
  }

  //#region HELPERS
  /**
   * Atualiza o estado dos botoes do action footer
   * @param botoes 
   */
  atualizarBotoes(botoes: { nome: string; enabled?: boolean; visible?: boolean }[]): void {
    const novoEstado = { ...this.footerButtonsState };

    botoes.forEach(botao => {
      if (novoEstado[botao.nome]) {
        if (botao.enabled !== undefined) {
          novoEstado[botao.nome].enabled = botao.enabled;
        }
        if (botao.visible !== undefined) {
          novoEstado[botao.nome].visible = botao.visible;
        }
      }
    });

    this.footerButtonsState = novoEstado;
  }

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: false },
    exit: { enabled: true, visible: true },
    save: { enabled: false, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false },
    estufar: { enabled: false, visible: false }
  };
  //#endregion
}
