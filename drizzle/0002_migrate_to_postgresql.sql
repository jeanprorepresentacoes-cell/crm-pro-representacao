-- Migration: Migrate from MySQL to PostgreSQL for Supabase
-- This migration creates all tables with PostgreSQL syntax

-- Create ENUMS for PostgreSQL
CREATE TYPE role AS ENUM ('user', 'admin', 'representante');
CREATE TYPE lead_status AS ENUM ('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'perdido', 'convertido');
CREATE TYPE lead_source AS ENUM ('indicacao', 'site', 'evento', 'cold_call', 'outro');
CREATE TYPE cliente_status AS ENUM ('ativo', 'inativo', 'suspenso');
CREATE TYPE orcamento_status AS ENUM ('rascunho', 'enviado', 'aceito', 'rejeitado', 'expirado');
CREATE TYPE venda_status AS ENUM ('pendente', 'confirmada', 'entregue', 'cancelada');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role role NOT NULL DEFAULT 'user',
  "empresaId" INTEGER,
  ativo BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create empresas_representadas table
CREATE TABLE IF NOT EXISTS empresas_representadas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  logo_url TEXT,
  descricao TEXT,
  telefone VARCHAR(20),
  email VARCHAR(320),
  website VARCHAR(255),
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  ativo BOOLEAN NOT NULL DEFAULT true,
  criado_por INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nome_pessoa VARCHAR(255) NOT NULL,
  nome_estabelecimento VARCHAR(255) NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(320),
  observacoes TEXT,
  status lead_status NOT NULL DEFAULT 'novo',
  representante_id INTEGER NOT NULL,
  fonte_lead lead_source DEFAULT 'outro',
  data_ultimo_contato TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome_pessoa VARCHAR(255) NOT NULL,
  nome_estabelecimento VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  cpf VARCHAR(14),
  cidade VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(320) NOT NULL,
  endereco_completo VARCHAR(255) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  complemento VARCHAR(255),
  bairro VARCHAR(100) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  observacoes TEXT,
  lead_id INTEGER,
  representante_id INTEGER NOT NULL,
  status cliente_status NOT NULL DEFAULT 'ativo',
  data_conversao TIMESTAMP,
  limite_credito NUMERIC(12, 2),
  condicao_pagamento VARCHAR(100),
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create produtos table
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  codigo_sku VARCHAR(100) NOT NULL UNIQUE,
  empresa_representada_id INTEGER NOT NULL,
  categoria VARCHAR(100),
  preco_base NUMERIC(12, 2) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create orcamentos table
CREATE TABLE IF NOT EXISTS orcamentos (
  id SERIAL PRIMARY KEY,
  numero_orcamento VARCHAR(50) NOT NULL UNIQUE,
  cliente_id INTEGER NOT NULL,
  empresa_representada_id INTEGER NOT NULL,
  representante_id INTEGER NOT NULL,
  data_orcamento TIMESTAMP NOT NULL DEFAULT NOW(),
  data_validade TIMESTAMP,
  status orcamento_status NOT NULL DEFAULT 'rascunho',
  valor_total NUMERIC(12, 2) NOT NULL,
  desconto_percentual NUMERIC(5, 2),
  desconto_valor NUMERIC(12, 2),
  valor_liquido NUMERIC(12, 2) NOT NULL,
  observacoes TEXT,
  condicoes_pagamento TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create itens_orcamento table
CREATE TABLE IF NOT EXISTS itens_orcamento (
  id SERIAL PRIMARY KEY,
  orcamento_id INTEGER NOT NULL,
  produto_id INTEGER,
  nome_produto VARCHAR(255) NOT NULL,
  descricao TEXT,
  quantidade NUMERIC(10, 2) NOT NULL,
  valor_unitario NUMERIC(12, 2) NOT NULL,
  valor_total NUMERIC(12, 2) NOT NULL,
  ordem INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create vendas table
CREATE TABLE IF NOT EXISTS vendas (
  id SERIAL PRIMARY KEY,
  numero_venda VARCHAR(50) NOT NULL UNIQUE,
  orcamento_id INTEGER,
  cliente_id INTEGER NOT NULL,
  empresa_representada_id INTEGER NOT NULL,
  representante_id INTEGER NOT NULL,
  valor_total NUMERIC(12, 2) NOT NULL,
  comissao_percentual NUMERIC(5, 2),
  comissao_valor NUMERIC(12, 2),
  data_venda TIMESTAMP NOT NULL DEFAULT NOW(),
  data_entrega_prevista TIMESTAMP,
  data_entrega_real TIMESTAMP,
  status venda_status NOT NULL DEFAULT 'pendente',
  observacoes TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create historico_leads table
CREATE TABLE IF NOT EXISTS historico_leads (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL,
  status_anterior VARCHAR(50),
  status_novo VARCHAR(50) NOT NULL,
  usuario_id INTEGER NOT NULL,
  motivo TEXT,
  data_alteracao TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_openId ON users("openId");
CREATE INDEX idx_leads_representante_id ON leads(representante_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_clientes_representante_id ON clientes(representante_id);
CREATE INDEX idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX idx_produtos_empresa_representada_id ON produtos(empresa_representada_id);
CREATE INDEX idx_orcamentos_representante_id ON orcamentos(representante_id);
CREATE INDEX idx_orcamentos_cliente_id ON orcamentos(cliente_id);
CREATE INDEX idx_vendas_representante_id ON vendas(representante_id);
CREATE INDEX idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX idx_historico_leads_lead_id ON historico_leads(lead_id);
