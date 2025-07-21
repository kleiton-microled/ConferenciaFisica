export class CadastroAdicionalModel {
    id: number = 0;
    idConferencia: number = 0;
    nome: string = "";
    cpf: string = "";
    qualificacao: string = "";
    tipo: string = "";

    public constructor(){}

    public static New(idConferencia: number, nome: string, cpf: string, qualificacao: string, tipo: string): CadastroAdicionalModel{
        let cadastro = new CadastroAdicionalModel();

        cadastro.idConferencia = idConferencia;
        cadastro.nome = nome;
        cadastro.cpf = cpf;
        cadastro.qualificacao = qualificacao;
        cadastro.tipo = tipo;

        return cadastro;
    }
}