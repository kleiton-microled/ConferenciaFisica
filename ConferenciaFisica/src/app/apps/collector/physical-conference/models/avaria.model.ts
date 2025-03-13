import { TiposAvarias } from "src/app/shared/avarias/tipos-avarias.model";

export class AvariaConferencia {
    id: number = 0;
    idConferencia: number = 0;
    quantidadeAvariada: number = 0;
    pesoAvariado: number = 0;
    idEmbalagem: number = 0;
    conteiner: string = "";
    observacao: string = "";
    tiposAvarias: TiposAvarias[] = [];

    constructor(init?: Partial<AvariaConferencia>) {
        Object.assign(this, init);
    }
}
