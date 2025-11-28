import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getEmpresasRepresentadas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
  getProdutos,
  getProdutoById,
  createProduto,
  updateProduto,
  deleteProduto,
  getOrcamentos,
  getOrcamentoById,
  createOrcamento,
  updateOrcamento,
  deleteOrcamento,
  getItensOrcamento,
  createItemOrcamento,
  deleteItemOrcamento,
  getVendas,
  getVendaById,
  createVenda,
  updateVenda,
  deleteVenda,
  createHistoricoLead,
  getHistoricoLeads,
} from "./db";

// Validação schemas
const leadSchema = z.object({
  nomePessoa: z.string().min(1),
  nomeEstabelecimento: z.string().min(1),
  cidade: z.string().min(1),
  telefone: z.string().min(1),
  email: z.string().email().optional(),
  observacoes: z.string().optional(),
  fonteLead: z.enum(["indicacao", "site", "evento", "cold_call", "outro"]).optional(),
  dataUltimoContato: z.string().optional(), // <-- LINHA CORRIGIDA
  status: z.enum(["novo", "em_contato", "qualificado", "proposta_enviada", "perdido", "convertido"]).optional(),
});

const clienteSchema = z.object({
  nomePessoa: z.string().min(1),
  nomeEstabelecimento: z.string().min(1),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  cidade: z.string().min(1),
  telefone: z.string().min(1),
  email: z.string().email(),
  enderecCompleto: z.string().min(1),
  numero: z.string().min(1),
  complemento: z.string().optional(),
  bairro: z.string().min(1),
  cep: z.string().min(1),
  observacoes: z.string().optional(),
  status: z.enum(["ativo", "inativo", "suspenso"]).optional(),
  limiteCredito: z.number().optional(),
  condicaoPagamento: z.string().optional(),
});

const empresaSchema = z.object({
  nome: z.string().min(1),
  cnpj: z.string().min(1),
  logoUrl: z.string().optional(),
  descricao: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  ativo: z.boolean().optional(),
});

const produtoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
  codigoSku: z.string().min(1),
  empresaRepresentadaId: z.number(),
  categoria: z.string().optional(),
  precoBase: z.number().min(0),
  ativo: z.boolean().optional(),
});

const orcamentoSchema = z.object({
  clienteId: z.number(),
  empresaRepresentadaId: z.number(),
  dataValidade: z.date().optional(),
  status: z.enum(["rascunho", "enviado", "aceito", "rejeitado", "expirado"]).optional(),
  descontoPercentual: z.number().optional(),
  descontoValor: z.number().optional(),
  observacoes: z.string().optional(),
  condicoesPagamento: z.string().optional(),
  itens: z.array(z.object({
    nomeProduto: z.string(),
    descricao: z.string().optional(),
    quantidade: z.number().min(1),
    valorUnitario: z.number().min(0),
    ordem: z.number(),
  })),
});

const vendaSchema = z.object({
  clienteId: z.number(),
  empresaRepresentadaId: z.number(),
  valorTotal: z.number().min(0),
  comissaoPercentual: z.number().optional(),
  dataEntregaPrevista: z.date().optional(),
  status: z.enum(["pendente", "confirmada", "entregue", "cancelada"]).optional(),
  observacoes: z.string().optional(),
});

// Criar um procedimento para admin apenas
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin only");
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Leads
  leads: router({
    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        const representanteId = ctx.user?.role === "admin" ? undefined : ctx.user?.id;
        return getLeads(representanteId, input.status, input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getLeadById(input.id);
      }),

    create: protectedProcedure
      .input(leadSchema)
      .mutation(async ({ input, ctx }) => {
        const data = {
          ...input,
          representanteId: ctx.user?.id,
          status: "novo",
        };
        return createLead(data);
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: leadSchema.partial() }))
      .mutation(async ({ input, ctx }) => {
        const lead = await getLeadById(input.id);
        if (!lead) throw new Error("Lead not found");
        if (lead.representanteId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const oldStatus = lead.status;
        const newStatus = input.data.status || oldStatus;

        if (oldStatus !== newStatus) {
          await createHistoricoLead({
            leadId: input.id,
            statusAnterior: oldStatus,
            statusNovo: newStatus,
            usuarioId: ctx.user?.id,
            motivo: "Status atualizado",
          });
        }

        return updateLead(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteLead(input.id);
      }),
  }),

  // Clientes
  clientes: router({
    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        const representanteId = ctx.user?.role === "admin" ? undefined : ctx.user?.id;
        return getClientes(representanteId, input.status, input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getClienteById(input.id);
      }),

    create: protectedProcedure
      .input(clienteSchema)
      .mutation(async ({ input, ctx }) => {
        const data = {
          ...input,
          representanteId: ctx.user?.id,
          status: "ativo",
          dataConversao: new Date(),
        };
        return createCliente(data);
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: clienteSchema.partial() }))
      .mutation(async ({ input, ctx }) => {
        const cliente = await getClienteById(input.id);
        if (!cliente) throw new Error("Cliente not found");
        if (cliente.representanteId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return updateCliente(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteCliente(input.id);
      }),
  }),

  // Empresas Representadas
  empresas: router({
    list: protectedProcedure
      .input(
        z.object({
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getEmpresasRepresentadas(input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getEmpresaById(input.id);
      }),

    create: adminProcedure
      .input(empresaSchema)
      .mutation(async ({ input, ctx }) => {
        const data = {
          ...input,
          criadoPor: ctx.user?.id,
          ativo: true,
        };
        return createEmpresa(data);
      }),

    update: adminProcedure
      .input(z.object({ id: z.number(), data: empresaSchema.partial() }))
      .mutation(async ({ input }) => {
        return updateEmpresa(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteEmpresa(input.id);
      }),
  }),

  // Produtos
  produtos: router({
    list: protectedProcedure
      .input(
        z.object({
          empresaId: z.number().optional(),
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getProdutos(input.empresaId, input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProdutoById(input.id);
      }),

    create: adminProcedure
      .input(produtoSchema)
      .mutation(async ({ input }) => {
        return createProduto(input);
      }),

    update: adminProcedure
      .input(z.object({ id: z.number(), data: produtoSchema.partial() }))
      .mutation(async ({ input }) => {
        return updateProduto(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteProduto(input.id);
      }),
  }),

  // Orçamentos
  orcamentos: router({
    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        const representanteId = ctx.user?.role === "admin" ? undefined : ctx.user?.id;
        return getOrcamentos(representanteId, input.status, input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const orcamento = await getOrcamentoById(input.id);
        if (!orcamento) return null;
        const itens = await getItensOrcamento(input.id);
        return { ...orcamento, itens };
      }),

    create: protectedProcedure
      .input(orcamentoSchema)
      .mutation(async ({ input, ctx }) => {
        const numeroOrcamento = `ORC-${Date.now()}`;
        let totalLiquido = 0;

        // Calcular total
        for (const item of input.itens) {
          totalLiquido += item.quantidade * item.valorUnitario;
        }

        // Aplicar desconto
        if (input.descontoPercentual) {
          totalLiquido = totalLiquido * (1 - input.descontoPercentual / 100);
        } else if (input.descontoValor) {
          totalLiquido -= input.descontoValor;
        }

        const orcamento = await createOrcamento({
          numeroOrcamento,
          clienteId: input.clienteId,
          empresaRepresentadaId: input.empresaRepresentadaId,
          representanteId: ctx.user?.id,
          dataOrcamento: new Date(),
          dataValidade: input.dataValidade,
          status: "rascunho",
          valorTotal: totalLiquido,
          descontoPercentual: input.descontoPercentual,
          descontoValor: input.descontoValor,
          valorLiquido: totalLiquido,
          observacoes: input.observacoes,
          condicoesPagamento: input.condicoesPagamento,
        });

        // Criar itens
        const orcamentoId = (orcamento as any).insertId || 1;
        for (const item of input.itens) {
          await createItemOrcamento({
            orcamentoId,
            nomeProduto: item.nomeProduto,
            descricao: item.descricao,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
            valorTotal: item.quantidade * item.valorUnitario,
            ordem: item.ordem,
          });
        }

        return orcamento;
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: orcamentoSchema.partial() }))
      .mutation(async ({ input, ctx }) => {
        const orcamento = await getOrcamentoById(input.id);
        if (!orcamento) throw new Error("Orçamento not found");
        if (orcamento.representanteId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return updateOrcamento(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const orcamento = await getOrcamentoById(input.id);
        if (!orcamento) throw new Error("Orçamento not found");
        if (orcamento.representanteId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return deleteOrcamento(input.id);
      }),
  }),

  // Vendas
  vendas: router({
    list: protectedProcedure
      .input(
        z.object({
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().default(25),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        const representanteId = ctx.user?.role === "admin" ? undefined : ctx.user?.id;
        return getVendas(representanteId, input.status, input.search, input.limit, input.offset);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getVendaById(input.id);
      }),

    create: protectedProcedure
      .input(vendaSchema)
      .mutation(async ({ input, ctx }) => {
        const numeroVenda = `VND-${Date.now()}`;
        const comissaoValor = input.comissaoPercentual
          ? (input.valorTotal * input.comissaoPercentual) / 100
          : 0;

        const data = {
          numeroVenda,
          clienteId: input.clienteId,
          empresaRepresentadaId: input.empresaRepresentadaId,
          representanteId: ctx.user?.id,
          valorTotal: input.valorTotal,
          comissaoPercentual: input.comissaoPercentual,
          comissaoValor,
          dataVenda: new Date(),
          dataEntregaPrevista: input.dataEntregaPrevista,
          status: input.status || "pendente",
          observacoes: input.observacoes,
        };

        return createVenda(data);
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), data: vendaSchema.partial() }))
      .mutation(async ({ input, ctx }) => {
        const venda = await getVendaById(input.id);
        if (!venda) throw new Error("Venda not found");
        if (venda.representanteId !== ctx.user?.id && ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return updateVenda(input.id, input.data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return deleteVenda(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
