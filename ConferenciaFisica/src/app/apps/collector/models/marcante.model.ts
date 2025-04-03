export class Marcante{
    id: number = 0;
    dataImpressao: string = "";
    dataAssociacao: string = "";
    quantidade: number =0;
    talieId: number = 0;
    talieItemId: number = 0;
    numero: number = 0;
    local: string = ""
    registro: number = 0;
    armazem: number = 0;
    marcante: string = "";

    constructor(init?: Partial<Marcante>) {
        Object.assign(this, init);
    }
}