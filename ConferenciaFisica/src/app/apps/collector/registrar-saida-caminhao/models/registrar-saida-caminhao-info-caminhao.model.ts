export class RegistrarSaidaCaminhaoInfoCaminhao {
    preRegistroId!: number;
    placa!: string;
    placaCarreta!: string;
    protocolo!: string;
    pesoBruto!: number;
    gateIn!: boolean;
    gateOut!: boolean;

    constructor(init?: Partial<RegistrarSaidaCaminhaoInfoCaminhao>) {
        Object.assign(this, init);
    }
}