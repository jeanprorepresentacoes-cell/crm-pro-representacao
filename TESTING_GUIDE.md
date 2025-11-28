# Guia de Testes Iniciais - CRM Pro Representações

Este guia fornece instruções passo a passo para testar a integração com o Supabase PostgreSQL.

## Pré-requisitos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Arquivo `.env` configurado com credenciais do Supabase
- Migração do banco de dados executada

## Teste 1: Verificar Conexão com o Banco de Dados

### Executar o Script de Teste

```bash
cd /home/ubuntu/crm_pro_representacoes
npx tsx server/test-db-connection.ts
```

### Resultado Esperado

```
🔍 Testando conexão com Supabase PostgreSQL...

1️⃣  Tentando conectar ao banco de dados...
✅ Conexão estabelecida com sucesso!

2️⃣  Verificando se a tabela 'users' existe...
✅ Tabela 'users' encontrada!

3️⃣  Obtendo informações do banco de dados...
✅ Versão do PostgreSQL: PostgreSQL 15.1 on x86_64-pc-linux-gnu...

4️⃣  Listando tabelas criadas...
✅ Tabelas encontradas:
   - clientes
   - empresas_representadas
   - historico_leads
   - itens_orcamento
   - leads
   - orcamentos
   - produtos
   - users
   - vendas

5️⃣  Verificando tipos ENUM...
✅ Enums encontrados:
   - cliente_status
   - lead_source
   - lead_status
   - orcamento_status
   - role
   - venda_status

✨ Todos os testes passaram com sucesso!
```

### Solução de Problemas

| Erro | Solução |
|------|---------|
| `DATABASE_URL is required` | Verifique se `.env` está na raiz do projeto |
| `Failed to connect to database` | Verifique credenciais e se Supabase está online |
| `Table 'users' does not exist` | Execute a migração: `pnpm run db:push` |

## Teste 2: Iniciar o Servidor de Desenvolvimento

### Executar o Servidor

```bash
pnpm install  # Instalar dependências se ainda não fez
pnpm run dev
```

### Resultado Esperado

```
  VITE v7.1.7  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help

[Database] Connected to Supabase PostgreSQL
```

### Verificar Logs

Abra o navegador em `http://localhost:5173` e verifique:
1. A aplicação carrega sem erros
2. O console do servidor mostra `[Database] Connected to Supabase PostgreSQL`

## Teste 3: Testar Operações CRUD

### Criar um Usuário de Teste

```typescript
// Exemplo de teste manual (adicione ao seu código)
import { upsertUser } from "./server/db";

const testUser = {
  openId: "test-user-001",
  name: "Usuário Teste",
  email: "teste@example.com",
  loginMethod: "oauth",
  role: "representante" as const,
};

await upsertUser(testUser);
console.log("✅ Usuário criado com sucesso!");
```

### Verificar no Supabase

1. Acesse https://app.supabase.com
2. Navegue até seu projeto
3. Vá para **Table Editor**
4. Selecione a tabela **users**
5. Verifique se o usuário foi criado

## Teste 4: Executar Testes Automatizados

```bash
pnpm run test
```

### Resultado Esperado

```
✓ server/leads.test.ts (2)
  ✓ should create a lead
  ✓ should get leads

✓ server/auth.logout.test.ts (1)
  ✓ should logout user

Test Files  2 passed (2)
     Tests  3 passed (3)
```

## Teste 5: Verificar Integridade de Dados

### Validar Constraints

```sql
-- Execute no Supabase SQL Editor

-- Verificar chaves primárias
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'PRIMARY KEY'
ORDER BY table_name;

-- Verificar chaves únicas
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'UNIQUE'
ORDER BY table_name;

-- Verificar índices
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

## Teste 6: Testar Operações Comuns

### Inserir um Lead

```bash
curl -X POST http://localhost:5173/api/trpc/leads.create \
  -H "Content-Type: application/json" \
  -d '{
    "nomePessoa": "João Silva",
    "nomeEstabelecimento": "Comércio Silva",
    "cidade": "São Paulo",
    "telefone": "11999999999",
    "email": "joao@example.com",
    "representanteId": 1
  }'
```

### Listar Leads

```bash
curl http://localhost:5173/api/trpc/leads.list
```

### Atualizar um Lead

```bash
curl -X PUT http://localhost:5173/api/trpc/leads.update \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "status": "em_contato"
  }'
```

## Teste 7: Verificar Performance

### Monitorar Conexões

```sql
-- Verificar conexões ativas
SELECT pid, usename, application_name, state
FROM pg_stat_activity
WHERE datname = 'postgres'
ORDER BY pid;

-- Verificar tamanho das tabelas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Checklist de Validação

- [ ] Conexão com Supabase estabelecida
- [ ] Todas as tabelas criadas
- [ ] Todos os enums criados
- [ ] Índices criados para melhor performance
- [ ] Servidor inicia sem erros
- [ ] Operações CRUD funcionam
- [ ] Testes automatizados passam
- [ ] Logs de conexão aparecem no console
- [ ] Dados persistem após reiniciar o servidor
- [ ] Sem erros de validação de tipos

## Próximas Etapas

1. **Implementar Row Level Security (RLS)**
   - Proteger dados por usuário
   - Implementar políticas de acesso

2. **Configurar Backups**
   - Ativar backups automáticos no Supabase
   - Testar restauração de backups

3. **Implementar Auditoria**
   - Rastrear mudanças em dados críticos
   - Manter histórico de operações

4. **Otimizar Queries**
   - Analisar planos de execução
   - Adicionar índices conforme necessário

5. **Configurar Monitoramento**
   - Alertas de performance
   - Rastreamento de erros

## Documentação de Referência

- [Supabase PostgreSQL Guide](https://supabase.com/docs/guides/database)
- [Drizzle ORM Testing](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html)

---

**Última atualização**: 28 de Novembro de 2025
**Versão**: 1.0.0
