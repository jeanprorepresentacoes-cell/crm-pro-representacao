import { eq, and, or, like, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import {
  InsertUser,
  users,
  leads,
  clientes,
  orcamentos,
  vendas,
  empresasRepresentadas,
  produtos,
  itensOrcamento,
  historicoLeads,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;\nlet _pool: Pool | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _pool = new Pool({
        connectionString: process.env.DATABASE_URL,
      });
      _db = drizzle(_pool);
      console.log("[Database] Connected to Supabase PostgreSQL");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _pool = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db
      .insert(users)
      .values(values)
      .onConflict((t) => ({
        target: t.openId,
        do: db.update().set(updateSet),
      }));
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Leads queries
export async function getLeads(
  representanteId?: number,
  status?: string,
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (representanteId) {
    conditions.push(eq(leads.representanteId, representanteId));
  }

  if (status) {
    conditions.push(eq(leads.status, status as any));
  }

  if (search) {
    conditions.push(
      or(
        like(leads.nomePessoa, `%${search}%`),
        like(leads.nomeEstabelecimento, `%${search}%`)
      )
    );
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(leads)
    .where(query)
    .orderBy(desc(leads.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createLead(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(leads).values(data);
  return result;
}

export async function updateLead(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(leads).set(data).where(eq(leads.id, id));
}

export async function deleteLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(leads).where(eq(leads.id, id));
}

// Clientes queries
export async function getClientes(
  representanteId?: number,
  status?: string,
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (representanteId) {
    conditions.push(eq(clientes.representanteId, representanteId));
  }

  if (status) {
    conditions.push(eq(clientes.status, status as any));
  }

  if (search) {
    conditions.push(
      or(
        like(clientes.nomePessoa, `%${search}%`),
        like(clientes.nomeEstabelecimento, `%${search}%`),
        like(clientes.cnpj, `%${search}%`)
      )
    );
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(clientes)
    .where(query)
    .orderBy(desc(clientes.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getClienteById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(clientes)
    .where(eq(clientes.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCliente(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(clientes).values(data);
}

export async function updateCliente(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(clientes).set(data).where(eq(clientes.id, id));
}

export async function deleteCliente(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(clientes).where(eq(clientes.id, id));
}

// Empresas Representadas queries
export async function getEmpresasRepresentadas(
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(empresasRepresentadas.nome, `%${search}%`),
        like(empresasRepresentadas.cnpj, `%${search}%`)
      )
    );
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(empresasRepresentadas)
    .where(query)
    .orderBy(desc(empresasRepresentadas.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getEmpresaById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(empresasRepresentadas)
    .where(eq(empresasRepresentadas.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createEmpresa(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(empresasRepresentadas).values(data);
}

export async function updateEmpresa(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(empresasRepresentadas)
    .set(data)
    .where(eq(empresasRepresentadas.id, id));
}

export async function deleteEmpresa(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(empresasRepresentadas).where(eq(empresasRepresentadas.id, id));
}

// Produtos queries
export async function getProdutos(
  empresaId?: number,
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (empresaId) {
    conditions.push(eq(produtos.empresaRepresentadaId, empresaId));
  }

  if (search) {
    conditions.push(
      or(
        like(produtos.nome, `%${search}%`),
        like(produtos.codigoSku, `%${search}%`)
      )
    );
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(produtos)
    .where(query)
    .orderBy(desc(produtos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getProdutoById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(produtos)
    .where(eq(produtos.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProduto(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(produtos).values(data);
}

export async function updateProduto(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(produtos).set(data).where(eq(produtos.id, id));
}

export async function deleteProduto(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(produtos).where(eq(produtos.id, id));
}

// Orçamentos queries
export async function getOrcamentos(
  representanteId?: number,
  status?: string,
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (representanteId) {
    conditions.push(eq(orcamentos.representanteId, representanteId));
  }

  if (status) {
    conditions.push(eq(orcamentos.status, status as any));
  }

  if (search) {
    conditions.push(like(orcamentos.numeroOrcamento, `%${search}%`));
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(orcamentos)
    .where(query)
    .orderBy(desc(orcamentos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getOrcamentoById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(orcamentos)
    .where(eq(orcamentos.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrcamento(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(orcamentos).values(data);
}

export async function updateOrcamento(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(orcamentos).set(data).where(eq(orcamentos.id, id));
}

export async function deleteOrcamento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(orcamentos).where(eq(orcamentos.id, id));
}

// Itens Orçamento queries
export async function getItensOrcamento(orcamentoId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(itensOrcamento)
    .where(eq(itensOrcamento.orcamentoId, orcamentoId))
    .orderBy(asc(itensOrcamento.ordem));
}

export async function createItemOrcamento(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(itensOrcamento).values(data);
}

export async function deleteItemOrcamento(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(itensOrcamento).where(eq(itensOrcamento.id, id));
}

// Vendas queries
export async function getVendas(
  representanteId?: number,
  status?: string,
  search?: string,
  limit = 25,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (representanteId) {
    conditions.push(eq(vendas.representanteId, representanteId));
  }

  if (status) {
    conditions.push(eq(vendas.status, status as any));
  }

  if (search) {
    conditions.push(like(vendas.numeroVenda, `%${search}%`));
  }

  const query = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(vendas)
    .where(query)
    .orderBy(desc(vendas.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getVendaById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(vendas)
    .where(eq(vendas.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createVenda(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(vendas).values(data);
}

export async function updateVenda(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(vendas).set(data).where(eq(vendas.id, id));
}

export async function deleteVenda(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(vendas).where(eq(vendas.id, id));
}

// Histórico Leads queries
export async function createHistoricoLead(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(historicoLeads).values(data);
}

export async function getHistoricoLeads(leadId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(historicoLeads)
    .where(eq(historicoLeads.leadId, leadId))
    .orderBy(desc(historicoLeads.dataAlteracao));
}
