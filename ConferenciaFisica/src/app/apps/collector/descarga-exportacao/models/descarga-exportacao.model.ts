import { Talie } from "../../models/talie.model";

export class DescargaExportacao {
    registro!: number;
    talie!: Talie | null;
    placa!: string;
    reserva!: string;
    cliente!: string;

    constructor(init?: Partial<DescargaExportacao>) {
        Object.assign(this, init);
    }
}