CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome_pessoa` varchar(255) NOT NULL,
	`nome_estabelecimento` varchar(255) NOT NULL,
	`cnpj` varchar(18),
	`cpf` varchar(14),
	`cidade` varchar(100) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`endereco_completo` varchar(255) NOT NULL,
	`numero` varchar(20) NOT NULL,
	`complemento` varchar(255),
	`bairro` varchar(100) NOT NULL,
	`cep` varchar(10) NOT NULL,
	`observacoes` text,
	`lead_id` int,
	`representante_id` int NOT NULL,
	`status` enum('ativo','inativo','suspenso') NOT NULL DEFAULT 'ativo',
	`data_conversao` timestamp,
	`limite_credito` decimal(12,2),
	`condicao_pagamento` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`),
	CONSTRAINT `clientes_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `empresas_representadas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cnpj` varchar(18) NOT NULL,
	`logo_url` text,
	`descricao` text,
	`telefone` varchar(20),
	`email` varchar(320),
	`website` varchar(255),
	`endereco` varchar(255),
	`cidade` varchar(100),
	`estado` varchar(2),
	`ativo` boolean NOT NULL DEFAULT true,
	`criado_por` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `empresas_representadas_id` PRIMARY KEY(`id`),
	CONSTRAINT `empresas_representadas_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `historico_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lead_id` int NOT NULL,
	`status_anterior` varchar(50),
	`status_novo` varchar(50) NOT NULL,
	`usuario_id` int NOT NULL,
	`motivo` text,
	`data_alteracao` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historico_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itens_orcamento` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orcamento_id` int NOT NULL,
	`produto_id` int,
	`nome_produto` varchar(255) NOT NULL,
	`descricao` text,
	`quantidade` decimal(10,2) NOT NULL,
	`valor_unitario` decimal(12,2) NOT NULL,
	`valor_total` decimal(12,2) NOT NULL,
	`ordem` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itens_orcamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome_pessoa` varchar(255) NOT NULL,
	`nome_estabelecimento` varchar(255) NOT NULL,
	`cidade` varchar(100) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(320),
	`observacoes` text,
	`status` enum('novo','em_contato','qualificado','proposta_enviada','perdido','convertido') NOT NULL DEFAULT 'novo',
	`representante_id` int NOT NULL,
	`fonte_lead` enum('indicacao','site','evento','cold_call','outro') DEFAULT 'outro',
	`data_ultimo_contato` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orcamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero_orcamento` varchar(50) NOT NULL,
	`cliente_id` int NOT NULL,
	`empresa_representada_id` int NOT NULL,
	`representante_id` int NOT NULL,
	`data_orcamento` timestamp NOT NULL DEFAULT (now()),
	`data_validade` timestamp,
	`status` enum('rascunho','enviado','aceito','rejeitado','expirado') NOT NULL DEFAULT 'rascunho',
	`valor_total` decimal(12,2) NOT NULL,
	`desconto_percentual` decimal(5,2),
	`desconto_valor` decimal(12,2),
	`valor_liquido` decimal(12,2) NOT NULL,
	`observacoes` text,
	`condicoes_pagamento` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orcamentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `orcamentos_numero_orcamento_unique` UNIQUE(`numero_orcamento`)
);
--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`codigo_sku` varchar(100) NOT NULL,
	`empresa_representada_id` int NOT NULL,
	`categoria` varchar(100),
	`preco_base` decimal(12,2) NOT NULL,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `produtos_id` PRIMARY KEY(`id`),
	CONSTRAINT `produtos_codigo_sku_unique` UNIQUE(`codigo_sku`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero_venda` varchar(50) NOT NULL,
	`orcamento_id` int,
	`cliente_id` int NOT NULL,
	`empresa_representada_id` int NOT NULL,
	`representante_id` int NOT NULL,
	`valor_total` decimal(12,2) NOT NULL,
	`comissao_percentual` decimal(5,2),
	`comissao_valor` decimal(12,2),
	`data_venda` timestamp NOT NULL DEFAULT (now()),
	`data_entrega_prevista` timestamp,
	`data_entrega_real` timestamp,
	`status` enum('pendente','confirmada','entregue','cancelada') NOT NULL DEFAULT 'pendente',
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendas_numero_venda_unique` UNIQUE(`numero_venda`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','representante') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `empresa_id` int;--> statement-breakpoint
ALTER TABLE `users` ADD `ativo` boolean DEFAULT true NOT NULL;