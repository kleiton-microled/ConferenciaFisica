import { StatusBaixa, StatusPayment } from "./enum-status";

export class PixModel {
    id: number = 0;
    cliente: string = ""; // Mapeia para o campo 'cliente' do endpoint
    dataCriacao: string = ""; // Mapeia para o campo 'dataCriacao' do endpoint
    valor: number = 0; // Mapeia para o campo 'valor' do endpoint
    status: boolean = false; // Mapeia para o campo 'status' do endpoint
    statusBaixa: string = ""; // Mapeia para o campo 'statusBaixa' do endpoint
    validade: string = ""; // Mapeia para o campo 'validade' do endpoint
    dataPagamento?: string | null; // Campo opcional para data de pagamento

    // Campos legados para compatibilidade
    get customer(): string {
        return this.cliente;
    }

    get createDate(): string {
        return this.dataCriacao;
    }

    get value(): number {
        return this.valor;
    }

    get statusPayment(): string {
        return this.status ? "Pago" : "Pendente";
    }

    get expirate(): string {
        return this.validade;
    }

    get paymentDate(): string | null {
        // Retorna a data de pagamento se existir, senão retorna null
        return this.dataPagamento || null;
    }

    constructor(init?: Partial<PixModel>) {
        Object.assign(this, init);
    }

    public static New(id: number, cliente: string, dataCriacao: string, valor: number, status: boolean, statusBaixa: string, validade: string, dataPagamento?: string | null) {
        var payment = new PixModel();

        payment.id = id;
        payment.cliente = cliente;
        payment.dataCriacao = dataCriacao;
        payment.valor = valor;
        payment.status = status;
        payment.statusBaixa = statusBaixa;
        payment.validade = validade;
        payment.dataPagamento = dataPagamento;

        return payment;
    }

    // Método estático para compatibilidade com código existente
    public static NewLegacy(id: number, customer: string, createDate: string, value: number, statusPayment: StatusPayment, statusBaixa: StatusBaixa, expirate: string, paymentDate: string) {
        var payment = new PixModel();

        payment.id = id;
        payment.cliente = customer;
        payment.dataCriacao = createDate;
        payment.valor = value;
        payment.status = statusPayment === StatusPayment.Ativo;
        payment.statusBaixa = statusBaixa.toString();
        payment.validade = expirate;
        payment.dataPagamento = paymentDate;

        return payment;
    }
}