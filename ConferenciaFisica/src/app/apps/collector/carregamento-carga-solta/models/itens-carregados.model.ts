export class ItensCarregadosModel {
    
    id: number|null = null;
    ordemCarreg: number|null = null;
    lote: number|null = null;
    quantidade: number|null = null;
    qtdeCarregada: number|null = null;
    embalagem: string|null = null;

    constructor(init?: Partial<ItensCarregadosModel>) {
        Object.assign(this, init);
    }
}