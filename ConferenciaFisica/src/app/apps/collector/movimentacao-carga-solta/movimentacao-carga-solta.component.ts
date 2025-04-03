import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms'; // Importe o ReactiveFormsModule
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhysicalConferenceService } from '../physical-conference/physical-conference.service';
import { PhysicalConferenceStorageService } from '../physical-conference/physical-conference-storage.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DescargaExportacaoService } from '../descarga-exportacao/descarga-exportacao.service';
import { Armazen } from '../models/armazens.model';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { map, Observable } from 'rxjs';
import { ColetorService } from '../collector.service';
import { MovimentacaoCargaSoltaService } from './movimentacao-carga-solta.service';
import { MovimentacaoCargaSolta } from './carga.model';

@Component({
  selector: 'app-movimentacao-carga-solta',
  templateUrl: './movimentacao-carga-solta.component.html',
  styleUrl: './movimentacao-carga-solta.component.scss',
})
export class MovimentacaoCargaSoltaComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  motivos = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  listaArmazens: Armazen[] = [];

  onSelectChange(value: any): void {
    console.log("Selecionado:", value);
  }

  footerButtonsState: { [key: string]: { enabled: boolean; visible: boolean } } = {
    start: { enabled: false, visible: false },
    stop: { enabled: false, visible: false },
    alert: { enabled: false, visible: false },
    clear: { enabled: false, visible: false },
    exit: { enabled: true, visible: true },
    save: { enabled: true, visible: true },
    delete: { enabled: false, visible: false },
    photo: { enabled: false, visible: false },
    marcante: { enabled: false, visible: false },
    observacao: { enabled: false, visible: false }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private conferenceService: PhysicalConferenceService,
    private storageService: PhysicalConferenceStorageService,
    private notificationService: NotificationService,
    private descargaService: DescargaExportacaoService,
    private service: ColetorService,
    private movimentacaoCargaService: MovimentacaoCargaSoltaService
  ) {

  }

  ngOnInit(): void {
    //this.loadArmazens(null);
  }

  openModalMovimentacao() {
  //  this.modalService. openModal();
    }

  redirecionarHome() {
    this.router.navigate(['/apps/tools']);
  }

  //Selects: listas de dados de dominio
  loadArmazens(patios: number[] | null) {
    this.descargaService.getArmazens(7).subscribe((ret: ServiceResult<Armazen[]>) => {
      if (ret.status) {
        this.listaArmazens = ret.result ?? [];
      }
    });
  }

  buscarMarcantes = (termo: string): Observable<{ value: any; descricao: string }[]> => {
    return this.service.getMarcantes(termo).pipe(
      // Transforma o retorno em { value, descricao }
      map((res: any[]) => res.map(item => ({
        value: item.id,           // ou o campo correto da sua API
        descricao: item.numero // ou nome, label, etc
      })))
    );
  };

  onMarcanteSelecionado(marcante: { value: any; descricao: string }) {
    if (marcante) {
      console.log(marcante);
      this.movimentacaoCargaService.getCargaParaMovimentacao(marcante.value).subscribe((ret: ServiceResult<MovimentacaoCargaSolta>) => {
        if (ret.status && ret.result) {
          this.movimentacaoCargaService.updateCarga(ret.result);
          this.movimentacaoCargaService.getCargaAtual().subscribe((ret: MovimentacaoCargaSolta | null)=>{
            console.log('Atualizado: ', ret);
          });
         
        }
      });
    }
  }

}