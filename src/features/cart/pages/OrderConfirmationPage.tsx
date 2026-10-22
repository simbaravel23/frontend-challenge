import { Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface OrderReceipt {
  id: string;
  status: 'pending' | 'confirmed' | 'declined';
  items: Array<{
    id: string;
    name: string;
    priceETH: string;
    quantity: number;
    imageUrl: string;
  }>;
  subtotalETH: string;
  discountETH: string;
  networkFeeETH: string;
  totalETH: string;
  walletId: string;
  network: string;
  transactionHash: string;
  createdAt: string;
}

export function OrderConfirmationPage() {
  const { id } = useParams({ from: '/orders/$id' });
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await axios.get<{ order: OrderReceipt }>(`/api/orders/${id}`);
      return response.data.order;
    },
    retry: false,
  });

  if (isLoading) {
    return <div role="status" className="animate-pulse py-20 text-center text-[#A19288]">A recuperar o pedido...</div>;
  }

  if (error || !order) {
    return (
      <div role="alert" className="space-y-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Pedido indisponível</h1>
        <p className="text-sm text-red-300">Não foi possível recuperar o recibo deste pedido.</p>
        <Link to="/profile">
          <Button variant="outline">Voltar ao perfil</Button>
        </Link>
      </div>
    );
  }

  const confirmed = order.status === 'confirmed';
  const declined = order.status === 'declined';

  return (
    <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-[#342A24] bg-[#1E1815] p-6 sm:p-10">
      <header className="space-y-3 text-center">
        <p aria-hidden="true" className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border text-2xl font-bold ${
          confirmed ? 'border-emerald-600 bg-emerald-950 text-emerald-300' : declined ? 'border-red-700 bg-red-950 text-red-300' : 'border-[#E28743] bg-[#E28743]/10 text-[#E28743]'
        }`}>
          {confirmed ? '✓' : declined ? '!' : '…'}
        </p>
        <h1 className="text-3xl font-bold text-white">
          {confirmed ? 'Aquisição Confirmada' : declined ? 'Pagamento Recusado' : 'Pedido Pendente'}
        </h1>
        <p role="status" className="text-sm text-[#A19288]">
          {confirmed
            ? 'O pedido foi confirmado pela simulação.'
            : declined
              ? 'O pedido não foi concluído; os itens permanecem no carrinho.'
              : 'O pedido ainda está em processamento. Atualize para reconciliar o estado.'}
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-4 rounded-xl border border-[#342A24] bg-[#120E0C] p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-[#A19288]">ID do pedido</dt><dd className="break-all font-mono text-white">{order.id}</dd></div>
        <div><dt className="text-[#A19288]">Estado</dt><dd className="capitalize text-white">{order.status}</dd></div>
        <div><dt className="text-[#A19288]">Carteira</dt><dd className="font-mono text-white">{order.walletId}</dd></div>
        <div><dt className="text-[#A19288]">Rede</dt><dd className="capitalize text-white">{order.network}</dd></div>
        <div className="sm:col-span-2">
          <dt className="text-[#A19288]">Referência simulada</dt>
          <dd className="break-all font-mono text-xs text-[#E28743]">{order.transactionHash}</dd>
        </div>
      </dl>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Itens do pedido</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#342A24] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <img src={item.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{item.name}</p>
                <p className="text-xs text-[#A19288]">Quantidade: {item.quantity}</p>
              </div>
            </div>
            <p className="shrink-0 font-mono text-sm text-[#E28743]">
              {item.priceETH} × {item.quantity} ETH
            </p>
          </div>
        ))}
      </section>

      <dl className="space-y-2 border-t border-[#342A24] pt-4 font-mono text-sm">
        <div className="flex justify-between"><dt className="text-[#A19288]">Subtotal</dt><dd className="text-white">{order.subtotalETH} ETH</dd></div>
        <div className="flex justify-between"><dt className="text-[#A19288]">Desconto</dt><dd className="text-white">−{order.discountETH} ETH</dd></div>
        <div className="flex justify-between"><dt className="text-[#A19288]">Taxa de rede</dt><dd className="text-white">{order.networkFeeETH} ETH</dd></div>
        <div className="flex justify-between border-t border-[#342A24] pt-3 text-base font-bold"><dt className="text-white">Total</dt><dd className="text-[#E28743]">{order.totalETH} ETH</dd></div>
      </dl>

      <Link to="/" className="block">
        <Button className="w-full bg-[#E28743] font-bold text-[#120E0C]">Voltar ao Marketplace</Button>
      </Link>
    </article>
  );
}
