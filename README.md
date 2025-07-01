# Widget App - Compressor de Imagens

Um aplicativo fullstack para upload e compressão de imagens, desenvolvido com React e Fastify.

## 📋 Sobre o Projeto

O Widget App é um app para upload e compressão de imagens, permitindo aos usuários reduzir o tamanho de suas imagens mantendo a qualidade visual. O projeto é estruturado como um monorepo contendo o frontend e o backend.

## 🏗️ Arquitetura

```
widget-app/
├── web/          # Frontend (React + Vite)
├── server/       # Backend (Fastify + Drizzle)
└── README.md
```

## 🚀 Tecnologias

### Frontend (web/)
- **React** - Biblioteca para interfaces de usuário
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **Zustand** - Gerenciamento de estado
- **React Dropzone** - Upload de arquivos por drag & drop
- **Radix UI** - Componentes com acessibilidade
- **Axios** - Cliente HTTP

### Backend (server/)
- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Cloudflare R2** - Armazenamento de arquivos
- **Zod** - Validação de schemas
- **Vitest** - Framework de testes

## 📦 Pré-requisitos

- Node.js 18+
- pnpm
- Docker

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd widget-app
```

### 2. Backend (server/)
```bash
cd server
pnpm install
```

#### Configuração do Banco de Dados
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure as variáveis de ambiente no .env
# DATABASE_URL=postgresql://user:password@localhost:5432/widget_app
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_BUCKET_NAME=your_bucket_name
# AWS_REGION=your_region

# Execute as migrações
pnpm db:migrate
```

#### Executar o servidor
```bash
# Desenvolvimento
pnpm dev

# Produção
pnpm build
pnpm start
```

### 3. Frontend (web/)
```bash
cd web
pnpm install
```

#### Configuração
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Configure a URL da API no .env
# VITE_API_URL=http://localhost:3333
```

#### Executar o frontend
```bash
# Desenvolvimento
pnpm dev

# Build para produção
pnpm build
pnpm preview
```

## 🐳 Docker

O projeto inclui configuração Docker para o backend:

```bash
cd server
docker-compose up -d
```

## 🧪 Testes

### Backend
```bash
cd server
pnpm test          # Executar testes uma vez
pnpm test:watch    # Executar testes em modo watch
```

## 📚 Documentação da API

Com o servidor rodando, acesse a documentação Swagger em:
```
http://localhost:3333/docs
```

## 🔧 Scripts Disponíveis

### Backend (server/)
- `pnpm dev` - Inicia o servidor em modo desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm start` - Inicia o servidor de produção
- `pnpm test` - Executa os testes
- `pnpm db:generate` - Gera migrações do banco
- `pnpm db:migrate` - Executa migrações
- `pnpm db:studio` - Abre o Drizzle Studio

### Frontend (web/)
- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm preview` - Preview do build de produção
- `pnpm lint` - Executa o linter

## 🌟 Funcionalidades

- ✅ Upload de imagens via drag & drop
- ✅ Compressão automática de imagens
- ✅ Interface responsiva
- ✅ API RESTful com documentação
- ✅ Armazenamento de imagens no Cloudflare R2
- ✅ Validação de tipos de arquivo
- ✅ Feedback visual de progresso

## 👥 Autor

Desenvolvido com ❤️ por [Tiago Lopes](https://www.tiagolopes.bio)