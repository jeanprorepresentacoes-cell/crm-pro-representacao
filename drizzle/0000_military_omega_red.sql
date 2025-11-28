CREATE TYPE "public"."cliente_status" AS ENUM('ativo', 'inativo', 'suspenso');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('indicacao', 'site', 'evento', 'cold_call', 'outro');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('novo', 'em_contato', 'qualificado', 'proposta_enviada', 'perdido', 'convertido');--> statement-breakpoint
CREATE TYPE "public"."orcamento_status" AS ENUM('rascunho', 'enviado', 'aceito', 'rejeitado', 'expirado');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'representante');--> statement-breakpoint
CREATE TYPE "public"."venda_status" AS ENUM('pendente', 'confirmada', 'entregue', 'cancelada');--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clientes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome_pessoa" varchar(255) NOT NULL,
	"nome_estabelecimento" varchar(255) NOT NULL,
	"cnpj" varchar(18),
	"cpf" varchar(14),
	"cidade" varchar(100) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	"email" varchar(320) NOT NULL,
	"endereco_completo" varchar(255) NOT NULL,
	"numero" varchar(20) NOT NULL,
	"complemento" varchar(255),
	"bairro" varchar(100) NOT NULL,
	"cep" varchar(10) NOT NULL,
	"observacoes" text,
	"lead_id" integer,
	"representante_id" integer NOT NULL,
	"status" "cliente_status" DEFAULT 'ativo' NOT NULL,
	"data_conversao" timestamp,
	"limite_credito" numeric(12, 2),
	"condicao_pagamento" varchar(100),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clientes_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "empresas_representadas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "empresas_representadas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(255) NOT NULL,
	"cnpj" varchar(18) NOT NULL,
	"logo_url" text,
	"descricao" text,
	"telefone" varchar(20),
	"email" varchar(320),
	"website" varchar(255),
	"endereco" varchar(255),
	"cidade" varchar(100),
	"estado" varchar(2),
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_por" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "empresas_representadas_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "historico_leads" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "historico_leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"lead_id" integer NOT NULL,
	"status_anterior" varchar(50),
	"status_novo" varchar(50) NOT NULL,
	"usuario_id" integer NOT NULL,
	"motivo" text,
	"data_alteracao" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "itens_orcamento" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "itens_orcamento_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"orcamento_id" integer NOT NULL,
	"produto_id" integer,
	"nome_produto" varchar(255) NOT NULL,
	"descricao" text,
	"quantidade" numeric(10, 2) NOT NULL,
	"valor_unitario" numeric(12, 2) NOT NULL,
	"valor_total" numeric(12, 2) NOT NULL,
	"ordem" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome_pessoa" varchar(255) NOT NULL,
	"nome_estabelecimento" varchar(255) NOT NULL,
	"cidade" varchar(100) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	"email" varchar(320),
	"observacoes" text,
	"status" "lead_status" DEFAULT 'novo' NOT NULL,
	"representante_id" integer NOT NULL,
	"fonte_lead" "lead_source" DEFAULT 'outro',
	"data_ultimo_contato" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orcamentos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "orcamentos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"numero_orcamento" varchar(50) NOT NULL,
	"cliente_id" integer NOT NULL,
	"empresa_representada_id" integer NOT NULL,
	"representante_id" integer NOT NULL,
	"data_orcamento" timestamp DEFAULT now() NOT NULL,
	"data_validade" timestamp,
	"status" "orcamento_status" DEFAULT 'rascunho' NOT NULL,
	"valor_total" numeric(12, 2) NOT NULL,
	"desconto_percentual" numeric(5, 2),
	"desconto_valor" numeric(12, 2),
	"valor_liquido" numeric(12, 2) NOT NULL,
	"observacoes" text,
	"condicoes_pagamento" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orcamentos_numero_orcamento_unique" UNIQUE("numero_orcamento")
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "produtos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nome" varchar(255) NOT NULL,
	"descricao" text,
	"codigo_sku" varchar(100) NOT NULL,
	"empresa_representada_id" integer NOT NULL,
	"categoria" varchar(100),
	"preco_base" numeric(12, 2) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "produtos_codigo_sku_unique" UNIQUE("codigo_sku")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"empresa_id" integer,
	"ativo" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "vendas" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vendas_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"numero_venda" varchar(50) NOT NULL,
	"orcamento_id" integer,
	"cliente_id" integer NOT NULL,
	"empresa_representada_id" integer NOT NULL,
	"representante_id" integer NOT NULL,
	"valor_total" numeric(12, 2) NOT NULL,
	"comissao_percentual" numeric(5, 2),
	"comissao_valor" numeric(12, 2),
	"data_venda" timestamp DEFAULT now() NOT NULL,
	"data_entrega_prevista" timestamp,
	"data_entrega_real" timestamp,
	"status" "venda_status" DEFAULT 'pendente' NOT NULL,
	"observacoes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendas_numero_venda_unique" UNIQUE("numero_venda")
);
