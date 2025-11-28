/**
 * Script de teste de conexão com o banco de dados Supabase
 * Execute com: npx tsx server/test-db-connection.ts
 */

import { getDb } from "./db";
import { users } from "../drizzle/schema";

async function testConnection() {
  console.log("🔍 Testando conexão com Supabase PostgreSQL...\n");

  try {
    // Teste 1: Conectar ao banco de dados
    console.log("1️⃣  Tentando conectar ao banco de dados...");
    const db = await getDb();

    if (!db) {
      console.error("❌ Falha ao conectar ao banco de dados");
      console.error("   Verifique se DATABASE_URL está configurado em .env");
      process.exit(1);
    }

    console.log("✅ Conexão estabelecida com sucesso!\n");

    // Teste 2: Verificar se a tabela users existe
    console.log("2️⃣  Verificando se a tabela 'users' existe...");
    try {
      const result = await db.select().from(users).limit(1);
      console.log("✅ Tabela 'users' encontrada!\n");
    } catch (error: any) {
      if (error.message.includes("does not exist")) {
        console.error(
          "❌ Tabela 'users' não encontrada. Execute a migração primeiro."
        );
        console.error("   Execute: pnpm run db:push\n");
        process.exit(1);
      }
      throw error;
    }

    // Teste 3: Informações do banco de dados
    console.log("3️⃣  Obtendo informações do banco de dados...");
    const versionResult = await db.execute(
      "SELECT version() as version"
    );
    console.log("✅ Versão do PostgreSQL:", (versionResult as any)[0]?.version);

    // Teste 4: Listar tabelas
    console.log("\n4️⃣  Listando tabelas criadas...");
    const tablesResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tables = (tablesResult as any).map((row: any) => row.table_name);
    if (tables.length > 0) {
      console.log("✅ Tabelas encontradas:");
      tables.forEach((table: string) => {
        console.log(`   - ${table}`);
      });
    } else {
      console.warn(
        "⚠️  Nenhuma tabela encontrada. Execute a migração primeiro."
      );
    }

    // Teste 5: Verificar enums
    console.log("\n5️⃣  Verificando tipos ENUM...");
    const enumsResult = await db.execute(`
      SELECT t.typname as enum_name
      FROM pg_type t
      WHERE t.typtype = 'e'
      ORDER BY t.typname
    `);

    const enums = (enumsResult as any).map((row: any) => row.enum_name);
    if (enums.length > 0) {
      console.log("✅ Enums encontrados:");
      enums.forEach((enumType: string) => {
        console.log(`   - ${enumType}`);
      });
    } else {
      console.warn("⚠️  Nenhum enum encontrado.");
    }

    console.log("\n✨ Todos os testes passaram com sucesso!");
    console.log("\n📝 Próximos passos:");
    console.log("   1. Inicie o servidor: pnpm run dev");
    console.log("   2. Teste as rotas da API");
    console.log("   3. Verifique os logs de conexão\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro durante o teste:\n");
    console.error(error);
    process.exit(1);
  }
}

testConnection();
