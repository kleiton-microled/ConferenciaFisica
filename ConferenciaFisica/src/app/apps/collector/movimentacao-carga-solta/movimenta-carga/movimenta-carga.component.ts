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
  armazens: Armazen[] = [];
  motivos = ['Transferência', 'Ajuste de estoque'];

  cargaSelecionada: MovimentacaoCargaSolta = new MovimentacaoCargaSolta();

  constructor(private fb: FormBuilder,
    private modalService: NgbModal,
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
      idMarcante:[''],
      local: [''],
      armazem: [''],
      motivo: ['']
    });

    this.buscarArmazens();
  }

  openModal(): void {
    this.modalForm.reset();
    this.modalService.open(this.modalMovimentacaoRef, { centered: true, size: 'lg' });
  }

  get armazenControl(): FormControl {
    return this.form.get('armazem') as FormControl;
  }

  submitMovimentacao(modalRef: any): void {
    if (this.modalForm.valid) {
      
      this.modalForm.get('idMarcante')?.setValue(this.cargaSelecionada.idMarcante);
      const dados = this.modalForm.value;

      console.log('Movimentação confirmada:', dados);

      this.service.movimentarCargaSolta(dados).subscribe((ret: ServiceResult<boolean>) => {
        if (ret.status && ret.result) {
          this.notificationService.showSuccess(ret);
          this.service.getCargaParaMovimentacao(this.cargaSelecionada.idMarcante).subscribe((ret: ServiceResult<MovimentacaoCargaSolta>)=>{
            if(ret.status && ret.result){
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
    if (data === 'dragItem') {
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
    console.log(local);
    if (!local.value) {
      this.modalForm.get('local')?.reset(); // limpa se inválido
    } else {
      this.modalForm.get('local')?.setValue(local.descricao);
    }
  }

  buscarArmazens() {
    this.descargaService.getArmazens(2).subscribe((ret: ServiceResult<Armazen[]>) => {
      if (ret.status) {
        console.log('buscarArmazens: ', ret);
        this.armazens = ret.result ?? [];
      }
    });
  }
}
