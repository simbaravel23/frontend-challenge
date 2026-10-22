# 🏛️ Arquitetura e Decisões Técnicas — Kurio NFT Marketplace

Este documento detalha as decisões de arquitetura, padrões de projeto e estratégias de engenharia implementadas no frontend do marketplace da **Kurio**.

---

## 🛠️ Stack Tecnológica & Dependências

* **Framework Base:** React 19 + TypeScript + Vite.
* **Estilização & Design System:** Tailwind CSS v4 + componentes com acessibilidade baseados em `shadcn/ui`.
* **Roteamento & Estado da URL:** TanStack Router (com validação de `searchParams` via TypeScript).
* **Gerenciamento de Estado do Servidor:** TanStack Query v5 (React Query) para busca, armazenamento em cache e invalidação de dados.
* **Mocks de API & Tempo Real:** 
  * MSW (Mock Service Worker) para interceptação REST.
  * `@mswjs/socket.io-binding` + `socket.io-client` para simulação de WebSocket em tempo real.
* **Testes End-to-End (E2E):** Playwright.

---

## 🧭 Padrões de Roteamento & Navegação (TanStack Router)

A aplicação utiliza o **TanStack Router** para gerir rotas de forma fortemente tipada:
1. **Validação de Filtros e Paginação na URL:**
   * Os parâmetros `search`, `category`, `rarity`, `sort` e `page` são sincronizados com a query string da URL via `validateSearch`.
   * Isto permite a partilha de URLs com o estado exato da pesquisa mantido e reidratado.
2. **Proteção de Rotas (`beforeLoad`):**
   * As rotas `/profile`, `/cart/checkout` e `/orders/$id` utilizam a guarda de navegação `ensureAuthenticated` para validar a sessão e retratar o redirecionamento pós-login (`return_to`).

---

## 🔄 Tempo Real & Reconciliação do TanStack Query

A atualização de cotação dos NFTs e o estado das ordens são simulados em tempo real através do protocolo WebSocket:
1. **Conexão Socket.IO:** O hook `useNFTRealtime` conecta-se ao servidor simulado pelo MSW.
2. **Invalidação de Cache:** Quando o evento `nft.updated` é emitido com novos valores de preço ou disponibilidade, o hook executa `queryClient.invalidateQueries({ queryKey: ['nfts'] })`.
3. **Sincronização Visual:** O catálogo é re-renderizado com os novos valores sem requisições desnecessárias ou *flashes* de carregamento.

---

## 🛒 Gestão de Estado Local (Carrinho & Autenticação)

* **Carrinho (`CartContext`):** Gerido via React Context API com persistência em `localStorage`. Suporta adição, remoção, alteração de quantidade respeitando o stock/edição disponível do NFT e cálculo dinâmico do total em ETH.
* **Sessão & Tokens:** Os tokens de autenticação (`kurio_token`) e os dados do colecionador são armazenados com segurança e limpos em eventos de *logout*.

---

## 🧪 Estratégia de Testes E2E (Playwright)

A suíte de testes ponta a ponta em `e2e/flow.spec.ts` cobre a jornada crítica do utilizador:
1. **Autenticação:** Login com credenciais de teste (`colecionador@kurio.io` / `kurio123`).
2. **Navegação & Filtros:** Aplicação de pesquisa e seleção de categorias na sidebar.
3. **Fluxo do Carrinho:** Adição de NFTs, navegação para o checkout e finalização da compra.
4. **Perfil:** Acesso aos dados do colecionador e gestão de carteiras conectadas.

---

## 🔑 Credenciais de Teste para Avaliação

* **E-mail:** `colecionador@kurio.io`
* **Palavra-passe:** `kurio123`