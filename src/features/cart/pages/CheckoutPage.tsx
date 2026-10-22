import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCart } from '@/features/cart/context/CartContext';
import { Button } from '@/components/ui/button';

interface Wallet {
  id: string;
  name: string;
  address: string;
  balanceETH: string;
  isDefault: boolean;
}

export function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [selectedWallet, setSelectedWallet] = useState<string>('wallet-1');
  const [network, setNetwork] = useState<string>('ethereum');
  const [coupon, setCoupon] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderCompleted, setOrderCompleted] = useState<string | null>(null);

  const subtotalETH = cart.reduce((acc, item) => acc + parseFloat(item.priceETH), 0);

  // Buscar carteiras do utilizador
  const { data: wallets } = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await axios.get<{ data: Wallet[] }>('/api/wallets');
      return response.data.data;
    },
  });

  // Obter cotação com ou sem cupão
  const { data: quote } = useQuery({
    queryKey: ['checkout-quote', subtotalETH, appliedCoupon],
    queryFn: async () => {
      const response = await axios.post('/api/checkout/quote', {
        subtotalETH,
        coupon: appliedCoupon,
      });
      return response.data;
    },
    enabled: cart.length > 0,
  });

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    try {
      await axios.post('/api/checkout/quote', { subtotalETH, coupon });
      setAppliedCoupon(coupon);
    } catch {
      setCouponError('Cupão inválido. Tente KURIO10 para 10% de desconto.');
    }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      // Gera uma chave de idempotência única para a transação
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const response = await axios.post(
        '/api/orders',
        {
          items: cart.map((item) => item.id),
          walletId: selectedWallet,
          network,
          coupon: appliedCoupon,
          totalETH: quote?.totalETH,
        },
        {
          headers: {
            'x-idempotency-key': idempotencyKey,
          },
        }
      );

      setOrderCompleted(response.data.order.id);
      clearCart();
    } catch {
      alert('Ocorreu um erro ao processar o pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-6 bg-[#1E1815] border border-[#342A24] rounded-2xl p-8">
        <div className="w-16 h-16 bg-[#E28743]/20 border border-[#E28743] text-[#E28743] rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          ✓
        </div>
        <h2 className="text-3xl font-bold text-white">Aquisição Confirmada!</h2>
        <p className="text-sm text-[#A19288]">
          Os teus novos NFTs já foram transferidos para a tua carteira registada.
        </p>
        <div className="bg-[#120E0C] border border-[#342A24] rounded-lg p-4 font-mono text-xs text-[#E28743]">
          ID do Pedido: {orderCompleted}
        </div>
        <Link to="/">
          <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold cursor-pointer mt-4">
            Voltar ao Marketplace
          </Button>
        </Link>
      </div>
    );
  }

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
                  onClick={() => setSelectedWallet(w.id)}
                  className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedWallet === w.id
                      ? 'border-[#E28743] bg-[#E28743]/10'
                      : 'border-[#342A24] bg-[#120E0C] hover:border-[#A19288]'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-white font-semibold text-sm block">{w.name}</span>
                    <span className="text-xs text-[#A19288] font-mono">{w.address}</span>
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
              <span>Subtotal ({cart.length} NFTs)</span>
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
            disabled={isSubmitting}
            className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold py-3 cursor-pointer"
          >
            {isSubmitting ? 'A processar na Blockchain...' : 'Confirmar e Pagar'}
          </Button>
        </div>
      </div>
    </div>
  );
}