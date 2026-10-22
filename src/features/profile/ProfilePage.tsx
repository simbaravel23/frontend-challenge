import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface Wallet {
  id: string;
  name: string;
  address: string;
  balanceETH: string;
  isDefault: boolean;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data.message ?? fallback;
  }
  return fallback;
}

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletError, setWalletError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get<{ data: Profile }>('/api/profile');
      return response.data.data;
    },
    retry: false,
  });

  const walletsQuery = useQuery({
    queryKey: ['wallets'],
    queryFn: async () => {
      const response = await axios.get<{ data: Wallet[] }>('/api/wallets');
      return response.data.data;
    },
    retry: false,
  });

  const saveProfile = useMutation({
    mutationFn: async () => {
      const response = await axios.put<{ data: Profile }>('/api/profile', {
        name: name?.trim() ?? profileQuery.data?.name,
        avatar: avatar?.trim() ?? profileQuery.data?.avatar,
      });
      return response.data.data;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile);
      setProfileMessage('Alterações guardadas com sucesso.');
      setProfileError('');
    },
    onError: (error: unknown) => {
      setProfileError(getErrorMessage(error, 'Não foi possível guardar o perfil.'));
    },
  });

  const addWallet = useMutation({
    mutationFn: async () => {
      const response = await axios.post<{ data: Wallet }>('/api/wallets', {
        name: walletName,
        address: walletAddress,
      });
      return response.data.data;
    },
    onSuccess: async () => {
      setWalletName('');
      setWalletAddress('');
      setWalletError('');
      await queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
    onError: (error: unknown) => {
      setWalletError(getErrorMessage(error, 'Não foi possível adicionar a carteira.'));
    },
  });

  const makePrimary = useMutation({
    mutationFn: async (walletId: string) => {
      await axios.put(`/api/wallets/${walletId}`, { isDefault: true });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
    onError: (error: unknown) => {
      setWalletError(getErrorMessage(error, 'Não foi possível atualizar a carteira principal.'));
    },
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      const response = await axios.post<{ message: string }>('/api/profile/password', {
        currentPassword,
        newPassword,
      });
      return response.data.message;
    },
    onSuccess: (message) => {
      setCurrentPassword('');
      setNewPassword('');
      setPasswordMessage(message);
      setPasswordError('');
    },
    onError: (error: unknown) => {
      setPasswordError(getErrorMessage(error, 'Não foi possível alterar a senha.'));
    },
  });

  if (profileQuery.isLoading || walletsQuery.isLoading) {
    return <div role="status" className="animate-pulse space-y-4 py-12 text-center text-[#A19288]">A carregar o perfil...</div>;
  }

  if (profileQuery.isError || walletsQuery.isError || !profileQuery.data) {
    return (
      <div role="alert" className="mx-auto max-w-xl space-y-4 py-12 text-center">
        <h1 className="text-xl font-bold text-white">Não foi possível carregar a conta</h1>
        <p className="text-sm text-red-300">A sessão pode ter expirado. Entre novamente para continuar.</p>
      </div>
    );
  }

  const profile = profileQuery.data;
  const wallets = walletsQuery.data ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#342A24] pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Perfil do Colecionador</h1>
          <p className="mt-1 text-sm text-[#A19288]">Gira os teus dados pessoais, segurança e carteiras associadas.</p>
        </div>
        <span className="rounded-full border border-[#E28743]/30 bg-[#E28743]/10 px-3 py-1 font-mono text-xs text-[#E28743]">
          Conta ativa
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="h-fit space-y-4 rounded-2xl border border-[#342A24] bg-[#1E1815] p-6 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-[#E28743]">
            <img src={avatar ?? profile.avatar} alt={`Avatar de ${profile.name}`} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-white">{name ?? profile.name}</h2>
            <p className="mt-1 font-mono text-xs text-[#A19288]">{profile.email}</p>
          </div>
          <p className="text-left text-xs text-[#A19288]">O endereço da imagem pode ser uma URL ou um caminho local, por exemplo /mac.jpeg.</p>
        </div>

        <div className="space-y-8 md:col-span-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setProfileMessage('');
              setProfileError('');
              saveProfile.mutate();
            }}
            className="space-y-4 rounded-2xl border border-[#342A24] bg-[#1E1815] p-6"
          >
            <h2 className="border-b border-[#342A24] pb-3 text-lg font-bold text-white">Informações Pessoais</h2>
            <div className="space-y-1">
              <label htmlFor="profile-name" className="font-mono text-xs text-[#A19288]">Nome de Exibição</label>
              <input
                id="profile-name"
                type="text"
                required
                minLength={2}
                value={name ?? profile.name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-[#342A24] bg-[#120E0C] p-3 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="profile-email" className="font-mono text-xs text-[#A19288]">E-mail</label>
              <input id="profile-email" type="email" readOnly value={profile.email} className="w-full rounded-xl border border-[#342A24] bg-[#120E0C] p-3 text-xs text-[#A19288]" />
            </div>
            <div className="space-y-1">
              <label htmlFor="profile-avatar" className="font-mono text-xs text-[#A19288]">Avatar (URL ou caminho local)</label>
              <input
                id="profile-avatar"
                type="text"
                value={avatar ?? profile.avatar}
                onChange={(event) => setAvatar(event.target.value)}
                className="w-full rounded-xl border border-[#342A24] bg-[#120E0C] p-3 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
              />
            </div>
            {profileError && <p role="alert" className="text-sm text-red-300">{profileError}</p>}
            {profileMessage && <p role="status" className="text-sm text-emerald-300">{profileMessage}</p>}
            <Button type="submit" disabled={saveProfile.isPending} className="bg-[#E28743] font-bold text-[#120E0C]">
              {saveProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
            </Button>
          </form>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setPasswordMessage('');
              setPasswordError('');
              changePassword.mutate();
            }}
            className="space-y-4 rounded-2xl border border-[#342A24] bg-[#1E1815] p-6"
          >
            <h2 className="border-b border-[#342A24] pb-3 text-lg font-bold text-white">Alterar Senha</h2>
            <label className="block space-y-1">
              <span className="font-mono text-xs text-[#A19288]">Senha atual</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                className="w-full rounded-xl border border-[#342A24] bg-[#120E0C] p-3 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-mono text-xs text-[#A19288]">Nova senha (mínimo de 8 caracteres)</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="w-full rounded-xl border border-[#342A24] bg-[#120E0C] p-3 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
              />
            </label>
            {passwordError && <p role="alert" className="text-sm text-red-300">{passwordError}</p>}
            {passwordMessage && <p role="status" className="text-sm text-emerald-300">{passwordMessage}</p>}
            <Button type="submit" disabled={changePassword.isPending} variant="outline">
              Alterar Senha
            </Button>
          </form>

          <section className="space-y-4 rounded-2xl border border-[#342A24] bg-[#1E1815] p-6">
            <h2 className="border-b border-[#342A24] pb-3 text-lg font-bold text-white">Carteiras Conectadas</h2>
            {walletError && <p role="alert" className="text-sm text-red-300">{walletError}</p>}
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#342A24] bg-[#120E0C] p-4">
                  <div>
                    <p className="font-semibold text-white">{wallet.name}</p>
                    <p className="break-all font-mono text-xs text-[#A19288]">{wallet.address}</p>
                    <p className="mt-1 font-mono text-xs text-[#E28743]">{wallet.balanceETH} ETH</p>
                  </div>
                  {wallet.isDefault ? (
                    <span className="rounded bg-[#E28743] px-2 py-1 text-[10px] font-bold text-[#120E0C]">PRINCIPAL</span>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={makePrimary.isPending}
                      onClick={() => makePrimary.mutate(wallet.id)}
                    >
                      Definir como Principal
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setWalletError('');
                addWallet.mutate();
              }}
              className="grid grid-cols-1 gap-3 border-t border-[#342A24] pt-4 sm:grid-cols-2"
            >
              <label className="space-y-1">
                <span className="font-mono text-xs text-[#A19288]">Nome da carteira</span>
                <input
                  required
                  value={walletName}
                  onChange={(event) => setWalletName(event.target.value)}
                  className="w-full rounded-lg border border-[#342A24] bg-[#120E0C] p-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
                />
              </label>
              <label className="space-y-1">
                <span className="font-mono text-xs text-[#A19288]">Endereço Ethereum</span>
                <input
                  required
                  pattern="0x[a-fA-F0-9]{40}"
                  title="Informe um endereço Ethereum válido com 40 caracteres hexadecimais."
                  value={walletAddress}
                  onChange={(event) => setWalletAddress(event.target.value)}
                  className="w-full rounded-lg border border-[#342A24] bg-[#120E0C] p-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E28743]"
                />
              </label>
              <Button type="submit" disabled={addWallet.isPending} className="w-fit bg-[#E28743] text-[#120E0C] sm:col-span-2">
                {addWallet.isPending ? 'A adicionar...' : 'Adicionar Carteira'}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
