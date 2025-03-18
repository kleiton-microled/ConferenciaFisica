import { TalieItem } from "./talie-item.model";

export class Talie{
    id!: number;
    inicio!: string;
    termino!: string;
    conferente: string = "Microled";
    equipe!: number;
    operacao!: number;
    observacao!: string;
    talieItem!: TalieItem[]
}