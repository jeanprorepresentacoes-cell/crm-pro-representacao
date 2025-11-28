# CRM Pro Representações - Documentação Técnica

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Instalação e Setup](#instalação-e-setup)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Banco de Dados](#banco-de-dados)
6. [API (tRPC)](#api-trpc)
7. [Frontend](#frontend)
8. [Funcionalidades](#funcionalidades)
9. [Testes](#testes)
10. [Deployment](#deployment)

---

## Visão Geral

**CRM Pro Representações** é um sistema de gerenciamento de relacionamento com clientes (CRM) desenvolvido para empresas de representação comercial. O sistema gerencia leads, clientes, orçamentos, vendas, comissões e relatórios.

**Stack Tecnológico:**
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Backend:** Node.js + Express + tRPC 11
- **Banco de Dados:** MySQL/TiDB + Drizzle ORM
- **Autenticação:** Manus OAuth
- **Email:** Nodemailer
- **WebSockets:** Socket.io
- **Importação:** PapaParse (CSV/Excel)

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                      │
│  - Dashboard com gráficos (Plotly)                          │
│  - Módulos: Leads, Clientes, Orçamentos, Vendas, etc       │
│  - Formulários com validações e máscaras                    │
│  - Integração ViaCEP para autocomplete de endereço          │
└────────────────────┬────────────────────────────────────────┘
                     │ tRPC + HTTP
┌────────────────────▼────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  - Procedimentos tRPC (30+ procedures)                      │
│  - Autenticação OAuth                                        │
│  - Serviço de Email (Nodemailer)                            │
│  - WebSockets (Socket.io) para tempo real                   │
│  - Validações e regras de negócio                           │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────────┐
│              Banco de Dados (MySQL/TiDB)                     │
│  - 9 tabelas principais                                      │
│  - Relacionamentos e constraints                             │
│  - Índices para performance                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Instalação e Setup

### Pré-requisitos
- Node.js 18+
- pnpm 8+
- MySQL 8+ ou TiDB

### Passos de Instalação

```bash
# 1. Clonar o repositório
git clone <repo-url>
cd crm_pro_representacoes

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 4. Executar migrações do banco de dados
pnpm db:push

# 5. Iniciar o servidor de desenvolvimento
pnpm dev

# 6. Acessar a aplicação
# Frontend: http://localhost:3000
# API: http://localhost:3000/api/trpc
```

### Variáveis de Ambiente Necessárias

```env
# Banco de Dados
DATABASE_URL=mysql://user:password@localhost:3306/crm_pro

# Autenticação
JWT_SECRET=seu-secret-jwt-aqui
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASSWORD=sua-senha-app

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api
```

---

## Estrutura do Projeto

```
crm_pro_representacoes/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                   # Páginas principais
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Leads.tsx
│   │   │   ├── Clientes.tsx
│   │   │   ├── ClienteDetalhes.tsx
│   │   │   ├── Orcamentos.tsx
│   │   │   ├── Vendas.tsx
│   │   │   ├── VendaDetalhes.tsx
│   │   │   ├── Empresas.tsx
│   │   │   ├── Produtos.tsx
│   │   │   ├── Relatorios.tsx
│   │   │   ├── Comissoes.tsx
│   │   │   ├── Configuracoes.tsx
│   │   │   └── Importacao.tsx
│   │   ├── components/              # Componentes reutilizáveis
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── LeadModal.tsx
│   │   │   ├── ClienteModal.tsx
│   │   │   ├── ConvertLeadModal.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── trpc.ts              # Cliente tRPC
│   │   │   ├── viacep.ts            # Integração ViaCEP
│   │   │   └── ...
│   │   ├── App.tsx                  # Roteamento principal
│   │   └── index.css                # Estilos globais
│   └── index.html
│
├── server/                          # Backend Node.js
│   ├── routers.ts                   # Procedimentos tRPC
│   ├── db.ts                        # Helpers de banco de dados
│   ├── email.ts                     # Serviço de email
│   ├── leads.test.ts                # Testes unitários
│   ├── _core/                       # Framework core
│   │   ├── index.ts                 # Inicialização do servidor
│   │   ├── context.ts               # Contexto tRPC
│   │   ├── trpc.ts                  # Configuração tRPC
│   │   ├── llm.ts                   # Integração LLM
│   │   ├── voiceTranscription.ts
│   │   ├── imageGeneration.ts
│   │   └── ...
│   └── ...
│
├── drizzle/                         # Banco de dados
│   ├── schema.ts                    # Definição das tabelas
│   └── migrations/                  # Migrações
│
├── shared/                          # Código compartilhado
│   └── const.ts
│
└── package.json
```

---

## Banco de Dados

### Tabelas Principais

#### 1. **users**
Usuários do sistema com autenticação OAuth.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP
);
```

#### 2. **leads**
Leads (prospectos) de vendas.

```sql
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomePessoa VARCHAR(255) NOT NULL,
  nomeEstabelecimento VARCHAR(255),
  email VARCHAR(320),
  telefone VARCHAR(20),
  cidade VARCHAR(100),
  status ENUM('novo', 'em_contato', 'qualificado', 'perdido') DEFAULT 'novo',
  representanteId INT,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (representanteId) REFERENCES users(id)
);
```

#### 3. **clientes**
Clientes convertidos de leads.

```sql
CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomePessoa VARCHAR(255) NOT NULL,
  nomeEstabelecimento VARCHAR(255),
  cnpj VARCHAR(18),
  cpf VARCHAR(14),
  email VARCHAR(320),
  telefone VARCHAR(20),
  enderecCompleto VARCHAR(255),
  numero VARCHAR(10),
  bairro VARCHAR(100),
  cep VARCHAR(10),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
  limiteCredito DECIMAL(12, 2),
  condicaoPagamento VARCHAR(50),
  representanteId INT,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (representanteId) REFERENCES users(id)
);
```

#### 4. **empresas_representadas**
Empresas que o CRM representa.

```sql
CREATE TABLE empresas_representadas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  email VARCHAR(320),
  telefone VARCHAR(20),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  website VARCHAR(255),
  logoUrl VARCHAR(255),
  status ENUM('ativa', 'inativa') DEFAULT 'ativa',
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **produtos**
Produtos oferecidos pelas empresas.

```sql
CREATE TABLE produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE,
  descricao TEXT,
  categoria VARCHAR(100),
  preco DECIMAL(12, 2),
  empresaId INT NOT NULL,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresaId) REFERENCES empresas_representadas(id)
);
```

#### 6. **orcamentos**
Orçamentos enviados aos clientes.

```sql
CREATE TABLE orcamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(20) UNIQUE NOT NULL,
  clienteId INT NOT NULL,
  empresaId INT NOT NULL,
  valor DECIMAL(12, 2),
  desconto DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2),
  status ENUM('rascunho', 'enviado', 'aceito', 'rejeitado') DEFAULT 'rascunho',
  representanteId INT,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataEnvio TIMESTAMP,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (empresaId) REFERENCES empresas_representadas(id),
  FOREIGN KEY (representanteId) REFERENCES users(id)
);
```

#### 7. **itens_orcamento**
Itens de cada orçamento.

```sql
CREATE TABLE itens_orcamento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orcamentoId INT NOT NULL,
  produtoId INT NOT NULL,
  quantidade INT,
  precoUnitario DECIMAL(12, 2),
  subtotal DECIMAL(12, 2),
  FOREIGN KEY (orcamentoId) REFERENCES orcamentos(id),
  FOREIGN KEY (produtoId) REFERENCES produtos(id)
);
```

#### 8. **vendas**
Vendas confirmadas.

```sql
CREATE TABLE vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(20) UNIQUE NOT NULL,
  orcamentoId INT,
  clienteId INT NOT NULL,
  empresaId INT NOT NULL,
  valor DECIMAL(12, 2),
  comissao DECIMAL(12, 2),
  percentualComissao DECIMAL(5, 2) DEFAULT 10,
  status ENUM('pendente', 'confirmada', 'entregue', 'cancelada') DEFAULT 'pendente',
  representanteId INT,
  dataCriacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dataEntrega TIMESTAMP,
  FOREIGN KEY (orcamentoId) REFERENCES orcamentos(id),
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (empresaId) REFERENCES empresas_representadas(id),
  FOREIGN KEY (representanteId) REFERENCES users(id)
);
```

#### 9. **historico_leads**
Histórico de alterações de leads.

```sql
CREATE TABLE historico_leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  leadId INT NOT NULL,
  acao VARCHAR(255),
  usuarioId INT,
  dataAlteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leadId) REFERENCES leads(id),
  FOREIGN KEY (usuarioId) REFERENCES users(id)
);
```

---

## API (tRPC)

### Estrutura de Procedimentos

Os procedimentos tRPC estão organizados em routers por módulo:

```typescript
// server/routers.ts
export const appRouter = router({
  auth: router({
    me: publicProcedure.query(...),
    logout: publicProcedure.mutation(...),
  }),
  leads: router({
    list: publicProcedure.input(...).query(...),
    create: protectedProcedure.input(...).mutation(...),
    update: protectedProcedure.input(...).mutation(...),
    delete: adminProcedure.input(...).mutation(...),
  }),
  clientes: router({...}),
  orcamentos: router({...}),
  vendas: router({...}),
  empresas: router({...}),
  produtos: router({...}),
  system: router({...}),
});
```

### Exemplo de Uso no Frontend

```typescript
import { trpc } from "@/lib/trpc";

function MinhaComponente() {
  // Query
  const { data: leads, isLoading } = trpc.leads.list.useQuery({
    status: "novo",
    search: "",
    limit: 10,
    offset: 0,
  });

  // Mutation
  const createLead = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Lead criado com sucesso!");
      // Invalidar cache
      trpc.useUtils().leads.list.invalidate();
    },
  });

  return (
    <div>
      {isLoading ? <Spinner /> : <LeadsList leads={leads} />}
      <Button onClick={() => createLead.mutate({...})}>
        Criar Lead
      </Button>
    </div>
  );
}
```

---

## Frontend

### Componentes Principais

#### DashboardLayout
Layout principal com sidebar, header e conteúdo.

```typescript
<DashboardLayout>
  <Dashboard />
</DashboardLayout>
```

#### Modais CRUD
Componentes para criar/editar entidades:
- `LeadModal`
- `ClienteModal`
- `EmpresaModal`
- `ProdutoModal`
- `OrcamentoModal`
- `ConvertLeadModal`

#### Páginas
- **Dashboard:** KPIs, gráficos e atividades recentes
- **Leads:** Listagem, filtros, busca, modais CRUD
- **Clientes:** Listagem, detalhes com abas, modais CRUD
- **Orçamentos:** Listagem, criação com etapas, visualização, PDF
- **Vendas:** Listagem, detalhes, atualização de status
- **Empresas:** Listagem com cards, upload de logo
- **Produtos:** Listagem, filtros, modais CRUD
- **Relatórios:** Múltiplos relatórios com exportação
- **Comissões:** Tabela de comissões, filtros, exportação
- **Configurações:** Perfil, empresa, notificações, aparência, segurança
- **Importação:** Upload CSV/Excel, validação, importação em lote

### Validações e Máscaras

```typescript
import { IMaskInput } from "imask";

// Máscara de telefone
<IMaskInput
  mask="(00) 00000-0000"
  value={telefone}
  onChange={(e) => setTelefone(e.currentTarget.value)}
/>

// Máscara de CEP
<IMaskInput
  mask="00000-000"
  value={cep}
  onChange={(e) => setCep(e.currentTarget.value)}
/>
```

### Integração ViaCEP

```typescript
import { buscarEnderecoPorCEP, formatarCEP } from "@/lib/viacep";

const handleBuscaCEP = async (cep: string) => {
  const endereco = await buscarEnderecoPorCEP(cep);
  if (endereco) {
    setFormData({
      ...formData,
      enderecCompleto: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.localidade,
      estado: endereco.uf,
    });
  }
};
```

---

## Funcionalidades

### 1. Gerenciamento de Leads
- Criar, editar, deletar leads
- Filtrar por status, cidade, data
- Buscar por nome ou estabelecimento
- Converter lead em cliente
- Histórico de alterações

### 2. Gerenciamento de Clientes
- Criar, editar, deletar clientes
- Página de detalhes com abas (informações, orçamentos, vendas, histórico)
- Filtrar por status, cidade, representante
- Buscar por nome, CNPJ, estabelecimento
- Limite de crédito e condição de pagamento

### 3. Gerenciamento de Orçamentos
- Criar orçamentos com múltiplos itens
- Tabela dinâmica de produtos
- Cálculos automáticos (subtotal, desconto, total)
- Enviar orçamento por email
- Aceitar/rejeitar orçamentos
- Gerar PDF
- Visualização profissional

### 4. Gerenciamento de Vendas
- Registrar vendas
- Atualizar status (pendente → confirmada → entregue)
- Calcular comissões automaticamente
- Página de detalhes com abas
- Filtrar por status, empresa, representante, período
- Buscar por número ou cliente

### 5. Relatórios
- Relatório de vendas
- Relatório de leads
- Relatório de clientes
- Relatório de comissões
- Exportar em PDF/Excel
- Filtros por período, representante, empresa

### 6. Comissões (Admin Only)
- Tabela de comissões por representante
- Filtros por período, representante, status de pagamento
- Gráficos de comissões
- Exportar relatório
- Marcar como pago

### 7. Importação em Lote
- Upload CSV/Excel
- Validação de dados
- Importação de leads/clientes
- Relatório de sucesso/erro
- Download de template

### 8. Dashboard em Tempo Real
- KPIs (Total de Leads, Clientes, Vendas, Orçamentos Pendentes, Comissão)
- Gráficos (linha, pizza, barras, funil)
- Atividades recentes
- Filtros globais (período, representante, empresa)
- WebSockets para atualização em tempo real

### 9. Email
- Envio de orçamentos por email
- Confirmação de vendas
- Templates HTML profissionais
- Configuração via Nodemailer

### 10. Integração ViaCEP
- Autocomplete de endereço pelo CEP
- Validação de CEP
- Formatação automática

---

## Testes

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em modo watch
pnpm test:watch

# Rodar com coverage
pnpm test:coverage
```

### Estrutura de Testes

```typescript
describe("Leads Router", () => {
  describe("list", () => {
    it("should list leads with filters", async () => {
      // ...
    });
  });

  describe("create", () => {
    it("should create a new lead", async () => {
      // ...
    });

    it("should validate required fields", async () => {
      // ...
    });
  });
});
```

---

## Deployment

### Build para Produção

```bash
# Build frontend
pnpm build

# Build backend (se necessário)
pnpm build:server
```

### Variáveis de Ambiente em Produção

Certifique-se de configurar todas as variáveis de ambiente necessárias no servidor:

```env
NODE_ENV=production
DATABASE_URL=mysql://...
JWT_SECRET=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASSWORD=...
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

---

## Suporte e Contribuição

Para dúvidas, sugestões ou reportar bugs, entre em contato com o time de desenvolvimento.

---

**Última atualização:** Novembro 2024
**Versão:** 1.0.0
