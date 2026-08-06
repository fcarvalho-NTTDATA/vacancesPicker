# Gestão de Férias

Aplicação de controlo de férias da equipa: cada utilizador insere os seus períodos de férias, o administrador (PM) cria contas, gere projetos, aloca pessoas a projetos e visualiza as férias de todos com filtro por projeto.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind CSS + Prisma + NeonDB (Postgres) + Auth.js (NextAuth v5)**, pronta para deploy no **Vercel**.

## Funcionalidades

- Login com email + password (contas criadas apenas pelo admin, sem registo público)
- Utilizador: regista períodos de férias, vê saldo anual (dias usados/restantes) e calendário do ano
- Admin: dashboard com a grelha de férias de toda a equipa por mês, com filtro por projeto
- Admin: CRUD de utilizadores (nome, email, password, perfil, dias de férias/ano, projetos alocados)
- Admin: CRUD de projetos (nome + cor, usados como filtro e badges)
- Sem fluxo de aprovação — o que o utilizador insere fica logo visível ao admin

## 1. Criar a base de dados na Neon

1. Cria uma conta em [neon.tech](https://neon.tech) e um novo projeto (ex: `ferias`)
2. No dashboard, vai a **Connection Details** e copia a connection string "pooled" (formato `postgresql://user:password@ep-xxxx-pooler.<region>.aws.neon.tech/neondb?sslmode=require`)

## 2. Configurar variáveis de ambiente

Copia `.env.example` para `.env` e preenche:

```bash
cp .env.example .env
```

- `DATABASE_URL` — a connection string da Neon
- `AUTH_SECRET` — gera com `npx auth secret` (ou `openssl rand -base64 33`)
- `SEED_ADMIN_NAME` / `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — usados só uma vez pelo script de seed para criar a primeira conta de administrador

## 3. Instalar dependências e criar as tabelas

```bash
npm install
npm run db:migrate   # cria as tabelas na Neon (prisma migrate dev)
npm run db:seed       # cria o primeiro utilizador administrador
```

## 4. Correr localmente

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) e entra com o email/password definidos em `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. A partir daí, cria projetos em **Projetos** e utilizadores em **Utilizadores** pela própria interface.

## 5. Deploy no Vercel

1. Faz push do repositório para o GitHub (ou outro Git provider)
2. Importa o repositório em [vercel.com/new](https://vercel.com/new)
3. Nas **Environment Variables** do projeto Vercel, adiciona `DATABASE_URL`, `AUTH_SECRET`, `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
4. O comando de build já inclui `prisma generate` (definido em `package.json`), não é preciso configurar nada extra
5. Depois do primeiro deploy, corre as migrations contra a base de dados de produção a partir da tua máquina (com o `.env` a apontar para a `DATABASE_URL` de produção):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Estrutura principal

- `prisma/schema.prisma` — modelo de dados (User, Project, ProjectAssignment, VacationEntry)
- `prisma/seed.ts` — cria o primeiro administrador
- `src/lib/auth.ts` / `src/lib/auth.config.ts` — configuração do Auth.js (credentials + proteção de rotas)
- `src/proxy.ts` — proteção de rotas por sessão/perfil (equivalente ao middleware do Next.js)
- `src/app/(app)/ferias` — área do utilizador
- `src/app/(app)/admin` — área do administrador (visão geral, utilizadores, projetos)

## Notas

- Sem fluxo de aprovação: as férias inseridas ficam imediatamente visíveis ao admin
- Os dias de férias contam apenas dias úteis (exclui sábados e domingos)
- Não existe ecrã de "alterar a minha password" na v1 — a gestão de passwords é feita pelo admin em **Utilizadores**
