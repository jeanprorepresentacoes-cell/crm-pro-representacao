# Guia de Migração para Supabase PostgreSQL

Este guia orienta você sobre como completar a integração do projeto **crm_pro_representacoes** com o Supabase PostgreSQL.

## Alterações Realizadas

### 1. **Schema do Drizzle (drizzle/schema.ts)**
- Convertido de MySQL para PostgreSQL
- Substituído `mysqlTable` por `pgTable`
- Substituído `mysqlEnum` por `pgEnum`
- Alterado `int().autoincrement()` para `integer().generatedAlwaysAsIdentity()`
- Alterado `decimal` para `numeric` (tipo nativo do PostgreSQL)
- Removido `.onUpdateNow()` (não suportado em PostgreSQL)

### 2. **Configuração do Drizzle (drizzle.config.ts)**
- Alterado `dialect` para `"postgresql"`
- Mantida a `DATABASE_URL` do Supabase

### 3. **Conexão com Banco de Dados (server/db.ts)**
- Importação de `Pool` do pacote `pg`
- Alterado `onDuplicateKeyUpdate()` para `onConflict()` (sintaxe PostgreSQL)
- Adicionado log de conexão bem-sucedida

### 4. **Variáveis de Ambiente (server/_core/env.ts)**
- Adicionadas `supabaseUrl` e `supabaseAnonKey`

### 5. **Cliente Supabase (server/_core/supabase.ts)**
- Criado cliente Supabase para operações de servidor

### 6. **Dependências (package.json)**
- Adicionado `pg` (driver PostgreSQL)
- Adicionado `@supabase/supabase-js` (cliente Supabase)
- Alterado `drizzle-orm/mysql-core` para `drizzle-orm/pg-core`

## Próximos Passos

### Passo 1: Instalar Dependências
```bash
cd /home/ubuntu/crm_pro_representacoes
pnpm install
```

### Passo 2: Executar a Migração no Supabase

Você tem duas opções:

#### Opção A: Usar o Drizzle Kit (Recomendado)
```bash
# Gerar nova migração (se necessário)
pnpm run db:push
```

#### Opção B: Executar SQL Manualmente no Supabase

1. Acesse o **Supabase Dashboard**: https://app.supabase.com
2. Navegue até seu projeto **crm_pro_representacoes**
3. Vá para **SQL Editor** (no menu lateral esquerdo)
4. Crie uma nova query
5. Copie e cole o conteúdo do arquivo `drizzle/0002_migrate_to_postgresql.sql`
6. Execute a query

**Ou**, execute o arquivo SQL diretamente via linha de comando:
```bash
psql -h db.uoyoeibvyjtuiilggaet.supabase.co -U postgres -d postgres -f drizzle/0002_migrate_to_postgresql.sql
```

Quando solicitado, digite a senha: `@Candeias123`

### Passo 3: Verificar a Conexão

Teste a conexão com o banco de dados:
```bash
# Inicie o servidor de desenvolvimento
pnpm run dev
```

Você deve ver a mensagem no console:
```
[Database] Connected to Supabase PostgreSQL
```

### Passo 4: Executar Testes (Opcional)

```bash
pnpm run test
```

## Estrutura de Dados

O projeto agora utiliza as seguintes tabelas PostgreSQL:

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema (representantes, admins) |
| `empresas_representadas` | Empresas que o representante trabalha |
| `leads` | Leads/prospects em potencial |
| `clientes` | Clientes convertidos |
| `produtos` | Produtos das empresas representadas |
| `orcamentos` | Orçamentos enviados aos clientes |
| `itens_orcamento` | Itens individuais de cada orçamento |
| `vendas` | Vendas realizadas |
| `historico_leads` | Histórico de mudanças de status dos leads |

## Enums (Tipos Customizados)

O PostgreSQL utiliza tipos ENUM para melhor integridade de dados:

- **role**: `user`, `admin`, `representante`
- **lead_status**: `novo`, `em_contato`, `qualificado`, `proposta_enviada`, `perdido`, `convertido`
- **lead_source**: `indicacao`, `site`, `evento`, `cold_call`, `outro`
- **cliente_status**: `ativo`, `inativo`, `suspenso`
- **orcamento_status**: `rascunho`, `enviado`, `aceito`, `rejeitado`, `expirado`
- **venda_status**: `pendente`, `confirmada`, `entregue`, `cancelada`

## Troubleshooting

### Erro: "DATABASE_URL is required"
Certifique-se de que o arquivo `.env` está na raiz do projeto com:
```
DATABASE_URL="postgresql://postgres:@Candeias123@db.uoyoeibvyjtuiilggaet.supabase.co:5432/postgres"
```

### Erro: "Failed to connect to database"
1. Verifique se a senha está correta
2. Verifique se o Supabase está online
3. Verifique se o firewall permite conexões (Supabase permite por padrão)

### Erro: "relation does not exist"
Execute novamente a migração SQL para garantir que todas as tabelas foram criadas.

### Erro: "enum type already exists"
Se receber este erro ao executar a migração, as ENUMs já foram criadas. Você pode ignorar este erro ou executar apenas a parte de criação de tabelas.

## Variáveis de Ambiente Necessárias

```env
# Banco de dados PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres:@Candeias123@db.uoyoeibvyjtuiilggaet.supabase.co:5432/postgres"

# Cliente Supabase
VITE_SUPABASE_URL="https://uoyoeibvyjtuiilggaet.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVveW9laWJ2eWp0dWlpbGdnYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzM0MTksImV4cCI6MjA3OTkwOTQxOX0.bV475SoHDsG5Wsfjjfn8S1Nq0lB2Y2DCZvU8msF3i-I"

# Outras variáveis existentes
VITE_APP_ID="seu_app_id"
JWT_SECRET="sua_chave_secreta_jwt"
OAUTH_SERVER_URL="sua_url_oauth"
OWNER_OPEN_ID="seu_owner_open_id"
```

## Próximas Etapas Recomendadas

1. **Testar a conexão** com o banco de dados
2. **Criar um usuário de teste** para validar o fluxo de autenticação
3. **Implementar RLS (Row Level Security)** no Supabase para segurança
4. **Configurar backups** automáticos no Supabase
5. **Implementar logs** de auditoria para rastreabilidade

## Documentação Útil

- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Suporte

Se encontrar problemas durante a migração, verifique:
1. O arquivo `.env` está configurado corretamente
2. As credenciais do Supabase estão corretas
3. O Supabase está acessível (verifique em https://app.supabase.com)
4. As tabelas foram criadas (verifique em Supabase Dashboard > Table Editor)

---

**Data de Atualização**: 28 de Novembro de 2025
**Versão**: 1.0.0
