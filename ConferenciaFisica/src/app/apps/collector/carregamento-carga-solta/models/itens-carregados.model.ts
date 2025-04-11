export class ItensCarregadosModel {
    
    id: number|null = null;
    marcante: number|null = null;
    lote: number|null = null;
    quantidade: number|null = null;

    constructor(init?: Partial<ItensCarregadosModel>) {
        Object.assign(this, init);
    }
}