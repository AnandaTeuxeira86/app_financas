# Finanças — controle financeiro pessoal

Web app para registrar receitas e despesas, organizar por categoria e acompanhar o saldo mensal.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Recharts · Supabase (Auth + PostgreSQL com RLS) · Vercel

## Funcionalidades

- **Landing page** (`/`) com apresentação do produto
- **Autenticação** por e-mail/senha (`/login`, `/cadastro`), com rotas protegidas via `src/proxy.ts`
- **Dashboard** (`/dashboard`): cards de Receitas, Despesas e Saldo, gráfico de rosca das despesas por categoria e últimas transações
- **Transações** (`/transacoes`): criar, editar e excluir; filtros por mês/ano e categoria; busca por descrição (ignora acentos)
- **Exportar CSV** das transações filtradas (separador `;` e UTF-8 com BOM, abre direto no Excel)
- **Responsivo**: tabela no desktop, lista e navegação inferior no mobile
- **Row Level Security**: cada usuário só acessa as próprias transações

## Como rodar

1. **Crie um projeto** em [supabase.com](https://supabase.com).
2. **Crie a tabela**: abra o *SQL Editor* do Supabase e execute [`supabase/schema.sql`](supabase/schema.sql).
3. **Configure o ambiente**: copie `.env.example` para `.env.local` e preencha com os valores de *Project Settings → API*:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. **Rode o app**:
   ```bash
   npm install
   npm run dev
   ```
   Acesse http://localhost:3000.

> Por padrão o Supabase exige confirmação de e-mail no cadastro. Para testar mais rápido, desative em
> *Authentication → Sign In / Providers → Email → Confirm email*.

## Deploy na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Importe o repositório na Vercel e adicione as duas variáveis `NEXT_PUBLIC_SUPABASE_*`.
3. No Supabase, em *Authentication → URL Configuration*, coloque a URL da Vercel como *Site URL*.

## Estrutura

```
src/
  app/
    page.tsx                 landing page
    login/, cadastro/        autenticação
    (app)/layout.tsx         layout autenticado (header + navegação)
    (app)/dashboard/         dashboard
    (app)/transacoes/        CRUD, filtros e exportação
  components/app/            componentes do app (gráfico, formulário, lista...)
  components/ui/             componentes shadcn/ui
  hooks/use-transactions.ts  leitura e escrita das transações no Supabase
  lib/finance.ts             categorias, formatação, resumo e CSV
  lib/supabase/              cliente Supabase e variáveis de ambiente
  proxy.ts                   renovação de sessão e proteção de rotas
supabase/schema.sql          tabela, índice e políticas RLS
```

## Milestones

1. ✅ Setup: Next.js, Tailwind, shadcn/ui, Supabase
2. ✅ Autenticação e proteção de rotas
3. ✅ Banco de dados com RLS e CRUD de transações
4. ✅ Categorias, filtros, busca e exportação CSV
5. ✅ Dashboard com cards e gráfico (Recharts)
6. ✅ Landing page e layout responsivo
7. ⏭️ Deploy na Vercel (veja acima)
