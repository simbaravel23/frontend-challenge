import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from '@/features/cart/context/CartContext';
import { Button } from '@/components/ui/button';
import { useNFTRealtime } from '@/hooks/useNFTRealtime';

interface Wallet {
  id: string;
  name: string;
  address: string;
  balanceETH: string;
  isDefault: boolean;
}

interface Quote {
  subtotalETH: string;
  discountETH: string;
  networkFeeETH: string;
  totalETH: string;
  coupon: string | null;
}

export function CheckoutPage() {
  const { cart, totalETH, clearCart } = useCart();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedWallet, setSelectedWallet] = useState<string>('wallet-1');
  const [network, setNetwork] = useState<string>('ethereum');
  const [coupon, setCoupon] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string>('');
  const [quoteChanged, setQuoteChanged] = useState(false);
  const idempotencyKeyRef = useRef<{ signature: string; key: string } | null>(null);
  const { priceAlert } = useNFTRealtime();

  const subtotalETH = totalETH;
  const cartSignature = JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })));

  // Buscar carteiras do utilizador
  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await axios.get<{ data: Wallet[] }>('/api/wallets');
      return response.data.data;
    },
  });

  useEffect(() => {
    const defaultWallet = wallets?.find((wallet) => wallet.isDefault);
    if (defaultWallet) setSelectedWallet(defaultWallet.id);
  }, [wallets]);

  // Obter cotação com ou sem cupão
  const { data: quote } = useQuery({
    queryKey: ['checkout-quote', cartSignature, appliedCoupon],
    queryFn: async () => {
      await axios.put('/api/cart', {
        items: cart.map(({ id, quantity }) => ({ id, quantity })),
      });
      const response = await axios.post('/api/checkout/quote', {
        coupon: appliedCoupon,
      });
      return response.data as Quote;
    },
    enabled: cart.length > 0,
  });

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    try {
      await axios.put('/api/cart', {
        items: cart.map(({ id, quantity }) => ({ id, quantity })),
      });
      await axios.post('/api/checkout/quote', { coupon });
      setAppliedCoupon(coupon.trim().toUpperCase());
      setQuoteChanged(false);
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setCouponError(error.response?.data.message ?? 'Não foi possível validar o cupão.');
      } else {
        setCouponError('Não foi possível validar o cupão.');
      }
    }
  };

  const handleConfirmOrder = async () => {
    if (isSubmitting || !quote || !selectedWallet) return;
    setIsSubmitting(true);
    setOrderError('');
    try {
      const items = cart.map(({ id, quantity }) => ({ id, quantity }));
      await axios.put('/api/cart', { items });
      const latestQuoteResponse = await axios.post<Quote>('/api/checkout/quote', { coupon: appliedCoupon });
      const latestQuote = latestQuoteResponse.data;
      if (
        latestQuote.subtotalETH !== quote.subtotalETH
        || latestQuote.discountETH !== quote.discountETH
        || latestQuote.networkFeeETH !== quote.networkFeeETH
        || latestQuote.totalETH !== quote.totalETH
      ) {
        queryClient.setQueryData(['checkout-quote', cartSignature, appliedCoupon], latestQuote);
        setQuoteChanged(true);
        setOrderError('O preço, a disponibilidade ou as taxas mudaram. Revise o total e confirme novamente.');
        return;
      }

      const orderRequest = {
        items,
        walletId: selectedWallet,
        network,
        coupon: appliedCoupon,
        totalETH: latestQuote.totalETH,
      };
      const signature = JSON.stringify(orderRequest);
      if (idempotencyKeyRef.current?.signature !== signature) {
        const storageKey = `kurio_order_key_${signature}`;
        const key = sessionStorage.getItem(storageKey) ?? `idemp-${crypto.randomUUID()}`;
        sessionStorage.setItem(storageKey, key);
        idempotencyKeyRef.current = { signature, key };
      }

      const response = await axios.post<{ order: { id: string; status: string } }>(
        '/api/orders',
        orderRequest,
        { headers: { 'x-idempotency-key': idempotencyKeyRef.current.key } },
      );
      if (response.data.order.status === 'confirmed') {
        const storageKey = `kurio_order_key_${signature}`;
        sessionStorage.removeItem(storageKey);
        idempotencyKeyRef.current = null;
        clearCart();
        void navigate({ to: '/orders/$id', params: { id: response.data.order.id } });
      } else if (response.data.order.status === 'declined') {
        sessionStorage.removeItem(`kurio_order_key_${signature}`);
        idempotencyKeyRef.current = null;
        setOrderError('Pagamento recusado pela simulação. Os itens continuam no teu carrinho.');
      } else {
        setOrderError('O pedido está pendente. Tenta novamente para recuperar o mesmo pedido.');
      }
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setOrderError(error.response?.data.message ?? 'Falha na comunicação. Tenta novamente com a mesma tentativa.');
      } else {
        setOrderError('Falha inesperada ao processar o pedido.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-white">Não tens itens no carrinho</h2>
        <p className="text-sm text-[#A19288]">Adiciona NFTs ao teu carrinho antes de aceder ao checkout.</p>
        <Link to="/">
          <Button className="bg-[#E28743] text-[#120E0C] font-bold">Voltar ao Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Finalizar Aquisição</h2>
        <p className="text-sm text-[#A19288] mt-1">Configura a tua carteira e a rede para concluir a compra.</p>
      </div>
      {priceAlert && (
        <p role="status" aria-live="polite" className="rounded-lg border border-[#E28743] bg-[#E28743]/10 p-3 text-sm text-white">
          {priceAlert} A cotação será validada novamente antes da compra.
        </p>
      )}
      {orderError && <p role="alert" className="rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-200">{orderError}</p>}
      {quoteChanged && (
        <p role="status" className="rounded-lg border border-[#E28743] p-3 text-sm text-[#E28743]">
          O resumo foi atualizado. Confirma novamente apenas após revisar o novo total.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Configuração */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seleção de Carteira */}
          <div className="bg-[#1E1815] border border-[#342A24] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#342A24] pb-3">1. Seleciona a Carteira</h3>
            <div className="space-y-3">
              {wallets?.map((w) => (
                <label
                  key={w.id}
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedWallet === w.id
                      ? 'border-[#E28743] bg-[#E28743]/10'
                      : 'border-[#342A24] bg-[#120E0C] hover:border-[#A19288]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="wallet"
                      value={w.id}
                      checked={selectedWallet === w.id}
                      onChange={() => setSelectedWallet(w.id)}
                      className="accent-[#E28743]"
                    />
                    <span className="space-y-1">
                      <span className="text-white font-semibold text-sm block">{w.name}</span>
                      <span className="text-xs text-[#A19288] font-mono">{w.address}</span>
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E28743]">{w.balanceETH} ETH</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seleção de Rede */}
          <div className="bg-[#1E1815] border border-[#342A24] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#342A24] pb-3">2. Rede Blockchain</h3>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[
                { id: 'ethereum', name: 'Ethereum' },
                { id: 'polygon', name: 'Polygon' },
                { id: 'arbitrum', name: 'Arbitrum' },
              ].map((net) => (
                <button
                  aria-pressed={network === net.id}
                  key={net.id}
                  type="button"
                  onClick={() => setNetwork(net.id)}
                  className={`p-3 border rounded-xl text-center cursor-pointer transition-all ${
                    network === net.id
                      ? 'border-[#E28743] bg-[#E28743]/10 text-white font-bold'
                      : 'border-[#342A24] bg-[#120E0C] text-[#A19288] hover:text-white'
                  }`}
                >
                  {net.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cupão de Desconto */}
          <div className="bg-[#1E1815] border border-[#342A24] rounded-xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-white border-b border-[#342A24] pb-3">3. Cupão de Desconto</h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-3">
              <input
                type="text"
                placeholder="Ex: KURIO10"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="flex-1 bg-[#120E0C] border border-[#342A24] rounded-lg px-4 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:border-[#E28743]"
              />
              <Button type="submit" variant="outline" className="border-[#342A24] text-white hover:border-[#E28743]">
                Aplicar
              </Button>
            </form>
            {couponError && <p className="text-xs text-red-400 font-mono">{couponError}</p>}
            {appliedCoupon && <p className="text-xs text-green-400 font-mono">Cupão "{appliedCoupon}" aplicado com sucesso!</p>}
          </div>
        </div>

        {/* Resumo e Confirmação */}
        <div className="bg-[#1E1815] border border-[#342A24] rounded-xl p-6 space-y-6 h-fit">
          <h3 className="text-lg font-bold text-white border-b border-[#342A24] pb-3">Resumo da Cotação</h3>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between text-[#A19288]">
              <span>Subtotal ({cart.reduce((count, item) => count + item.quantity, 0)} NFTs)</span>
              <span className="text-white">{quote?.subtotalETH || subtotalETH} ETH</span>
            </div>
            <div className="flex justify-between text-[#A19288]">
              <span>Taxa de Rede (Gas)</span>
              <span className="text-white">+{quote?.networkFeeETH || 0.005} ETH</span>
            </div>
            {quote?.discountETH > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Desconto</span>
                <span>-{quote.discountETH} ETH</span>
              </div>
            )}
            <div className="border-t border-[#342A24] pt-3 flex justify-between text-base font-bold">
              <span className="text-white">Total Final</span>
              <span className="text-[#E28743]">{quote?.totalETH || subtotalETH} ETH</span>
            </div>
          </div>

          <Button
            onClick={handleConfirmOrder}
            disabled={isSubmitting || !quote || !selectedWallet || cart.some((item) => item.available < item.quantity)}
            className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold py-3 cursor-pointer"
          >
            {isSubmitting ? 'A processar na simulação...' : quoteChanged ? 'Confirmar Novo Total' : 'Confirmar e Pagar'}
          </Button>
        </div>
      </div>
    </div>
  );
}