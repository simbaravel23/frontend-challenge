import { Button } from '@/components/ui/button';

export function CatalogBottomSections() {
  return (
    <div className="space-y-16 mt-12">
      {/* 1. PAGINAÇÃO (Direita) */}
      <div className="flex justify-end items-center gap-2 font-mono text-xs">
        <button className="w-8 h-8 rounded bg-[#E28743] text-[#120E0C] font-bold flex items-center justify-center">
          1
        </button>
        <button className="w-8 h-8 rounded bg-[#1E1815] border border-[#342A24] text-[#A19288] hover:text-white flex items-center justify-center">
          2
        </button>
        <button className="w-8 h-8 rounded bg-[#1E1815] border border-[#342A24] text-[#A19288] hover:text-white flex items-center justify-center">
          3
        </button>
        <button className="w-8 h-8 rounded bg-[#1E1815] border border-[#342A24] text-[#A19288] hover:text-white flex items-center justify-center">
          4
        </button>
        <button className="w-8 h-8 rounded bg-[#1E1815] border border-[#342A24] text-[#A19288] hover:text-white flex items-center justify-center">
          &gt;
        </button>
      </div>

      {/* 2. BANNERS DE DESTAQUE EDITORIAL (Dois Cards Horizontais) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Promo 1 */}
        <div className="bg-[#1E1815] border border-[#342A24] rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center">
          <div className="w-full sm:w-1/2 aspect-square">
            <img src="/mac.jpeg" alt="Lançamentos gênesis" className="w-full h-full object-cover" />
          </div>
          <div className="w-full sm:w-1/2 p-6 space-y-3">
            <h3 className="text-white font-bold text-base leading-snug">
              Lançamentos gênesis de edição limitada
            </h3>
            <p className="text-xs text-[#A19288] leading-relaxed">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
            <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs px-4 py-2 cursor-pointer mt-2">
              Explorar →
            </Button>
          </div>
        </div>

        {/* Card Promo 2 */}
        <div className="bg-[#1E1815] border border-[#342A24] rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center">
          <div className="w-full sm:w-1/2 aspect-square">
            <img src="/mac.jpeg" alt="Arte digital selecionada" className="w-full h-full object-cover" />
          </div>
          <div className="w-full sm:w-1/2 p-6 space-y-3">
            <h3 className="text-white font-bold text-base leading-snug">
              Arte digital selecionada e muito mais
            </h3>
            <p className="text-xs text-[#A19288] leading-relaxed">
              Explore novos artistas, coleções verificadas e obras digitais que definem a rede.
            </p>
            <Button className="bg-[#E28743] hover:bg-[#c97435] text-[#120E0C] font-bold text-xs px-4 py-2 cursor-pointer mt-2">
              Explorar →
            </Button>
          </div>
        </div>
      </div>

      {/* 3. DIÁRIO DA CUNHAGEM (Artigos do Blog) */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
            Diário da Cunhagem
          </h2>
          <p className="text-xs text-[#A19288]">
            Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              date: '12 de setembro | Leitura de 4 min',
              title: 'Como funciona a propriedade de NFTs',
              desc: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
            },
            {
              date: '13 de setembro | Leitura de 3 min',
              title: '10 artistas digitais para acompanhar',
              desc: 'Conheça criadores que moldam a cultura digital.',
            },
            {
              date: '15 de setembro | Leitura de 5 min',
              title: 'Raridade, atributos e procedência',
              desc: 'Entenda raridade, procedência, direitos autorais e utilidade.',
            },
            {
              date: '15 de setembro | Leitura de 2 min',
              title: 'Como proteger sua carteira',
              desc: 'Proteja sua carteira, seus ativos e sua identidade.',
            },
          ].map((article, idx) => (
            <div key={idx} className="bg-[#1E1815] border border-[#342A24] rounded-2xl overflow-hidden space-y-3 p-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-[#120E0C]">
                <img src="/mac.jpeg" alt={article.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-mono text-[#A19288] block">{article.date}</span>
              <h4 className="text-white font-bold text-sm leading-snug">{article.title}</h4>
              <p className="text-xs text-[#A19288] line-clamp-2">{article.desc}</p>
              <a href="#" className="text-[#E28743] text-xs font-mono hover:underline block pt-1">
                Ler mais →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}