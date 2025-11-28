import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");;

  // Dados de exemplo
  const clientes = [
    {
      id: 1,
      nomePessoa: "João Silva",
      nomeEstabelecimento: "Silva Comércio LTDA",
      cnpj: "12.345.678/0001-90",
      cidade: "São Paulo",
      telefone: "(11) 98765-4321",
      email: "contato@silva.com",
      status: "ativo",
      dataCriacao: "2024-01-10",
    },
    {
      id: 2,
      nomePessoa: "Maria Santos",
      nomeEstabelecimento: "Santos Distribuidora",
      cnpj: "98.765.432/0001-10",
      cidade: "Rio de Janeiro",
      telefone: "(21) 99876-5432",
      email: "contato@santos.com",
      status: "ativo",
      dataCriacao: "2024-01-08",
    },
    {
      id: 3,
      nomePessoa: "Pedro Costa",
      nomeEstabelecimento: "Costa Importação",
      cnpj: "55.555.555/0001-55",
      cidade: "Belo Horizonte",
      telefone: "(31) 98765-1234",
      email: "contato@costa.com",
      status: "inativo",
      dataCriacao: "2024-01-05",
    },
  ];

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
    suspenso: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
    suspenso: "Suspenso",
  };

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj.includes(searchTerm);
    const matchesStatus = selectedStatus === "todos" || cliente.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
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
                  placeholder="Buscar por nome, estabelecimento ou CNPJ..."
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
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClientes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Estabelecimento</th>
                  <th className="text-left py-3 px-4 font-semibold">CNPJ</th>
                  <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{cliente.nomePessoa}</td>
                    <td className="py-3 px-4">{cliente.nomeEstabelecimento}</td>
                    <td className="py-3 px-4 font-mono text-sm">{cliente.cnpj}</td>
                    <td className="py-3 px-4">{cliente.cidade}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[cliente.status]}>
                        {statusLabels[cliente.status]}
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
