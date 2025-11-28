import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Mail, Phone } from "lucide-react";
import { useLocation } from "wouter";

export default function ClienteDetalhes() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("informacoes");

  // Dados de exemplo
  const cliente = {
    id: 1,
    nomePessoa: "João Silva",
    nomeEstabelecimento: "Silva Comércio LTDA",
    cnpj: "12.345.678/0001-90",
    cpf: "123.456.789-00",
    email: "contato@silva.com",
    telefone: "(11) 98765-4321",
    endereco: "Rua das Flores",
    numero: "123",
    complemento: "Apto 101",
    bairro: "Centro",
    cep: "01310-100",
    cidade: "São Paulo",
    estado: "SP",
    status: "ativo",
    limiteCredito: 50000,
    condicaoPagamento: "30 dias",
    dataCriacao: "2024-01-10",
  };

  const orcamentos = [
    {
      id: 1,
      numero: "ORC-001",
      valor: "R$ 5.000,00",
      status: "aceito",
      data: "2024-01-15",
    },
    {
      id: 2,
      numero: "ORC-002",
      valor: "R$ 8.750,00",
      status: "enviado",
      data: "2024-01-20",
    },
  ];

  const vendas = [
    {
      id: 1,
      numero: "VND-001",
      valor: "R$ 5.000,00",
      comissao: "R$ 500,00",
      status: "entregue",
      data: "2024-01-15",
    },
    {
      id: 2,
      numero: "VND-002",
      valor: "R$ 8.750,00",
      comissao: "R$ 875,00",
      status: "confirmada",
      data: "2024-01-20",
    },
  ];

  const historico = [
    { data: "2024-01-20", acao: "Venda confirmada", usuario: "João Silva" },
    { data: "2024-01-15", acao: "Orçamento enviado", usuario: "Maria Santos" },
    { data: "2024-01-10", acao: "Cliente criado", usuario: "Pedro Costa" },
  ];

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
    suspenso: "bg-red-100 text-red-700",
    aceito: "bg-green-100 text-green-700",
    enviado: "bg-blue-100 text-blue-700",
    entregue: "bg-green-100 text-green-700",
    confirmada: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/clientes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{cliente.nomePessoa}</h1>
            <p className="text-gray-600">{cliente.nomeEstabelecimento}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button variant="outline" className="text-red-500 hover:text-red-700 gap-2">
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Cards de Informações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Status</p>
            <Badge className={`${statusColors[cliente.status]} mt-2`}>
              {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Limite de Crédito</p>
            <p className="text-2xl font-bold mt-2">R$ {cliente.limiteCredito.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total de Vendas</p>
            <p className="text-2xl font-bold mt-2">R$ 13.750,00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Cliente desde</p>
            <p className="text-sm font-semibold mt-2">{new Date(cliente.dataCriacao).toLocaleDateString("pt-BR")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas */}
      <div className="border-b">
        <div className="flex gap-4">
          {["informacoes", "orcamentos", "vendas", "historico"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Aba Informações */}
      {activeTab === "informacoes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold">{cliente.nomePessoa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${cliente.email}`} className="text-blue-500 hover:underline">
                    {cliente.email}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${cliente.telefone}`} className="text-blue-500 hover:underline">
                    {cliente.telefone}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">CPF</p>
                <p className="font-mono">{cliente.cpf}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Estabelecimento</p>
                <p className="font-semibold">{cliente.nomeEstabelecimento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CNPJ</p>
                <p className="font-mono">{cliente.cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Condição de Pagamento</p>
                <p className="font-semibold">{cliente.condicaoPagamento}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-semibold">{cliente.endereco}, {cliente.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Complemento</p>
                  <p className="font-semibold">{cliente.complemento}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bairro</p>
                  <p className="font-semibold">{cliente.bairro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CEP</p>
                  <p className="font-semibold">{cliente.cep}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cidade</p>
                  <p className="font-semibold">{cliente.cidade}, {cliente.estado}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Aba Orçamentos */}
      {activeTab === "orcamentos" && (
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos ({orcamentos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Número</th>
                    <th className="text-left py-3 px-4 font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentos.map((orcamento) => (
                    <tr key={orcamento.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{orcamento.numero}</td>
                      <td className="py-3 px-4 font-semibold">{orcamento.valor}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[orcamento.status]}>
                          {orcamento.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{new Date(orcamento.data).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aba Vendas */}
      {activeTab === "vendas" && (
        <Card>
          <CardHeader>
            <CardTitle>Vendas ({vendas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Número</th>
                    <th className="text-left py-3 px-4 font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold">Comissão</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((venda) => (
                    <tr key={venda.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{venda.numero}</td>
                      <td className="py-3 px-4 font-semibold">{venda.valor}</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">{venda.comissao}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[venda.status]}>
                          {venda.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{new Date(venda.data).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aba Histórico */}
      {activeTab === "historico" && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Alterações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {historico.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="w-24 text-sm font-semibold text-gray-600">
                    {new Date(item.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{item.acao}</p>
                    <p className="text-sm text-gray-600">Por: {item.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
