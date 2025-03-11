import { DescargaExportacaoItens } from "./descarga-exportacao-itens.model";

export interface DescargaExportacao{
    id: number;
    registro: number;
    inicio: Date;
    termino: Date;
    talie: number;
    placa: string;
    reserva: string;
    cliente: string;
    conferente: string;
    equipe: number;
    operacao: number;
    //itensDescarga: DescargaExportacaoItens[]
}