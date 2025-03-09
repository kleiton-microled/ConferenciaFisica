import { TiposAvarias } from "src/app/shared/avarias/tipos-avarias.model";

export interface AvariaConferencia{
    id: number;
    idConferencia: number;
    quantidadeAvariada: number;
    pesoAvariado: number;
    idEmbalagem: number;
    conteiner: string;
    observacao: string;
    tiposAvarias: TiposAvarias[]
}
