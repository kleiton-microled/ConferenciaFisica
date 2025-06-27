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

@Component({
  selector: 'app-pix-monitoring',
  templateUrl: './pix-monitoring.component.html',
  styleUrl: './pix-monitoring.component.scss'
})
export class PixMonitoringComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];

  paymentsList: PixModel[] = [];

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

    this.service.getTotals().subscribe((ret: ServiceResult<TotalPix>) => {
      console.log(ret);
      this.pixCounts = [
        { title: 'PIX Ativos', count: ret.result?.totalActive ?? 0 },
        { title: 'PIX Pagos', count: ret.result?.totalPayment ?? 0 },
        { title: 'PIX Cancelados', count: ret.result?.totalCanceled ?? 0 }
      ];
    });

    this.service.list().subscribe((ret: ServiceResult<PixModel[]>) => {
      console.log(ret);
      this.paymentsList = ret.result ?? [];
    });


    //this.paymentsList.push(PixModel.New(1, 'Kleiton', '10-02-2025', 12.89, StatusPayment.Ativo, StatusBaixa.Pendente, '10-05-2025', '10-05-2025'));

    this.initAdvancedTableData();
  }

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
  }

  initAdvancedTableData(): void {
    this.columns = [
      {
        name: "customer",
        label: "Cliente",
        formatter: (item: PixModel) => item.customer
      },
      {
        name: "createDate",
        label: "Data de Criação",
        formatter: (item: PixModel) => formatDate(item.createDate)
      },
      {
        name: "value",
        label: "Valor",
        formatter: (item: PixModel) => formatCurrencyBRL(item.value)
      },
      {
        name: "statusPayment",
        label: "Status Pagamento",
        formatter: (item: PixModel) => item.statusPayment
      },
      {
        name: "statusBaixa",
        label: "Status Baixa",
        formatter: (item: PixModel) => item.statusBaixa
      },
      {
        name: "expirate",
        label: "Validade",
        formatter: (item: PixModel) => item.expirate
      },
      {
        name: "paymentDate",
        label: "Data de Pagamento",
        formatter: (item: PixModel) => formatDate(item.paymentDate)
      },
      {
        name: "Action",
        label: "Action",
        sort: false,
        formatter: this.serviceActionFormatter.bind(this),
      },
    ];
  }

  /**
   * 
   * @param item 
   * @returns 
   */
  serviceActionFormatter(item: PixModel): any {
    return this.sanitizer.bypassSecurityTrustHtml(`
          <a href="javascript:void(0);" class="action-icon edit-btn" data-id="${item.id}">
            <i class="mdi mdi-square-edit-outline"></i>
          </a>
          <a href="javascript:void(0);" class="action-icon delete-btn ${this.isDisabled ? 'disabled' : ''}" 
           data-id="${item.id}"
           style="${this.isDisabled ? 'pointer-events: none; opacity: 0.5;' : ''}">
          <i class="mdi mdi-delete"></i>
        </a>
        `);
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);

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




