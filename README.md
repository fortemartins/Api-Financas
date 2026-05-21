# 💰 FinançasPessoais

App de gestão financeira pessoal — simples, visual e responsivo.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · shadcn/ui · Supabase · Recharts · Vercel

---

## ✨ Funcionalidades

- 🔐 **Autenticação** com Supabase Auth (email/senha)
- ➕ **Cadastro de transações** — receitas e despesas com categoria, data, descrição
- 🔍 **Filtros** por período e categoria
- 📊 **Dashboard** com cards de resumo (receitas, despesas, saldo)
- 🥧 **Gráfico de pizza** — despesas por categoria (Recharts)
- ✏️ **Editar e excluir** transações
- 📱 **Responsivo** — mobile-first com bottom nav

---

## 🚀 Setup Local

### 1. Instale as dependências

```bash
cd financas-app
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Vá em **SQL Editor** e execute `supabase/schema.sql`
3. Copie as credenciais em **Project Settings → API**

```bash
cp .env.local.example .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 3. Rode

```bash
npm run dev
# http://localhost:3000
```

---

## 🗄️ Schema

```
categories     — id, name, color, user_id, is_default
transactions   — id, user_id, type, amount, description, category_id, date
```

Row Level Security ativo — cada usuário vê apenas seus dados.

---

## ☁️ Deploy Vercel

1. Push para GitHub
2. Importe em [vercel.com](https://vercel.com)
3. Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

> Desenvolvido com ❤️ usando **Claude Code**
