import { CheckoutForm } from "@/src/domain/components/CheckoutForm";
import { produtoMock } from "@/src/data/produtoMock";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <CheckoutForm produto={produtoMock} />
    </main>
  );
}
