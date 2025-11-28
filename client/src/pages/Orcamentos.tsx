import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, FileText } from "lucide-react";

export default function Orcamentos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Dados de exemplo
  const orcamentos = [
    {
      id: 1,
      numeroOrcamento: "ORC-001",
      cliente: "Silva Comércio",
      empresa: "Empresa A",
      valor: "R$ 5.000,00",
      status: "rascunho",
      dataCriacao: "2024-01-15",
    },
    {
      id: 2,
      numeroOrcamento: "ORC-002",
      cliente: "Santos Ltda",
      empresa: "Empresa B",
      valor: "R$ 12.500,00",
      status: "enviado",
      dataCriacao: "2024-01-14",
    },
    {
      id: 3,
      numeroOrcamento: "ORC-003",
      cliente: "Costa Distribuidora",
      empresa: "Empresa A",
      valor: "R$ 8.750,00",
      status: "aceito",
      dataCriacao: "2024-01-13",
    },
  ];

  const statusColors: Record<string, string> = {
    rascunho: "bg-gray-100 text-gray-700",
    enviado: "bg-blue-100 text-blue-700",
    aceito: "bg-green-100 text-green-700",
    rejeitado: "bg-red-100 text-red-700",
    expirado: "bg-amber-100 text-amber-700",
  };

  const statusLabels: Record<string, string> = {
    rascunho: "Rascunho",
    enviado: "Enviado",
    aceito: "Aceito",
    rejeitado: "Rejeitado",
    expirado: "Expirado",
  };

  const filteredOrcamentos = orcamentos.filter((orcamento) => {
    const matchesSearch =
      orcamento.numeroOrcamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orcamento.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "todos" || orcamento.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
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
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aceito">Aceito</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="expirado">Expirado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Orçamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Orçamentos ({filteredOrcamentos.length})</CardTitle>
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
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrcamentos.map((orcamento) => (
                  <tr key={orcamento.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono">{orcamento.numeroOrcamento}</td>
                    <td className="py-3 px-4">{orcamento.cliente}</td>
                    <td className="py-3 px-4">{orcamento.empresa}</td>
                    <td className="py-3 px-4 font-semibold">{orcamento.valor}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[orcamento.status]}>
                        {statusLabels[orcamento.status]}
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
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
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
