import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export default function Vendas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Dados de exemplo
  const vendas = [
    {
      id: 1,
      numeroVenda: "VND-001",
      cliente: "Silva Comércio",
      empresa: "Empresa A",
      valor: "R$ 5.000,00",
      comissao: "R$ 500,00",
      status: "pendente",
      dataCriacao: "2024-01-15",
    },
    {
      id: 2,
      numeroVenda: "VND-002",
      cliente: "Santos Ltda",
      empresa: "Empresa B",
      valor: "R$ 12.500,00",
      comissao: "R$ 1.250,00",
      status: "confirmada",
      dataCriacao: "2024-01-14",
    },
    {
      id: 3,
      numeroVenda: "VND-003",
      cliente: "Costa Distribuidora",
      empresa: "Empresa A",
      valor: "R$ 8.750,00",
      comissao: "R$ 875,00",
      status: "entregue",
      dataCriacao: "2024-01-13",
    },
  ];

  const statusColors: Record<string, string> = {
    pendente: "bg-amber-100 text-amber-700",
    confirmada: "bg-blue-100 text-blue-700",
    entregue: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    pendente: "Pendente",
    confirmada: "Confirmada",
    entregue: "Entregue",
    cancelada: "Cancelada",
  };

  const filteredVendas = vendas.filter((venda) => {
    const matchesSearch =
      venda.numeroVenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "todos" || venda.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Registrar Venda
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número ou cliente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmada">Confirmada</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendas ({filteredVendas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Número</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold">Comissão</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendas.map((venda) => (
                  <tr key={venda.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono">{venda.numeroVenda}</td>
                    <td className="py-3 px-4">{venda.cliente}</td>
                    <td className="py-3 px-4">{venda.empresa}</td>
                    <td className="py-3 px-4 font-semibold">{venda.valor}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{venda.comissao}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[venda.status]}>
                        {statusLabels[venda.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
