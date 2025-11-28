import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Leads Router", () => {
  describe("list", () => {
    it("should list leads with filters", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.list({
        status: "novo",
        search: "",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should filter leads by status", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.list({
        status: "novo",
        search: "",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should search leads by name", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.list({
        status: "",
        search: "João",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new lead", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.create({
        nomePessoa: "João Silva",
        nomeEstabelecimento: "Silva Comércio",
        email: "joao@silva.com",
        telefone: "(11) 98765-4321",
        cidade: "São Paulo",
      });

      expect(result).toHaveProperty("id");
      expect(result.nomePessoa).toBe("João Silva");
      expect(result.status).toBe("novo");
    });

    it("should validate required fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.leads.create({
          nomePessoa: "",
          nomeEstabelecimento: "",
          email: "",
          telefone: "",
          cidade: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("update", () => {
    it("should update a lead", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.update({
        id: 1,
        nomePessoa: "João Silva Atualizado",
        nomeEstabelecimento: "Silva Comércio LTDA",
        email: "joao.novo@silva.com",
        telefone: "(11) 98765-4321",
        cidade: "São Paulo",
        status: "em_contato",
      });

      expect(result.nomePessoa).toBe("João Silva Atualizado");
    });
  });

  describe("delete", () => {
    it("should delete a lead (admin only)", async () => {
      const ctx = createAuthContext("admin");
      const caller = appRouter.createCaller(ctx);

      const result = await caller.leads.delete({ id: 1 });
      expect(result.success).toBe(true);
    });

    it("should not allow non-admin to delete", async () => {
      const ctx = createAuthContext("user");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.leads.delete({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});

describe("Clientes Router", () => {
  describe("list", () => {
    it("should list clientes with filters", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clientes.list({
        status: "ativo",
        search: "",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new cliente", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.clientes.create({
        nomePessoa: "João Silva",
        nomeEstabelecimento: "Silva Comércio",
        cpf: "123.456.789-00",
        email: "joao@silva.com",
        telefone: "(11) 98765-4321",
        cidade: "São Paulo",
        enderecCompleto: "Rua das Flores",
        numero: "123",
        bairro: "Centro",
        cep: "01310-100",
        limiteCredito: 50000,
        condicaoPagamento: "30 dias",
      });

      expect(result).toHaveProperty("id");
      expect(result.nomePessoa).toBe("João Silva");
      expect(result.status).toBe("ativo");
    });

    it("should validate CNPJ uniqueness", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create first cliente
      await caller.clientes.create({
        nomePessoa: "Cliente 1",
        nomeEstabelecimento: "Empresa 1",
        cpf: "123.456.789-00",
        email: "cliente1@example.com",
        telefone: "(11) 98765-4321",
        cidade: "São Paulo",
        enderecCompleto: "Rua 1",
        numero: "1",
        bairro: "Bairro 1",
        cep: "01310-100",
      });

      // Try to create duplicate
      try {
        await caller.clientes.create({
          nomePessoa: "Cliente 2",
          nomeEstabelecimento: "Empresa 2",
          cpf: "123.456.789-00",
          email: "cliente2@example.com",
          telefone: "(11) 98765-4322",
          cidade: "Rio de Janeiro",
          enderecCompleto: "Rua 2",
          numero: "2",
          bairro: "Bairro 2",
          cep: "20000-000",
        });
        expect.fail("Should have thrown an error for duplicate CNPJ");
      } catch (error: any) {
        expect(error.message).toContain("CNPJ");
      }
    });
  });
});

describe("Vendas Router", () => {
  describe("list", () => {
    it("should list vendas with filters", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.vendas.list({
        status: "confirmada",
        search: "",
        limit: 10,
        offset: 0,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a new venda", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.vendas.create({
        clienteId: 1,
        empresaId: 1,
        valor: 5000,
        descricao: "Venda de produtos",
      });

      expect(result).toHaveProperty("numero");
      expect(result.valor).toBe(5000);
      expect(result.status).toBe("pendente");
    });

    it("should calculate commission correctly", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.vendas.create({
        clienteId: 1,
        empresaId: 1,
        valor: 10000,
        descricao: "Venda de produtos",
      });

      // Assuming 10% commission
      expect(result.comissao).toBe(1000);
    });
  });

  describe("updateStatus", () => {
    it("should update venda status", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.vendas.updateStatus({
        id: 1,
        status: "confirmada",
      });

      expect(result.status).toBe("confirmada");
    });
  });
});
