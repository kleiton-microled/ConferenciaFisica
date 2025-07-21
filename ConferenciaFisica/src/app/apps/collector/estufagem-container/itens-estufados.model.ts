export interface ItensEstufados {
    nr: number;                    // Número da linha (ROW_NUMBER)
    qtdeSaida: number;             // Quantidade de saída
    autonumSc: number;             // Código interno da saída
    descricaoEmbalagem?: string;   // Descrição da embalagem
    codigoProduto?: string;        // Código do produto
    descricaoProduto?: string;     // Descrição do produto
    numeroNotaFiscal?: string;     // Número da nota fiscal
    reserva?: string;            // Referência do booking
    autonumBoo: number;            // Código do booking
    lote?: string;                 // Lote (OS)
    autonumSdBoo: number;          // Código secundário do booking (SD)
    autonumRcs: number;            // Código da conferência
    codigoBarra?: string;          // Código de barras (repetição do codproduto)
  }
  