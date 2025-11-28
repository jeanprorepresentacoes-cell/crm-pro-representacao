import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";

export default function Comissoes() {
  const [periodo, setPeriodo] = useState("mes");
  const [representante, setRepresentante] = useState("todos");
  const [statusPagamento, setStatusPagamento] = useState("todos");

  const handleExportarExcel = () => {
    toast.success("Relatório de comissões exportado com sucesso!");
  };

  const comissoes = [
    {
      id: 1,
      representante: "João Silva",
      periodo: "Janeiro 2024",
      vendas: 45000,
      percentualComissao: 5,
      valorComissao: 2250,
      statusPagamento: "pago",
      dataPagamento: "2024-02-05",
    },
    {
      id: 2,
      representante: "Maria Santos",
      periodo: "Janeiro 2024",
      vendas: 52000,
      percentualComissao: 5,
      valorComissao: 2600,
      statusPagamento: "pago",
      dataPagamento: "2024-02-05",
    },
    {
      id: 3,
      representante: "Pedro Costa",
      periodo: "Janeiro 2024",
      vendas: 38000,
      percentualComissao: 5,
      valorComissao: 1900,
      statusPagamento: "pendente",
      dataPagamento: null,
    },
    {
      id: 4,
      representante: "João Silva",
      periodo: "Fevereiro 2024",
      vendas: 52000,
      percentualComissao: 5,
      valorComissao: 2600,
      statusPagamento: "pendente",
      dataPagamento: null,
    },
    {
      id: 5,
      representante: "Maria Santos",
      periodo: "Fevereiro 2024",
      vendas: 61000,
      percentualComissao: 5,
      valorComissao: 3050,
      statusPagamento: "processando",
      dataPagamento: null,
    },
  ];

  const statusColors: Record<string, string> = {
    pago: "bg-green-100 text-green-700",
    pendente: "bg-amber-100 text-amber-700",
    processando: "bg-blue-100 text-blue-700",
  };

  const statusLabels: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    processando: "Processando",
  };

  const filteredComissoes = comissoes.filter((comissao) => {
    const matchesRepresentante = representante === "todos" || comissao.representante === representante;
    const matchesStatus = statusPagamento === "todos" || comissao.statusPagamento === statusPagamento;
    return matchesRepresentante && matchesStatus;
  });

  const totalComissoes = filteredComissoes.reduce((sum, c) => sum + c.valorComissao, 0);
  const totalVendas = filteredComissoes.reduce((sum, c) => sum + c.vendas, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Comissões</h1>
        <Button onClick={handleExportarExcel} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Excel
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total de Comissões</p>
            <p className="text-3xl font-bold text-green-600">R$ {totalComissoes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-2">Período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Total de Vendas</p>
            <p className="text-3xl font-bold">R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <p className="text-xs text-gray-500 mt-2">Período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 mb-2">Comissões Pendentes</p>
            <p className="text-3xl font-bold text-amber-600">
              R$ {filteredComissoes
                .filter((c) => c.statusPagamento === "pendente" || c.statusPagamento === "processando")
                .reduce((sum, c) => sum + c.valorComissao, 0)
                .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">A pagar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-semibold">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
                  <SelectItem value="semestre">Este Semestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-semibold">Representante</label>
              <Select value={representante} onValueChange={setRepresentante}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="João Silva">João Silva</SelectItem>
                  <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  <SelectItem value="Pedro Costa">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-semibold">Status de Pagamento</label>
              <Select value={statusPagamento} onValueChange={setStatusPagamento}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="processando">Processando</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Comissões */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das Comissões ({filteredComissoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Representante</th>
                  <th className="text-left py-3 px-4 font-semibold">Período</th>
                  <th className="text-right py-3 px-4 font-semibold">Vendas</th>
                  <th className="text-right py-3 px-4 font-semibold">%</th>
                  <th className="text-right py-3 px-4 font-semibold">Comissão</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Data Pagamento</th>
                  <th className="text-center py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredComissoes.map((comissao) => (
                  <tr key={comissao.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{comissao.representante}</td>
                    <td className="py-3 px-4">{comissao.periodo}</td>
                    <td className="py-3 px-4 text-right">R$ {comissao.vendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right">{comissao.percentualComissao}%</td>
                    <td className="py-3 px-4 text-right font-semibold text-green-600">
                      R$ {comissao.valorComissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[comissao.statusPagamento]}>
                        {statusLabels[comissao.statusPagamento]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {comissao.dataPagamento ? new Date(comissao.dataPagamento).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ações em Lote */}
      <Card>
        <CardHeader>
          <CardTitle>Ações em Lote</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline">Marcar como Pago</Button>
          <Button variant="outline">Enviar Comprovante</Button>
          <Button variant="outline" className="text-red-500 hover:text-red-700">
            Recalcular Comissões
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
