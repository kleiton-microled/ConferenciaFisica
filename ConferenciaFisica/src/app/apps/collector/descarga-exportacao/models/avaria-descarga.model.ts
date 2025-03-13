import { TiposAvarias } from "src/app/shared/avarias/tipos-avarias.model";

export class AvariaDescarga{
    talieId: number = 0;
    local:number = 0;
    divergencia: boolean = false;
    quantidadeAvariada: number = 0;
    pesoAvariado: number = 0;
    observacao: string = '';
    tiposAvarias: TiposAvarias[] = []

    constructor(init?: Partial<AvariaDescarga>) {
        Object.assign(this, init);
    }
}
