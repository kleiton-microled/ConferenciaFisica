export class TalieItem {
    id!: number;
    notaFiscal!: string;
    embalagem!: string;
    quantidadeNf!: number;
    quantidadeDescarga!: number;
    imo!: string;
    imO2!: string;
    imO3!: string;
    imO4!: string;
    uno!: string;
    unO2!: string;
    unO3!: string;
    unO4!: string;
    fumigacao!: string;
    comprimento!: number;
    largura!: number;
    altura!: number;
    peso!:number;
    fragil!: boolean;
    madeira!: boolean;
    codigoEmbalagem!: string;
    observacao!: string;
    carimbo: boolean = false;
    cargaNumerada: boolean = false;
}