export class DocumentosConferencia{
    id!: number;
    idConferencia!: number;
    numero!: string;
    tipo!:number;
    tipoDescricao!: string;

    public constructor(){}

    public static New(idConferencia: number, numero: string, tipo: number): DocumentosConferencia{
        let cadastro = new DocumentosConferencia();

        cadastro.idConferencia = idConferencia;
        cadastro.numero= numero;
        cadastro.tipo = tipo;
        return cadastro;
    }
}