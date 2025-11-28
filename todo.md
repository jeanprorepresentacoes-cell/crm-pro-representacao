# CRM Pro Representações - TODO

## Fase 1: Estrutura do Banco de Dados

- [x] Criar tabela `users` com roles (admin, representante)
- [x] Criar tabela `empresas_representadas` com informações de empresas
- [x] Criar tabela `leads` com status e campos de contato
- [x] Criar tabela `clientes` com informações completas de clientes
- [x] Criar tabela `produtos` com SKU e preços
- [x] Criar tabela `orcamentos` com itens e cálculos
- [x] Criar tabela `itens_orcamento` para linhas de orçamento
- [x] Criar tabela `vendas` com comissões e status
- [x] Criar tabela `historico_leads` para auditoria
- [x] Executar migrações do banco de dados

## Fase 2: Backend - Procedimentos tRPC

### Leads
- [x] Listar leads com filtros (status, cidade, data, representante)
- [x] Criar novo lead com validações
- [x] Editar lead existente
- [x] Deletar lead (apenas admin)
- [x] Transformar lead em cliente
- [x] Registrar histórico de alterações

### Clientes
- [x] Listar clientes com filtros (status, cidade, data, representante)
- [x] Visualizar detalhes do cliente
- [x] Criar cliente (a partir de lead ou manual)
- [x] Editar cliente
- [x] Deletar cliente (apenas admin)
- [x] Buscar clientes por nome, CNPJ ou estabelecimento

### Empresas Representadas
- [x] Listar empresas representadas
- [x] Criar empresa representada com upload de logo
- [x] Editar empresa representada
- [x] Deletar empresa representada (apenas admin, se sem orçamentos/vendas)
- [x] Validar CNPJ único

### Produtos
- [x] Listar produtos com filtros (empresa, categoria, status)
- [x] Criar produto
- [x] Editar produto
- [x] Deletar produto (apenas admin)
- [x] Buscar produtos por nome ou SKU

### Orçamentos
- [x] Listar orçamentos com filtros (status, empresa, data, representante)
- [x] Criar orçamento com múltiplos itens
- [x] Editar orçamento (apenas se rascunho ou enviado)
- [x] Visualizar orçamento em formato profissional
- [x] Enviar orçamento
- [x] Aceitar orçamento (criar venda automaticamente)
- [x] Rejeitar orçamento
- [x] Gerar PDF do orçamento
- [x] Calcular totais automaticamente

### Vendas
- [x] Listar vendas com filtros (status, empresa, representante, período)
- [x] Visualizar detalhes da venda
- [x] Atualizar status da venda (pendente → confirmada → entregue)
- [x] Registrar venda manual
- [x] Calcular comissões automaticamente
- [x] Buscar vendas por número ou cliente

## Fase 3: Frontend - Páginas e Componentes

### Layout e Navegação
- [x] Implementar DashboardLayout com sidebar
- [x] Criar menu lateral com navegação (Dashboard, Vendas, Clientes, Leads, Orçamentos, Empresas, Produtos, Comissões, Relatórios, Configurações)
- [x] Implementar header com notificações e perfil
- [x] Criar componente de logout

### Dashboard
- [x] Cards de resumo (KPIs): Total de Leads, Total de Clientes, Vendas do Mês, Orçamentos Pendentes, Comissão a Receber
- [x] Gráfico de linha: Vendas por mês (últimos 12 meses)
- [x] Gráfico de pizza: Distribuição de leads por status
- [x] Gráfico de barras: Top 5 clientes por volume de vendas
- [x] Gráfico de funil: Conversão Leads → Clientes → Vendas
- [x] Tabela de atividades recentes (últimos leads, vendas, orçamentos)
- [x] Filtros globais (período, representante, empresa)

### Módulo Leads
- [x] Página de listagem com tabela (Nome, Estabelecimento, Cidade, Telefone, Status, Data, Ações)
- [x] Filtros (status, cidade, data, representante)
- [x] Busca por nome ou estabelecimento
- [x] Paginação (10, 25, 50 registros)
- [x] Modal para criar novo lead
- [x] Modal para editar lead
- [x] Modal para transformar lead em cliente
- [x] Menu de ações (editar, transformar em cliente, deletar)
- [x] Validações em tempo real
- [x] Efeitos visuais (hover, badges coloridas, animações)

### Módulo Clientes
- [x] Página de listagem com tabela (Nome, Estabelecimento, CNPJ, Cidade, Telefone, Status, Data, Ações)
- [x] Filtros (status, cidade, data, representante)
- [x] Busca por nome, CNPJ ou estabelecimento
- [x] Paginação (10, 25, 50 registros)
- [x] Página de detalhes com abas (Informações Gerais, Orçamentos, Vendas, Histórico)
- [x] Modal para editar cliente
- [x] Modal para deletar cliente (com confirmação)
- [x] Badges de status (Ativo, Inativo, Suspenso)

### Módulo Orçamentos
- [x] Página de listagem com tabela (Número, Cliente, Empresa, Valor, Status, Data, Ações)
- [x] Filtros (status, empresa, data, representante)
- [x] Busca por número ou cliente
- [x] Paginação (10, 25, 50 registros)
- [x] Página de criação com 4 etapas (Cliente, Empresa, Produtos, Dados Adicionais)
- [x] Tabela dinâmica de produtos (adicionar/remover linhas)
- [x] Cálculos automáticos (subtotal, desconto, total)
- [x] Página de visualização em formato profissional
- [x] Botões de ação (editar, enviar, aceitar, rejeitar, deletar, imprimir, baixar PDF)
- [x] Modal para editar orçamento
- [x] Validações de campos obrigatórios

### Módulo Vendas
- [x] Página de listagem com tabela (Número, Cliente, Empresa, Valor, Comissão, Status, Data, Ações)
- [x] Filtros (status, empresa, representante, período)
- [x] Busca por número ou cliente
- [x] Paginação (10, 25, 50 registros)
- [x] Página de detalhes da venda
- [x] Modal para atualizar status
- [x] Modal para registrar venda manual
- [x] Badges de status (Pendente, Confirmada, Entregue, Cancelada)

### Módulo Empresas Representadas
- [x] Página de listagem com cards (Logo, Nome, CNPJ, Cidade)
- [x] Alternativa: Visualização em tabela
- [x] Filtros (status, cidade)
- [x] Busca por nome ou CNPJ
- [x] Modal para cadastrar empresa
- [x] Modal para editar empresa
- [x] Upload de logo com preview
- [x] Validações (CNPJ único, email válido, URL válida)

### Módulo Produtos
- [x] Página de listagem com tabela (Nome, SKU, Categoria, Preço, Status, Ações)
- [x] Filtros (empresa, categoria, status)
- [x] Busca por nome ou SKU
- [x] Modal para criar produto
- [x] Modal para editar produto
- [x] Modal para deletar produto

### Módulo Comissões (Admin Only)
- [x] Página com tabela de comissões por representante
- [x] Filtros (período, representante)
- [x] Gráfico de comissões por representante
- [x] Gráfico de comissões por período
- [x] Exportar relatório

### Módulo Relatórios
- [x] Relatório de vendas (período, representante, empresa)
- [x] Relatório de leads (status, fonte, representante)
- [x] Relatório de clientes (status, cidade, representante)
- [x] Relatório de comissões (período, representante)
- [x] Exportar em PDF/Excel

### Configurações
- [x] Perfil do usuário
- [x] Alterar senha
- [x] Preferências de notificação

## Fase 4: Funcionalidades Avançadas

- [x] Integração com ViaCEP para autocomplete de endereço
- [x] Geração de PDF para orçamentos
- [x] Geração de PDF para relatórios
- [x] Exportar dados em Excel
- [x] Envio de orçamento por email (Nodemailer)
- [x] Notificações em tempo real
- [x] Histórico de alterações para todas as entidades
- [x] Permissões baseadas em roles (admin vs representante)
- [x] Validação de CNPJ e CPF
- [x] Máscaras de entrada (telefone, CEP, CNPJ, CPF)

## Fase 5: Testes e Validação

- [x] Testes unitários para procedimentos tRPC (leads.test.ts)
- [x] Testes de autenticação e permissões
- [x] Testes de validação de dados
- [x] Testes de cálculos (totais, comissões, descontos)
- [x] Testes de filtros e buscas
- [x] Testes de paginação
- [x] Testes de responsividade (mobile, tablet, desktop)
- [x] Testes de performance
- [x] Testes de segurança (SQL injection, XSS, CSRF)

## Fase 6: Funcionalidades Avançadas Adicionais

- [x] Integração com Email (Nodemailer) - server/email.ts
- [x] Página de Importação em Lote (CSV/Excel) - Importacao.tsx
- [x] Página de Detalhes de Venda com Abas - VendaDetalhes.tsx
- [x] Integração ViaCEP para Autocomplete - lib/viacep.ts
- [x] Testes Unitários Completos - leads.test.ts
- [x] Documentação Técnica Completa - DOCUMENTACAO.md

## Fase 7: Entrega Final

- [x] Revisar todo o código
- [x] Documentar as funcionalidades
- [x] Criar arquivo ZIP com todos os arquivos
- [x] Preparar instruções de instalação e uso
