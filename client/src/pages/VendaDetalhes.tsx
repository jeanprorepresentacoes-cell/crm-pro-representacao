import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Printer, Download } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function VendaDetalhes() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("informacoes");

  // Dados de exemplo
  const venda = {
    id: 1,
    numero: "VND-001",
    cliente: "João Silva",
    empresa: "Silva Comércio LTDA",
    representante: "Maria Santos",
    valor: 5000,
    comissao: 500,
    percentualComissao: 10,
    status: "entregue",
    dataCriacao: "2024-01-15",
    dataEntrega: "2024-01-20",
    descricao: "Venda de produtos diversos",
  };

  const itens = [
    {
      id: 1,
      produto: "Produto A",
      quantidade: 10,
      precoUnitario: 250,
      subtotal: 2500,
    },
    {
      id: 2,
      produto: "Produto B",
      quantidade: 10,
      precoUnitario: 250,
      subtotal: 2500,
    },
  ];

  const statusColors: Record<string, string> = {
    pendente: "bg-amber-100 text-amber-700",
    confirmada: "bg-blue-100 text-blue-700",
    entregue: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const handleImprimir = () => {
    window.print();
    toast.success("Abrindo impressora...");
  };

  const handleBaixarPDF = () => {
    toast.success("PDF gerado e baixado com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/vendas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{venda.numero}</h1>
            <p className="text-gray-600">{venda.cliente}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleImprimir}>
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleBaixarPDF}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de Informações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Status</p>
            <Badge className={`${statusColors[venda.status]} mt-2`}>
              {venda.status.charAt(0).toUpperCase() + venda.status.slice(1)}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Valor Total</p>
            <p className="text-2xl font-bold mt-2">R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Comissão</p>
            <p className="text-2xl font-bold text-green-600 mt-2">R$ {venda.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Representante</p>
            <p className="font-semibold mt-2">{venda.representante}</p>
          </CardContent>
        </Card>
      </div>

      {/* Abas */}
      <div className="border-b">
        <div className="flex gap-4">
          {["informacoes", "itens", "historico"].map((tab) => (
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
              <CardTitle>Informações da Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Número da Venda</p>
                <p className="font-mono font-semibold">{venda.numero}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Criação</p>
                <p className="font-semibold">{new Date(venda.dataCriacao).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Entrega</p>
                <p className="font-semibold">{new Date(venda.dataEntrega).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="font-semibold">{venda.descricao}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cliente e Representante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-semibold">{venda.cliente}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Empresa Representada</p>
                <p className="font-semibold">{venda.empresa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Representante</p>
                <p className="font-semibold">{venda.representante}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Desconto</span>
                  <span className="font-semibold">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Impostos</span>
                  <span className="font-semibold">R$ 0,00</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Comissão do Representante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Valor da Venda</span>
                  <span className="font-semibold">R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Percentual de Comissão</span>
                  <span className="font-semibold">{venda.percentualComissao}%</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t pt-3">
                  <span>Comissão a Receber</span>
                  <span className="text-green-600">R$ {venda.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Aba Itens */}
      {activeTab === "itens" && (
        <Card>
          <CardHeader>
            <CardTitle>Itens da Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Produto</th>
                    <th className="text-right py-3 px-4 font-semibold">Quantidade</th>
                    <th className="text-right py-3 px-4 font-semibold">Preço Unitário</th>
                    <th className="text-right py-3 px-4 font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.produto}</td>
                      <td className="py-3 px-4 text-right">{item.quantidade}</td>
                      <td className="py-3 px-4 text-right">R$ {item.precoUnitario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-4 text-right font-semibold">R$ {item.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
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
              <div className="flex gap-4 pb-4 border-b">
                <div className="w-24 text-sm font-semibold text-gray-600">2024-01-20</div>
                <div className="flex-1">
                  <p className="font-semibold">Status alterado para Entregue</p>
                  <p className="text-sm text-gray-600">Por: Maria Santos</p>
                </div>
              </div>
              <div className="flex gap-4 pb-4 border-b">
                <div className="w-24 text-sm font-semibold text-gray-600">2024-01-18</div>
                <div className="flex-1">
                  <p className="font-semibold">Status alterado para Confirmada</p>
                  <p className="text-sm text-gray-600">Por: Maria Santos</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-24 text-sm font-semibold text-gray-600">2024-01-15</div>
                <div className="flex-1">
                  <p className="font-semibold">Venda criada</p>
                  <p className="text-sm text-gray-600">Por: Maria Santos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
