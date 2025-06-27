import { Talie } from "../../models/talie.model";

export class DescargaExportacao {
    registro!: number;
    talie!: Talie | null;
    placa!: string;
    reserva!: string;
    cliente!: string;
    nomeConferente!: string;
    conferente!: number;
    //idConferente!: number;
    equipe: number = 0;
    isCrossDocking: boolean = false;
    conteiner: string = '';

    constructor(init?: Partial<DescargaExportacao>) {
        Object.assign(this, init);
    }
}