# Arquitetura e Documentação — Kurio NFT Marketplace

Este documento descreve as decisões arquiteturais, os contratos de API (REST e Socket.IO), a gestão de estado e a estratégia de cache implementadas no **Kurio NFT Marketplace**.

---

## 1. Stack Tecnológica e Decisões Arquiteturais

A aplicação foi desenvolvida seguindo uma arquitetura modular baseada em *features*, garantindo separação de responsabilidades, escalabilidade e tipagem estrita de ponta a ponta com TypeScript.

* **Interface e Estilização:** React + Tailwind CSS v4 e componentes adaptados do shadcn/ui, seguindo rigorosamente a identidade visual e o tema escuro (`#120E0C` com acentos em `#E28743`) definidos no Figma.
* **Roteamento:** **TanStack Router**, garantindo proteção de rotas privadas, gestão de parâmetros na URL (filtros, paginação e ordenação) e suporte a acesso direto e *refresh* em qualquer ecrã.
* **Estado Remoto e Assíncrono:** **TanStack Query (React Query)** acoplado ao **Axios** para gestão de cache, invalidação automática de consultas após *mutations*, tratamento de estados de carregamento (com *skeletons* com *shimmer effect*) e *retry* automático.
* **Mocking de Rede:** **MSW (Mock Service Worker)** implementado ao nível da camada de rede, mantendo o estado sincronizado entre catálogo, carrinho, favoritos, perfil e pedidos.

---

## 2. Contratos REST

A comunicação com o *backend* simulado obedece aos seguintes contratos REST principais:

| Recurso | Método & Endpoint | Descrição / Parâmetros |
| :--- | :--- | :--- |
| **Sessão e Conta** | `POST /api/auth/login` | Autenticação de utilizador com credenciais fictícias. |
| **Sessão e Conta** | `GET /api/auth/session` | Recuperação da sessão ativa após *refresh* de página. |
| **NFTs** | `GET /api/nfts` | Listagem com suporte a busca (`search`), filtros (`category`, `rarity`), ordenação e paginação. |
| **NFTs** | `GET /api/nfts/:id` | Obtenção dos detalhes completos de um NFT específico. |
| **Carrinho** | `GET / POST / DELETE /api/cart` | Consulta, adição, alteração de quantidades e remoção de itens do carrinho. |
| **Cotação** | `POST /api/checkout/quote` | Validação de cupões, cálculo de subtotais, descontos e taxas de rede. |
| **Pedidos** | `POST /api/orders` | Criação idempotente de pedidos (requer chave de idempotência no *header*). |
| **Perfil** | `GET / PUT /api/profile` | Consulta e atualização dos dados do colecionador e avatar. |
| **Carteiras** | `GET / POST /api/wallets` | Gestão de carteiras principal e secundária do utilizador. |

* **Tratamento de Erros:** As respostas de erro seguem o padrão HTTP standard (ex: `400` para validação/cupão inválido, `401` para sessão expirada/não autorizado, `404` para recurso inexistente e `409` para conflitos de disponibilidade).

---

## 3. Tempo Real com Socket.IO

A sincronização em tempo real é efetuada através de instâncias de `socket.io-client` integradas com o MSW (utilizando `@mswjs/socket.io-binding`).

* **`nft.updated`**: Disparado quando ocorre uma alteração de preço ou esgotamento de edição de um NFT. O cliente atualiza automaticamente o catálogo, os detalhes e o carrinho ativo. Se houver divergência de preço, o *checkout* impede a finalização até o utilizador revalidar a cotação.
* **`order.updated`**: Notifica a alteração de estado de um pedido pendente para confirmado ou recusado.
* **Reconciliação:** Em caso de desconexão ou interrupção de rede durante o pagamento pendente, o estado é recuperado após a reconexão sem gerar duplicatas de pedidos (assegurado por idempotência).

---

## 4. Política de Cache e Sessão

* **Cache do TanStack Query:** Os dados de catálogo possuem um `staleTime` configurado para otimizar o desempenho, sendo invalidados imediatamente após operações de *mutation* (como alteração de carrinho ou favoritos).
* **Persistência Local:** O estado do carrinho e a sessão do utilizador utilizam armazenamento local (`localStorage`) para garantir a resiliência a *refreshes*, isolando os dados estritamente ao utilizador autenticado.
* **Limpeza de Sessão:** No evento de `logout`, todo o *cache* privado do TanStack Query é limpo e as subscrições ativas de WebSocket são encerradas.

---

## 5. Decisões de UX e Limitações

* **Tratamento de Estados Vazios:** Ecrãs sem itens (como carrinho vazio ou resultados de busca sem correspondência) apresentam componentes informativos com caminhos de retorno claros.
* **Limitações do Ambiente de Mocks:** Como o ambiente é puramente *frontend* com MSW, as transações de *blockchain* e os *gateways* de pagamento são simulados de forma determinística, preservando o comportamento de sucesso, recusa e latência variável.