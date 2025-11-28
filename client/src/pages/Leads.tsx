import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react";

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

  // Dados de exemplo
  const leads = [
    {
      id: 1,
      nomePessoa: "João Silva",
      nomeEstabelecimento: "Silva Comércio",
      cidade: "São Paulo",
      telefone: "(11) 98765-4321",
      email: "joao@silva.com",
      status: "novo",
      dataCriacao: "2024-01-15",
    },
    {
      id: 2,
      nomePessoa: "Maria Santos",
      nomeEstabelecimento: "Santos Ltda",
      cidade: "Rio de Janeiro",
      telefone: "(21) 99876-5432",
      email: "maria@santos.com",
      status: "em_contato",
      dataCriacao: "2024-01-14",
    },
    {
      id: 3,
      nomePessoa: "Pedro Costa",
      nomeEstabelecimento: "Costa Distribuidora",
      cidade: "Belo Horizonte",
      telefone: "(31) 98765-1234",
      email: "pedro@costa.com",
      status: "qualificado",
      dataCriacao: "2024-01-13",
    },
  ];

  const statusColors: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    em_contato: "bg-amber-100 text-amber-700",
    qualificado: "bg-green-100 text-green-700",
    proposta_enviada: "bg-purple-100 text-purple-700",
    perdido: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    novo: "Novo",
    em_contato: "Em Contato",
    qualificado: "Qualificado",
    proposta_enviada: "Proposta Enviada",
    perdido: "Perdido",
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "todos" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Lead
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
                  placeholder="Buscar por nome ou estabelecimento..."
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
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="qualificado">Qualificado</option>
              <option value="proposta_enviada">Proposta Enviada</option>
              <option value="perdido">Perdido</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Estabelecimento</th>
                  <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold">Contato</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{lead.nomePessoa}</td>
                    <td className="py-3 px-4">{lead.nomeEstabelecimento}</td>
                    <td className="py-3 px-4">{lead.cidade}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <a href={`tel:${lead.telefone}`} className="text-blue-500 hover:text-blue-700">
                          <Phone className="h-4 w-4" />
                        </a>
                        <a href={`mailto:${lead.email}`} className="text-blue-500 hover:text-blue-700">
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[lead.status]}>
                        {statusLabels[lead.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
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
