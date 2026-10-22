import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const [email, setEmail] = useState('colecionador@kurio.io');
  const [password, setPassword] = useState('kurio123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('kurio_token', response.data.token);
      // Redireciona para o catálogo após login bem-sucedido
      navigate({ to: '/' });
    } catch {
      setError('E-mail ou senha incorretos. Tente colecionador@kurio.io / kurio123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-[#1E1815] border border-[#342A24] rounded-2xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <Link to="/" className="font-mono font-bold tracking-widest text-white text-3xl">
          KURIO
        </Link>
        <h2 className="text-xl font-bold text-white pt-4">Aceder à conta</h2>
        <p className="text-xs text-[#A19288]">Insira as suas credenciais para gerir os seus NFTs e carrinho.</p>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-lg font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-[#A19288] font-mono">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#120E0C] border border-[#342A24] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E28743]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-[#A19288] font-mono">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-[#120E0C] border border-[#342A24] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E28743]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold py-3 cursor-pointer mt-2"
        >
          {isLoading ? 'A autenticar...' : 'Entrar'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <Link to="/" className="text-xs text-[#A19288] hover:text-white transition-colors font-mono">
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}