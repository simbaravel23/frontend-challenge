import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#342A24]/60 bg-[#120E0C] text-[#A19288] font-sans">
      {/* 1. Blocos de Destaque / Recursos & Newsletter */}
      <div className="max-w-7xl mx-auto px-8 py-12 border-b border-[#342A24]/60">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Segurança da Carteira */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E28743] text-[#120E0C] font-mono font-bold flex items-center justify-center text-sm">
              W
            </div>
            <h4 className="text-white font-bold text-sm">Segurança da carteira</h4>
            <p className="text-xs leading-relaxed text-[#A19288]">
              Proteja sua carteira e colecione arte digital verificada com confiança.
            </p>
          </div>

          {/* Criadores em Destaque */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E28743] text-[#120E0C] font-mono font-bold flex items-center justify-center text-sm">
              C
            </div>
            <h4 className="text-white font-bold text-sm">Criadores em destaque</h4>
            <p className="text-xs leading-relaxed text-[#A19288]">
              Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
            </p>
          </div>

          {/* Alertas de Lançamentos */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E28743] text-[#120E0C] font-mono font-bold flex items-center justify-center text-sm">
              D
            </div>
            <h4 className="text-white font-bold text-sm">Alertas de lançamentos</h4>
            <p className="text-xs leading-relaxed text-[#A19288]">
              Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
            </p>
          </div>

          {/* Newsletter / Antecipe-se */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">Antecipe-se ao próximo lançamento</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="digite seu e-mail..."
                className="w-full bg-[#1E1815] border border-[#342A24] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#E28743] font-mono placeholder-[#A19288]"
              />
              <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs px-4 py-2 cursor-pointer">
                Enviar
              </Button>
            </div>
            <p className="text-[11px] text-[#A19288]">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Banner de Contatos Rápidos */}
      <div className="max-w-7xl mx-auto px-8 py-6 border-b border-[#342A24]/60 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-6">
          <span className="font-bold text-white tracking-widest text-base">KURIO</span>
          <span className="text-[#A19288]">Feito para colecionadores, criadores e cultura</span>
        </div>
        <div className="flex items-center gap-8 text-[#A19288]">
          <span>contato@email.com</span>
          <span>+55 11 4002 8922</span>
        </div>
      </div>

      {/* 3. Colunas de NAVEGAÇÃO / LINKS */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
        {/* Coluna 1 */}
        <div className="space-y-3">
          <h5 className="text-white font-bold border-b border-[#342A24] pb-2">Meu perfil</h5>
          <ul className="space-y-2 text-[#A19288]">
            <li><Link to="/profile" className="hover:text-white transition-colors">Meu perfil</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Minha coleção</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Atividade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Estúdio do criador</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Lista de interesse</a></li>
          </ul>
        </div>

        {/* Coluna 2 */}
        <div className="space-y-3">
          <h5 className="text-white font-bold border-b border-[#342A24] pb-2">Central de ajuda</h5>
          <ul className="space-y-2 text-[#A19288]">
            <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Como comprar NFTs</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Carteira e segurança</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Política do mercado</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Denunciar item</a></li>
          </ul>
        </div>

        {/* Coluna 3 */}
        <div className="space-y-3">
          <h5 className="text-white font-bold border-b border-[#342A24] pb-2">Coleções</h5>
          <ul className="space-y-2 text-[#A19288]">
            <li><a href="#" className="hover:text-white transition-colors">Arte digital</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Fotografia</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Música</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Arte 3D</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Utilidade</a></li>
          </ul>
        </div>

        {/* Coluna 4 - Redes Sociais e Carteiras */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h5 className="text-white font-bold border-b border-[#342A24] pb-2">Redes sociais</h5>
            <div className="flex items-center gap-3">
              {['f', 'ig', 'tw', 'in', 'yt'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-7 h-7 rounded bg-[#1E1815] border border-[#342A24] text-white flex items-center justify-center hover:border-[#E28743] hover:text-[#E28743] transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-bold text-[11px]">Carteiras compatíveis</h5>
            <div className="flex items-center gap-2">
              <span className="bg-[#1E1815] border border-[#342A24] px-2 py-1 rounded text-[10px] text-[#A19288]">METAMASK</span>
              <span className="bg-[#1E1815] border border-[#342A24] px-2 py-1 rounded text-[10px] text-[#A19288]">WALLETCONNECT</span>
              <span className="bg-[#1E1815] border border-[#342A24] px-2 py-1 rounded text-[10px] text-[#A19288]">COINBASE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Copyright */}
      <div className="border-t border-[#342A24]/60 py-6 text-center text-[11px] font-mono text-[#A19288]">
        © 2026 Kurio - Proprietários de arte digital. Todos os direitos reservados.
      </div>
    </footer>
  );
}