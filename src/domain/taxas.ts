export type MetodoPagamento = 'PIX' | 'CARTAO';

export interface ResultadoTaxa {
  porcentagem: number; // % da taxa aplicada ao produto
  valorTaxa: number;   // valor em R$ da taxa
  valorLiquido: number; // valor que o produtor recebe
}

/**
 * Calcula a taxa da plataforma e o valor líquido do produtor
 */
export function calcularTaxaProdutor(
  preco: number,
  metodo: MetodoPagamento,
  parcelas: number
): ResultadoTaxa {
  if (metodo === 'PIX') {
    return {
      porcentagem: 0,
      valorTaxa: 0,
      valorLiquido: preco,
    };
  }

  if (parcelas === 1) {
    const porcentagem = 3.99;
    const valorTaxa = Number((preco * (porcentagem / 100)).toFixed(2));
    return {
      porcentagem,
      valorTaxa,
      valorLiquido: Number((preco - valorTaxa).toFixed(2)),
    };
  }

  const porcentagem = 4.99 + (parcelas - 1) * 2;
  const valorTaxa = Number((preco * (porcentagem / 100)).toFixed(2));

  return {
    porcentagem,
    valorTaxa,
    valorLiquido: Number((preco - valorTaxa).toFixed(2)),
  };
}
