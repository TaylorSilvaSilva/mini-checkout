'use client';
import { useState } from 'react';
import { calcularTaxaProdutor, MetodoPagamento, ResultadoTaxa } from '../taxas';
import { validarCPF } from '../cpf';

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
  const [loading, setLoading] = useState(false);

  // Validações
  const emailValido = email.includes('@') && email.includes('.');
  const cpfValido = cpf === '' || validarCPF(cpf);

  // Calcula valor do produtor
  const taxa: ResultadoTaxa = calcularTaxaProdutor(
    produto.precoAtual,
    metodoPagamento,
    parcelas
  );
  const taxaPix = calcularTaxaProdutor(produto.precoAtual, 'PIX', 1);

  const destaquePIX = metodoPagamento === 'PIX' ? 'border-green-500 bg-green-50' : 'border-gray-300';

  const finalizarCompra = () => {
    setLoading(true);
    setTimeout(() => {
      alert('Compra finalizada com sucesso!');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">{produto.nome}</h1>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`w-full border p-2 mb-2 rounded ${emailValido || email === '' ? '' : 'border-red-500'}`}
      />
      {!emailValido && email !== '' && <p className="text-red-500 text-sm mb-2">Email inválido</p>}

      {/* CPF */}
      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className={`w-full border p-2 mb-2 rounded ${cpfValido || cpf === '' ? '' : 'border-red-500'}`}
      />
      {!cpfValido && cpf !== '' && <p className="text-red-500 text-sm mb-2">CPF inválido</p>}

      {/* Método de Pagamento */}
      <div className="mb-2 flex flex-col sm:flex-row gap-2">
        <label className={`flex-1 p-2 border rounded cursor-pointer ${destaquePIX}`}>
          <input
            type="radio"
            value="PIX"
            checked={metodoPagamento === 'PIX'}
            onChange={() => setMetodoPagamento('PIX')}
            className="mr-1"
          />
          PIX (taxa 0%)
        </label>
        <label className="flex-1 p-2 border rounded cursor-pointer border-gray-300">
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
      <div className="border p-3 rounded bg-gray-50 mb-4">
        <p>Valor do produto: <span className="font-semibold">R${produto.precoAtual.toFixed(2)}</span></p>
        <p>Total do comprador: <span className="font-semibold">R${produto.precoAtual.toFixed(2)}</span></p>
        <p>Taxa Cakto: <span className="font-semibold">R${taxa.valorTaxa.toFixed(2)}</span></p>
        <p>Valor líquido do produtor: <span className="font-semibold">R${taxa.valorLiquido.toFixed(2)}</span></p>
        {metodoPagamento === 'CARTAO' && (
          <p>Economia escolhendo PIX: <span className="font-semibold">R${(taxaPix.valorTaxa - taxa.valorTaxa).toFixed(2)}</span></p>
        )}
      </div>

      <button
        className={`w-full mt-2 p-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={!emailValido || !cpfValido || loading}
        onClick={finalizarCompra}
      >
        {loading ? 'Processando...' : 'Finalizar Compra'}
      </button>
    </div>
  );
}
