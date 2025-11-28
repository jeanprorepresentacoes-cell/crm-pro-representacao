import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
  boolean,
} from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Enums para PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin", "representante"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "novo",
  "em_contato",
  "qualificado",
  "proposta_enviada",
  "perdido",
  "convertido",
]);
export const leadSourceEnum = pgEnum("lead_source", [
  "indicacao",
  "site",
  "evento",
  "cold_call",
  "outro",
]);
export const clienteStatusEnum = pgEnum("cliente_status", [
  "ativo",
  "inativo",
  "suspenso",
]);
export const orcamentoStatusEnum = pgEnum("orcamento_status", [
  "rascunho",
  "enviado",
  "aceito",
  "rejeitado",
  "expirado",
]);
export const vendaStatusEnum = pgEnum("venda_status", [
  "pendente",
  "confirmada",
  "entregue",
  "cancelada",
]);

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  empresaId: integer("empresa_id"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const empresasRepresentadas = pgTable("empresas_representadas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  logoUrl: text("logo_url"),
  descricao: text("descricao"),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 255 }),
  endereco: varchar("endereco", { length: 255 }),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  ativo: boolean("ativo").default(true).notNull(),
  criadoPor: integer("criado_por").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nomePessoa: varchar("nome_pessoa", { length: 255 }).notNull(),
  nomeEstabelecimento: varchar("nome_estabelecimento", { length: 255 }).notNull(),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  observacoes: text("observacoes"),
  status: leadStatusEnum("status").default("novo").notNull(),
  representanteId: integer("representante_id").notNull(),
  fonteLead: leadSourceEnum("fonte_lead").default("outro"),
  dataUltimoContato: timestamp("data_ultimo_contato"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const clientes = pgTable("clientes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nomePessoa: varchar("nome_pessoa", { length: 255 }).notNull(),
  nomeEstabelecimento: varchar("nome_estabelecimento", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).unique(),
  cpf: varchar("cpf", { length: 14 }),
  cidade: varchar("cidade", { length: 100 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  enderecCompleto: varchar("endereco_completo", { length: 255 }).notNull(),
  numero: varchar("numero", { length: 20 }).notNull(),
  complemento: varchar("complemento", { length: 255 }),
  bairro: varchar("bairro", { length: 100 }).notNull(),
  cep: varchar("cep", { length: 10 }).notNull(),
  observacoes: text("observacoes"),
  leadId: integer("lead_id"),
  representanteId: integer("representante_id").notNull(),
  status: clienteStatusEnum("status").default("ativo").notNull(),
  dataConversao: timestamp("data_conversao"),
  limiteCredito: numeric("limite_credito", { precision: 12, scale: 2 }),
  condicaoPagamento: varchar("condicao_pagamento", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const produtos = pgTable("produtos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  codigoSku: varchar("codigo_sku", { length: 100 }).notNull().unique(),
  empresaRepresentadaId: integer("empresa_representada_id").notNull(),
  categoria: varchar("categoria", { length: 100 }),
  precoBase: numeric("preco_base", { precision: 12, scale: 2 }).notNull(),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const orcamentos = pgTable("orcamentos", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  numeroOrcamento: varchar("numero_orcamento", { length: 50 }).notNull().unique(),
  clienteId: integer("cliente_id").notNull(),
  empresaRepresentadaId: integer("empresa_representada_id").notNull(),
  representanteId: integer("representante_id").notNull(),
  dataOrcamento: timestamp("data_orcamento").defaultNow().notNull(),
  dataValidade: timestamp("data_validade"),
  status: orcamentoStatusEnum("status").default("rascunho").notNull(),
  valorTotal: numeric("valor_total", { precision: 12, scale: 2 }).notNull(),
  descontoPercentual: numeric("desconto_percentual", { precision: 5, scale: 2 }),
  descontoValor: numeric("desconto_valor", { precision: 12, scale: 2 }),
  valorLiquido: numeric("valor_liquido", { precision: 12, scale: 2 }).notNull(),
  observacoes: text("observacoes"),
  condicoesPagamento: text("condicoes_pagamento"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const itensOrcamento = pgTable("itens_orcamento", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orcamentoId: integer("orcamento_id").notNull(),
  produtoId: integer("produto_id"),
  nomeProduto: varchar("nome_produto", { length: 255 }).notNull(),
  descricao: text("descricao"),
  quantidade: numeric("quantidade", { precision: 10, scale: 2 }).notNull(),
  valorUnitario: numeric("valor_unitario", { precision: 12, scale: 2 }).notNull(),
  valorTotal: numeric("valor_total", { precision: 12, scale: 2 }).notNull(),
  ordem: integer("ordem").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vendas = pgTable("vendas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  numeroVenda: varchar("numero_venda", { length: 50 }).notNull().unique(),
  orcamentoId: integer("orcamento_id"),
  clienteId: integer("cliente_id").notNull(),
  empresaRepresentadaId: integer("empresa_representada_id").notNull(),
  representanteId: integer("representante_id").notNull(),
  valorTotal: numeric("valor_total", { precision: 12, scale: 2 }).notNull(),
  comissaoPercentual: numeric("comissao_percentual", { precision: 5, scale: 2 }),
  comissaoValor: numeric("comissao_valor", { precision: 12, scale: 2 }),
  dataVenda: timestamp("data_venda").defaultNow().notNull(),
  dataEntregaPrevista: timestamp("data_entrega_prevista"),
  dataEntregaReal: timestamp("data_entrega_real"),
  status: vendaStatusEnum("status").default("pendente").notNull(),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const historicoLeads = pgTable("historico_leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  leadId: integer("lead_id").notNull(),
  statusAnterior: varchar("status_anterior", { length: 50 }),
  statusNovo: varchar("status_novo", { length: 50 }).notNull(),
  usuarioId: integer("usuario_id").notNull(),
  motivo: text("motivo"),
  dataAlteracao: timestamp("data_alteracao").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type EmpresaRepresentada = typeof empresasRepresentadas.$inferSelect;
export type InsertEmpresaRepresentada =
  typeof empresasRepresentadas.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

export type Produto = typeof produtos.$inferSelect;
export type InsertProduto = typeof produtos.$inferInsert;

export type Orcamento = typeof orcamentos.$inferSelect;
export type InsertOrcamento = typeof orcamentos.$inferInsert;

export type ItemOrcamento = typeof itensOrcamento.$inferSelect;
export type InsertItemOrcamento = typeof itensOrcamento.$inferInsert;

export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = typeof vendas.$inferInsert;

export type HistoricoLead = typeof historicoLeads.$inferSelect;
export type InsertHistoricoLead = typeof historicoLeads.$inferInsert;
