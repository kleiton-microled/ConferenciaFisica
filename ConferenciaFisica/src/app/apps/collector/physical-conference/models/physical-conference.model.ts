import { LacresModel } from "./lacres.model";

export class PhysicalConferenceModel {
    id: number = 0;
    tipo: number = 0;
    cntr: string = "";
    bl: string = "";
    operacao: string = "";
    tipoCarga: string = "";
    viagem: string = "";
    dataPrevista: Date = new Date();
    motivoAbertura: string = "";
    embalagem: number = 0;
    quantidade: number = 0;
    tipoConferencia: number = 0;
    inicio: Date = new Date();
    fim: Date | null = null;
    cpfCliente: string | null = "";
    nomeCliente: string | null = "";
    retiradaAmostra: number = 0;
    cpfConferente: string = "";
    nomeConferente: string = "";
    qtdDocumento: number = 0;
    quantidadeDivergente: number = 0;
    quantidadeVolumesDivergentes: number = 0;
    quantidadeRepresentantes: number = 0;
    quantidadeAjudantes: number = 0;
    quantidadeOperadores: number = 0;
    conferenciaRemota: boolean = false;
    divergenciaQualificacao: number = 0;
    movimentacao: number = 0;
    desunitizacao: number = 0;
    observacao: string = "";
    lacres: LacresModel[] = [];

    observacaoDivergencia: string = "";

    constructor(init?: Partial<PhysicalConferenceModel>) {
        Object.assign(this, init);
    }
}


