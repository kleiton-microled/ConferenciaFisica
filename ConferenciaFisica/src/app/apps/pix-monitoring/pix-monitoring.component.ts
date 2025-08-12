import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { PixModel } from './model/pix.model';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { DomSanitizer } from '@angular/platform-browser';
import { StatusBaixa, StatusPayment } from './model/enum-status';
import { PixMonitoringService } from './pix-monitoring.service';
import { ServiceResult } from 'src/app/shared/models/serviceresult.model';
import { TotalPix } from './model/total-pix.model';
import { PixPaginatedResult } from './model/pix-paginated-result.model';

@Component({
  selector: 'app-pix-monitoring',
  templateUrl: './pix-monitoring.component.html',
  styleUrl: './pix-monitoring.component.scss'
})
export class PixMonitoringComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  paymentsList: PixModel[] = [];
  
  // Propriedades para paginação
  currentPage: number = 1;
  pageSize: number = 25;
  totalItems: number = 0;
  totalPages: number = 0;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  pixCounts = [
    { title: 'PIX Ativos', count: 0 },
    { title: 'PIX Pagos', count: 0 },
    { title: 'PIX Cancelados', count: 0 }
  ];

  //table
  isDisabled: boolean = false;
  columns: Column[] = [];
  selectedItem!: PixModel;

  constructor(private modalService: NgbModal, private sanitizer: DomSanitizer, private service: PixMonitoringService) { }

  ngOnInit(): void {

    this.loadPixTotals();

    this.loadPixData();

    //this.paymentsList.push(PixModel.New(1, 'Kleiton', '10-02-2025', 12.89, StatusPayment.Ativo, StatusBaixa.Pendente, '10-05-2025', '10-05-2025'));

    this.initAdvancedTableData();
  }

  /**
   * Carrega os totais de PIX usando os endpoints individuais
   */
  loadPixTotals(): void {
    // Busca total de PIX ativos
    this.service.getTotalPixAtivos().subscribe((ret: ServiceResult<number>) => {
      if (ret.status && ret.result !== undefined && ret.result !== null) {
        this.pixCounts[0].count = ret.result;
      }
    });

    // Busca total de PIX pagos
    this.service.getTotalPixPagos().subscribe((ret: ServiceResult<number>) => {
      if (ret.status && ret.result !== undefined && ret.result !== null) {
        this.pixCounts[1].count = ret.result;
      }
    });

    // Busca total de PIX cancelados
    this.service.getTotalPixCancelados().subscribe((ret: ServiceResult<number>) => {
      if (ret.status && ret.result !== undefined && ret.result !== null) {
        this.pixCounts[2].count = ret.result;
      }
    });
  }

  /**
   * Recarrega os totais de PIX (útil para atualizações em tempo real)
   */
  refreshPixTotals(): void {
    this.loadPixTotals();
  }

  /**
   * Carrega os dados PIX com paginação
   */
  loadPixData(page: number = 1): void {
    this.service.listWithPagination(page, this.pageSize).subscribe((ret: ServiceResult<PixPaginatedResult>) => {
      console.log(ret);
      if (ret.result) {
        this.paymentsList = ret.result.data;
        this.currentPage = ret.result.pageNumber;
        this.pageSize = ret.result.pageSize;
        this.totalItems = ret.result.totalCount;
        this.totalPages = ret.result.totalPages;
        this.hasNextPage = ret.result.hasNextPage;
        this.hasPreviousPage = ret.result.hasPreviousPage;
      }
    });
  }

  /**
   * Navega para a próxima página
   */
  nextPage(): void {
    if (this.hasNextPage) {
      this.loadPixData(this.currentPage + 1);
    }
  }

  /**
   * Navega para a página anterior
   */
  previousPage(): void {
    if (this.hasPreviousPage) {
      this.loadPixData(this.currentPage - 1);
    }
  }

  /**
   * Navega para uma página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadPixData(page);
    }
  }

  /**
   * Altera o tamanho da página
   */
  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.loadPixData(1); // Volta para a primeira página
  }

  /**
   * Gera um array com os números das páginas para exibição
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      // Se temos poucas páginas, mostra todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se temos muitas páginas, mostra um range inteligente
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
      
      // Ajusta o início se necessário
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Propriedade para acessar Math no template
  Math = Math;

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { size: "lg" });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  advancedFilter() { }

  /**
   * Advancedtable
   */
  handleTableLoad(event: any): void {
    document.querySelectorAll(".service").forEach((e) => {
      e.addEventListener("click", () => {

      });
    });

    // Adiciona event listeners para os botões de ação
    document.querySelectorAll(".reprocess-btn").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest('.reprocess-btn') as HTMLElement;
        if (button) {
          const pixId = parseInt(button.getAttribute('data-id') || '0');
          if (pixId > 0) {
            this.reprocessarBaixaPix(pixId);
          }
        }
      });
    });
  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "cliente",
        label: "Cliente",
        formatter: (item: PixModel) => item.cliente
      },
      {
        name: "dataCriacao",
        label: "Data de Criação",
        formatter: (item: PixModel) => formatDate(item.dataCriacao)
      },
      {
        name: "valor",
        label: "Valor",
        formatter: (item: PixModel) => formatCurrencyBRL(item.valor)
      },
      {
        name: "status",
        label: "Status Pagamento",
        formatter: this.statusFormatter.bind(this)
      },
      {
        name: "statusBaixa",
        label: "Status Baixa",
        formatter: (item: PixModel) => item.statusBaixa
      },
      {
        name: "validade",
        label: "Validade",
        formatter: this.validadeFormatter.bind(this)
      },
      {
        name: "paymentDate",
        label: "Data de Pagamento",
        formatter: (item: PixModel) => formatDate(item.paymentDate)
      },
      {
        name: "Action",
        label: "Atualizar",
        sort: false,
        formatter: this.serviceActionFormatter.bind(this),
      },
    ];
  }

  /**
   * Formata o status de pagamento com badges coloridos
   * @param item 
   * @returns 
   */
  statusFormatter(item: PixModel): any {
    if (item.status) {
      return this.sanitizer.bypassSecurityTrustHtml('<span class="badge bg-success">Pago</span>');
    } else {
      return this.sanitizer.bypassSecurityTrustHtml('<span class="badge bg-warning text-dark">Pendente</span>');
    }
  }

  /**
   * Formata a validade do PIX com cálculo de tempo restante
   * @param item 
   * @returns 
   */
  validadeFormatter(item: PixModel): any {
    const dataCriacao = new Date(item.dataCriacao);
    const dataExpiracao = new Date(dataCriacao.getTime() + (24 * 60 * 60 * 1000)); // +24 horas
    const agora = new Date();
    
    // Se já expirou
    if (agora > dataExpiracao) {
      return this.sanitizer.bypassSecurityTrustHtml('<span class="badge bg-danger">Expirado</span>');
    }
    
    // Calcula tempo restante
    const tempoRestante = dataExpiracao.getTime() - agora.getTime();
    const horas = Math.floor(tempoRestante / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));
    
    let textoValidade = '';
    if (horas > 0) {
      textoValidade = `${horas}h ${minutos}m restantes`;
    } else {
      textoValidade = `${minutos}m restantes`;
    }
    
    // Define cor baseada no tempo restante
    let corBadge = 'bg-success'; // Verde para muito tempo
    if (horas < 6) {
      corBadge = 'bg-warning text-dark'; // Amarelo para pouco tempo
    }
    if (horas < 1) {
      corBadge = 'bg-danger'; // Vermelho para menos de 1 hora
    }
    
    return this.sanitizer.bypassSecurityTrustHtml(`<span class="badge ${corBadge}">${textoValidade}</span>`);
  }

  /**
   * 
   * @param item 
   * @returns 
   */
  serviceActionFormatter(item: PixModel): any {
    return this.sanitizer.bypassSecurityTrustHtml(`
          <a href="javascript:void(0);" class="action-icon reprocess-btn" data-id="${item.id}" data-action="reprocess">
            <i class="mdi mdi-reload"></i>
          </a>
        `);
  }

  /**
   * Atualiza o status do PIX
   * @param pixId ID do PIX a ser atualizado
   */
  updatePixStatus(pixId: number): void {
    console.log(`Atualizando status do PIX com ID: ${pixId}`);
  }

  /**
   * Reprocessa a baixa do PIX
   * @param pixId ID do PIX a ser reprocessado
   */
  reprocessarBaixaPix(pixId: number): void {
    console.log(`Reprocessando baixa do PIX com ID: ${pixId}`);
    // Chama também o método de atualização
    this.updatePixStatus(pixId);
    
    // Atualiza os totais após a operação
    setTimeout(() => {
      this.refreshPixTotals();
    }, 1000); // Aguarda 1 segundo para a operação ser processada
  }

  /**
   * Selected row item
   * @param item 
   */
  onRowSelected(item: any): void {
    if (item) {
      this.selectedItem = item;
    }
  }

}

function formatDate(dateString: string | null | undefined): string {
  // Se a data for null, undefined ou string vazia, retorna string vazia
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);
  
  // Verifica se a data é válida
  if (isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam do zero
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}




