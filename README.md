# CriptoPassivo — Dashboard SaaS

Dashboard real de carteira de renda passiva em cripto: alocação, rendimento
projetado, rebalanceamento e cálculo de IR — com preço real via CoinGecko e
dados salvos por usuário no Supabase.

## Stack

- Next.js 14 (App Router) + TypeScript
- Supabase (Auth via magic link + Postgres com RLS)
- Tailwind CSS
- Recharts (gráficos)
- CoinGecko API (preço em tempo real, via rota interna `/api/prices`)

## Setup no Codespaces

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto no Supabase

Se você ainda não tem um projeto Supabase pra isso:

1. Acesse [supabase.com](https://supabase.com) → New Project
2. Guarde a **Project URL** e a **anon public key** (Settings → API)

### 3. Rodar a migration

Abra o **SQL Editor** do seu projeto Supabase e cole o conteúdo de
`supabase/migrations/0001_init.sql`, depois clique em Run.

Isso cria:
- `portfolio_assets` — ativos da carteira de cada usuário
- `sales` — vendas registradas pra cálculo de IR
- Row Level Security em ambas (cada usuário só vê os próprios dados)

### 4. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com a URL e a anon key do seu projeto Supabase.

### 5. Habilitar magic link no Supabase

Authentication → Providers → Email → confirme que "Enable email provider"
está ativo (vem ativo por padrão). Não precisa de senha, é só link mágico.

### 6. Rodar o projeto

```bash
npm run dev
```

No Codespaces, ele vai sugerir abrir a porta 3000 no navegador — aceite,
ou vá na aba "Ports" e abra manualmente.

## Deploy em produção

Mesmo padrão que você já usa no Aion e no LOBBY:

```
Frontend → Vercel (importa o repo, adiciona as 2 env vars, deploy automático)
Banco    → Supabase (já é gerenciado, não precisa de servidor separado)
```

Não precisa de Render aqui — como não tem backend separado (as API routes
do Next.js já cobrem isso), Vercel sozinho resolve.

## Estrutura

```
app/
  page.tsx                 → redireciona pra /login ou /dashboard
  login/page.tsx           → login com magic link
  auth/callback/route.ts   → troca o código do magic link pela sessão
  dashboard/page.tsx       → busca dados iniciais no servidor
  dashboard/DashboardClient.tsx → toda a UI interativa (gráficos, CRUD)
  api/prices/route.ts      → busca preço real na CoinGecko (com cache de 20s)
lib/
  supabase/client.ts       → client Supabase pro browser
  supabase/server.ts       → client Supabase pro servidor
  assets.ts                → moedas suportadas (mapeamento pro CoinGecko)
supabase/migrations/
  0001_init.sql             → schema completo com RLS
```

## Adicionando mais moedas

Edite `lib/assets.ts` e adicione o par `SÍMBOLO: { label, coingeckoId }`.
O `coingeckoId` precisa bater com o ID usado pela CoinGecko
(ex: confira em `https://api.coingecko.com/api/v3/coins/list`).

## Limitação conhecida

A API gratuita da CoinGecko tem rate limit (10-30 chamadas/min). A rota
`/api/prices` já cacheia por 20 segundos entre usuários pra não estourar
o limite — se o produto crescer muito, migre pra um plano pago da CoinGecko
ou pra uma exchange com WebSocket de preço (Binance tem um gratuito).
