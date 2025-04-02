export class RegistrarSaidaCaminhao {
    preRegistroId!: number;
    placa!: string;
    placaCarreta!: string;
    protocolo!: string;
    pesoBruto!: number;
    gateIn!: boolean;
    gateOut!: boolean;

    constructor(init?: Partial<RegistrarSaidaCaminhao>) {
        Object.assign(this, init);
    }
}