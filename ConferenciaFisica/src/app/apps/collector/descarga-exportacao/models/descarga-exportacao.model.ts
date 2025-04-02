import { Talie } from "../../models/talie.model";

export class DescargaExportacao {
    registro!: number;
    talie!: Talie | null;
    placa!: string;
    reserva!: string;
    cliente!: string;
    nomeConferente: string = "Microled";
    conferente: number = 1;
    equipe: number = 0;

    constructor(init?: Partial<DescargaExportacao>) {
        Object.assign(this, init);
    }
}