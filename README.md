# Teste Front-End Cakto - [Seu Nome]

Mini-checkout desenvolvido em React + TypeScript + TailwindCSS, atenddendo o teste da empresa para a vaga de desenvolvedor Senior.

---

## Decisões Técnicas

- Usei **Next.js 13 com App Router** para estruturar a página principal e manter dados estáticos no `produtoMock`.
- Separei a **lógica de negócios do domínio** (`/taxas.ts` e `/cpf.ts`) do **componente de UI** (`CheckoutForm.tsx`), garantindo clareza e reuso.
- O **CheckoutForm** é totalmente **mobile-first**, com destaque visual para PIX, feedback de validações e loading state no botão.
- Usei **TailwindCSS** para estilização rápida, responsiva e consistente.
- Evitei re-renders desnecessários mantendo estado local apenas no que muda no formulário.

---

## Transparência de Uso de IA

- Usei IA para estruturar o código inicial do formulário, criar funções de cálculo de taxas e sugerir validação de CPF.
- Todas as funções e lógicas foram revisadas e ajustadas manualmente, garantindo que os cálculos estejam corretos e que o código esteja consistente
- IA foi usada apenas como auxílio inicial, me ajudando a manter  melhores praticas de programacao ,  decisões finais e refatorações foram minhas.

---

## Regras de Negócio

- O comprador sempre paga o preço fixo do produto.
- As taxas da plataforma são descontadas do produtor, nunca do comprador.
- Diferenciei no código:  
  - `Total do comprador` = preço fixo do produto  
  - `Valor líquido do produtor` = preço do produto - taxa

---

## Como Executar

1. Instalar dependências:
```bash
npm install

npm run dev
