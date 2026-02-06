'use client';
import { useState } from 'react';
import {  calcularTaxaProdutor, MetodoPagamento, ResultadoTaxa } from '../taxas';

interface Produto {
  id: number;
  nome: string;
  precoOriginal: number;
  precoAtual: number;
  produtor: string;
  formato: string;
  tempoEntrega: string;
}

interface CheckoutFormProps {
  produto: Produto;
}

export function CheckoutForm({ produto }: CheckoutFormProps) {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('PIX');
  const [parcelas, setParcelas] = useState(1);

  // Calcula taxa e valor líquido do produtor
  const taxa: ResultadoTaxa = calcularTaxaProdutor(
    produto.precoAtual,
    metodoPagamento,
    parcelas
  );

  // Taxa para comparação com PIX
  const taxaPix = calcularTaxaProdutor(produto.precoAtual, 'PIX', 1);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{produto.nome}</h1>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      {/* CPF */}
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      {/* Método de Pagamento */}
      <div className="mb-2">
        <label className="mr-2">
          <input
            type="radio"
            value="PIX"
            checked={metodoPagamento === 'PIX'}
            onChange={() => setMetodoPagamento('PIX')}
            className="mr-1"
          />
          PIX
        </label>
        <label>
          <input
            type="radio"
            value="CARTAO"
            checked={metodoPagamento === 'CARTAO'}
            onChange={() => setMetodoPagamento('CARTAO')}
            className="mr-1"
          />
          Cartão
        </label>
      </div>

      {/* Parcelas */}
      {metodoPagamento === 'CARTAO' && (
        <select
          value={parcelas}
          onChange={(e) => setParcelas(Number(e.target.value))}
          className="w-full border p-2 mb-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}x
            </option>
          ))}
        </select>
      )}

      {/* Resumo */}
      <div className="border p-2 rounded bg-gray-50">
        <p>Valor do produto: R${produto.precoAtual.toFixed(2)}</p>
        <p>Total do comprador: R${produto.precoAtual.toFixed(2)}</p>
        <p>Taxa Cakto: R${taxa.valorTaxa.toFixed(2)}</p>
        <p>Valor líquido do produtor: R${taxa.valorLiquido.toFixed(2)}</p>
        {metodoPagamento === 'CARTAO' && (
          <p>
            Economia escolhendo PIX: R${(taxaPix.valorTaxa - taxa.valorTaxa).toFixed(2)}
          </p>
        )}
      </div>

      <button className="w-full mt-4 bg-blue-500 text-white p-2 rounded">
        Finalizar Compra
      </button>
    </div>
  );
}
