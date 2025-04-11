export class CarregamentoCargaSoltaModel{
    
    id: number|null = null;
    numOc: number|null = null;
    lote: number|null = null;
    quantidade: number|null = null;
    carregado: number|null = null;
    embalagem: string|null = null;

    constructor(init?: Partial<CarregamentoCargaSoltaModel>) {
        Object.assign(this, init);
    }
}