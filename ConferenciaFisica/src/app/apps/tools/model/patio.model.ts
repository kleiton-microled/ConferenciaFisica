export class Patio {
    constructor(
        public id: number,
        public descricao: string
    ) { }

    static New(id?: number, label?: string): Patio {
        if (id == null || isNaN(id)) {
            throw new Error('ID do pátio inválido.');
        }

        return new Patio(id, label ?? '');
    }
}