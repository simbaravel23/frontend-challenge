# 🚀 Kurio — NFT Marketplace (Frontend Challenge)

O **Kurio** é uma plataforma de marketplace de NFTs desenvolvida em React e TypeScript, focada na comercialização, descoberta e gestão de coleções digitais exclusivas. Este projeto foi construído como parte do desafio frontend, seguindo fielmente a identidade visual do Figma e os requisitos de arquitetura.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Interface** | React 18 / 19 |
| **Linguagem** | TypeScript |
| **Estilização** | Tailwind CSS v4 & shadcn/ui |
| **Roteamento** | TanStack Router |
| **Estado Remoto** | TanStack Query (React Query) |
| **Cliente HTTP** | Axios |
| **Mocking de API** | MSW (Mock Service Worker) |
| **Tempo Real** | Socket.IO (`@mswjs/socket.io-binding`) |
| **Testes E2E** | Playwright |
| **Build & Tooling** | Vite |

---

## 📦 Funcionalidades Implementadas

- 🖼️ **Catálogo de NFTs:** Listagem dinâmica com busca, filtros por categoria, ordenação e paginação sincronizados com a URL.
- 🛒 **Carrinho de Compras:** Gestão em tempo real de itens, cálculo automático em ETH, suporte a cupons de desconto e persistência local.
- 🔗 **Integração MSW & Socket.IO:** Simulação de rede REST e atualizações em tempo real para mudanças de preço e disponibilidade (`nft.updated`).
- ⚡ **Performance & Acessibilidade:** Uso de Skeletons com efeito *shimmer*, navegação por teclado e otimização para auditoria Lighthouse.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18+ recomendada)
- `npm` ou `pnpm`

### 1. Clonar o Repositório
```bash
git clone [https://github.com/simbaravel23/frontend-challenge.git](https://github.com/simbaravel23/frontend-challenge.git)
cd frontend-challenge