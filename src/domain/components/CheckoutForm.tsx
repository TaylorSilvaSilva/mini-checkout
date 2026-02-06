"use client";
import React, { useState, useEffect } from 'react';

interface Produto {
  id: number;
  nome: string;
  precoOriginal: number;
  precoAtual: number;
  produtor: string;
  formato: string;
  tempoEntrega: string;
}

interface Taxa {
  valorTaxa: number;
  valorLiquido: number;
  economiaPIX: number;
}

interface Props {
  produto: Produto;
}

export const CheckoutForm: React.FC<Props> = ({ produto }) => {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'CARTAO'>('PIX');
  const [parcelas, setParcelas] = useState(1);
  const [taxa, setTaxa] = useState<Taxa>({
    valorTaxa: 0,
    valorLiquido: produto.precoAtual,
    economiaPIX: 0,
  });
  const [emailValido, setEmailValido] = useState(true);
  const [cpfValido, setCpfValido] = useState(true);
  const [loading, setLoading] = useState(false);

  // Validaçoes
  useEffect(() => {
    const re = /\S+@\S+\.\S+/;
    setEmailValido(email === '' || re.test(email));
  }, [email]);
  useEffect(() => {
    const cleanedCpf = cpf.replace(/\D/g, '');
    setCpfValido(cpf === '' || cleanedCpf.length === 11);
  }, [cpf]);
  useEffect(() => {
    const preco = produto.precoAtual;
    let valorTaxa = 0;
    let valorLiquido = preco;

    if (metodoPagamento === 'PIX') {
      valorTaxa = 0;
      valorLiquido = preco;
    } else {
      if (parcelas === 1) {
        valorTaxa = preco * 0.0399;
      } else {
        const taxaFixa = preco * 0.0499;
        const taxaParcelaExtra = preco * 0.02 * (parcelas - 1);
        valorTaxa = taxaFixa + taxaParcelaExtra;
      }
      valorLiquido = preco - valorTaxa;
    }

    const economiaPIX = metodoPagamento === 'PIX' ? 0 : valorTaxa;

    setTaxa({
      valorTaxa,
      valorLiquido,
      economiaPIX,
    });
  }, [metodoPagamento, parcelas, produto.precoAtual]);

  const podeFinalizar = emailValido && cpfValido && email !== '' && cpf !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeFinalizar) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Compra finalizada com sucesso! 🎉');
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-white p-6 rounded-lg shadow-md space-y-6"
      noValidate
    >
      {/* Produto */}
      <section>
        <h1 className="text-lg font-semibold text-gray-900 mb-1">{produto.nome}</h1>
        <p className="text-sm text-gray-500">
          De{' '}
          <span className="line-through">
            R${produto.precoOriginal.toFixed(2)}
          </span>{' '}
          por{' '}
          <span className="font-bold text-gray-900">
            R${produto.precoAtual.toFixed(2)}
          </span>
        </p>
      </section>

      {/* Dados pessoais */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-700">Dados pessoais</h2>
        <input
          type="email"
          placeholder="E-mail *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            emailValido ? 'border-gray-300' : 'border-red-500'
          }`}
          required
        />
        <input
          type="text"
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          maxLength={14} // para máscara simples (ex: 000.000.000-00)
          className={`w-full border rounded px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 ${
            cpfValido ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'
          }`}
          required
        />
      </section>

      {/* Pagamento */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-700">Pagamento</h2>

        <label
          className={`flex items-center border rounded px-3 py-2 cursor-pointer ${
            metodoPagamento === 'PIX' ? 'border-green-500 bg-green-50' : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="pagamento"
            value="PIX"
            checked={metodoPagamento === 'PIX'}
            onChange={() => setMetodoPagamento('PIX')}
            className="mr-3"
          />
          <span className={metodoPagamento === 'PIX' ? 'text-green-700 font-semibold' : 'text-gray-700'}>
            PIX (Taxa 0%){' '}
            <span role="img" aria-label="fogo">
              🔥
            </span>
          </span>
        </label>

        <label
          className={`flex items-center border rounded px-3 py-2 cursor-pointer ${
            metodoPagamento === 'CARTAO' ? 'border-gray-700 bg-gray-100' : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="pagamento"
            value="CARTAO"
            checked={metodoPagamento === 'CARTAO'}
            onChange={() => setMetodoPagamento('CARTAO')}
            className="mr-3"
          />
          <span className={metodoPagamento === 'CARTAO' ? 'text-gray-900 font-semibold' : 'text-gray-700'}>
            Cartão
          </span>
        </label>

        {/* Parcelas só aparece se Cartão */}
        {metodoPagamento === 'CARTAO' && (
          <select
            value={parcelas}
            onChange={(e) => setParcelas(Number(e.target.value))}
            className="mt-2 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}x
              </option>
            ))}
          </select>
        )}
      </section>

      {/* Resumo do pedido */}
      <section className="border rounded p-4 bg-gray-50 space-y-2 text-gray-700 text-sm">
        <div className="flex justify-between">
          <span>Produto</span>
          <span>R${produto.precoAtual.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxa Cakto</span>
          <span>R${taxa.valorTaxa.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>R${produto.precoAtual.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-700 font-semibold">
          <span>{produto.produtor} recebe</span>
          <span>R${taxa.valorLiquido.toFixed(2)}</span>
        </div>
        {metodoPagamento === 'PIX' ? null : (
          <div className="text-green-700 text-xs">
            Você economiza R${taxa.economiaPIX.toFixed(2)} com PIX
          </div>
        )}
      </section>

      {/* Botão */}
      <button
        type="submit"
        disabled={!podeFinalizar || loading}
        className={`w-full py-3 rounded text-white font-semibold uppercase ${
          podeFinalizar && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
        } flex items-center justify-center space-x-2`}
      >
        <span>Finalizar Compra</span>
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        )}
      </button>
    </form>
  );
};
