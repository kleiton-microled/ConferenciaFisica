import { StatusBaixa, StatusPayment } from "./enum-status";

export class PixModel {
    id: number = 0;
    customer: string = "";
    createDate: string = "";
    value: number = 0;
    statusPayment: StatusPayment = 1;
    statusBaixa: StatusBaixa = 1;
    expirate: string= "";
    paymentDate: string = "";

     constructor(init?: Partial<PixModel>) {
        Object.assign(this, init);
    }

    public static New(id: number, customer: string, createDate: string, value: number, statusPayment: StatusPayment, statusBaixa: StatusBaixa, expirate: string, paymentDate: string){
        var payment = new PixModel();

        payment.id = id;
        payment.customer = customer;
        payment.createDate = createDate;
        payment.value = value;
        payment.statusPayment = statusPayment;
        payment.statusBaixa = statusBaixa;
        payment.expirate = expirate;
        payment.paymentDate = paymentDate;

        return payment;
    }

}