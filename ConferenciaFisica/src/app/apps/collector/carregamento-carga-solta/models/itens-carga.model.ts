import { CarregamentoCargaSoltaModel } from "./carregamento-carga-solta.model";
import { ItensCarregadosModel } from "./itens-carregados.model";

export class ItensCargaModel{
    
    carregamento: CarregamentoCargaSoltaModel[]|null = null;
    carregados: ItensCarregadosModel[]|null = null;

    constructor(init?: Partial<ItensCargaModel>) {
        Object.assign(this, init);
    }
}