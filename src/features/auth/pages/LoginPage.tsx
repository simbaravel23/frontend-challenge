import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Campos de formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      if (!isRegister) {
        // Fluxo de Login
        const response = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('kurio_token', response.data.token);
        navigate({ to: '/' });
      } else {
        // Simulação de Registo
        localStorage.setItem('kurio_token', 'mock-jwt-register-token');
        navigate({ to: '/' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro ao processar a autenticação.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1E1815]/60 border border-[#342A24]/80 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-md text-center font-mono">
        {/* Título do App */}
        <h1 className="text-2xl font-bold tracking-widest text-white">KURIO</h1>

        {/* Subtítulo / Modo */}
        <h2 className="text-sm text-[#A19288]">
          {isRegister ? 'Criar perfil de colecionador' : 'Entrar'}
        </h2>

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isRegister && (
            <div>
              <input
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#E28743] placeholder-[#A19288]/70"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder={isRegister ? 'Digite seu e-mail' : 'contato@email.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#E28743] placeholder-[#A19288]/70"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-[#E28743] placeholder-[#A19288]/70"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A19288] hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.962 8.962 0 012.122-.363c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {!isRegister && (
            <div className="text-right">
              <a href="#esqueceu" className="text-[11px] text-[#A19288] hover:text-[#E28743] transition-colors">
                Esqueceu a senha?
              </a>
            </div>
          )}

          {isRegister && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#120E0C] border border-[#342A24] text-white text-xs rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-[#E28743] placeholder-[#A19288]/70"
              />
            </div>
          )}

          {error && (
            <div className="text-[11px] text-red-400 bg-red-950/40 border border-red-900 p-2.5 rounded-lg text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs py-3 rounded-xl cursor-pointer mt-2"
          >
            {isLoading ? 'A processar...' : isRegister ? 'Criar perfil' : 'Entrar'}
          </Button>
        </form>

        {/* Separador Fiel ao Figma */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#342A24] w-full" />
          <span className="bg-[#1E1815] px-3 text-[10px] text-[#A19288] whitespace-nowrap">
            Ou continue com
          </span>
          <div className="border-t border-[#342A24] w-full" />
        </div>

        {/* Botões de Redes Sociais */}
        <div className="space-y-2.5 text-xs">
          {/* Continuar com Google */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('kurio_token', 'mock-google-token');
              navigate({ to: '/' });
            }}
            className="w-full bg-[#120E0C] border border-[#342A24] hover:border-[#A19288] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Continuar com Facebook */}
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('kurio_token', 'mock-facebook-token');
              navigate({ to: '/' });
            }}
            className="w-full bg-[#120E0C] border border-[#342A24] hover:border-[#A19288] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continuar com Facebook</span>
          </button>
        </div>

        {/* Link de Alternância entre Entrar e Criar Conta */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-[#A19288] hover:text-white transition-colors underline cursor-pointer"
          >
            {isRegister ? 'Já tem uma conta? Entre' : 'Novo na Kurio? Crie uma conta'}
          </button>
        </div>
      </div>
    </div>
  );
}