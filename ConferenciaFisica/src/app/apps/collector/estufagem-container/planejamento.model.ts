import { Talie } from "../models/talie.model";

export interface Planejamento extends Talie{
    cliente: string;
    reserva: string;
    conteiner: string;
    autonumRo: number;
    autonumBoo: number;
    autonumPatio: number;
    autonumTalie: number;
    yard: string;
    possuiMarcantes: boolean;
    qtdePlanejada: number;
    plan: number;
    ttl: number;
}