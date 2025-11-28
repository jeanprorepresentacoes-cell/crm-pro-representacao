import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  id: number;
  nomePessoa: string;
  nomeEstabelecimento: string;
  email: string;
  telefone: string;
  cidade: string;
  status: "novo" | "em_contato" | "qualificado" | "perdido";
  dataCriacao: string;
}

export default function LeadsCompleto() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      nomePessoa: "João Silva",
      nomeEstabelecimento: "Silva Comércio LTDA",
      email: "joao@silva.com",
      telefone: "(11) 98765-4321",
      cidade: "São Paulo",
      status: "novo",
      dataCriacao: "2024-01-15",
    },
    {
      id: 2,
      nomePessoa: "Maria Santos",
      nomeEstabelecimento: "Santos Importação",
      email: "maria@santos.com",
      telefone: "(21) 98765-4321",
      cidade: "Rio de Janeiro",
      status: "em_contato",
      dataCriacao: "2024-01-14",
    },
    {
      id: 3,
      nomePessoa: "Pedro Oliveira",
      nomeEstabelecimento: "Oliveira Distribuição",
      email: "pedro@oliveira.com",
      telefone: "(31) 98765-4321",
      cidade: "Belo Horizonte",
      status: "qualificado",
      dataCriacao: "2024-01-13",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    nomePessoa: "",
    nomeEstabelecimento: "",
    email: "",
    telefone: "",
    cidade: "",
    status: "novo",
  });

  const statusColors: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    em_contato: "bg-yellow-100 text-yellow-700",
    qualificado: "bg-green-100 text-green-700",
    perdido: "bg-red-100 text-red-700",
  };

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || lead.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (lead?: Lead) => {
    if (lead) {
      setEditingId(lead.id);
      setFormData({
        nomePessoa: lead.nomePessoa,
        nomeEstabelecimento: lead.nomeEstabelecimento,
        email: lead.email,
        telefone: lead.telefone,
        cidade: lead.cidade,
        status: lead.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        nomePessoa: "",
        nomeEstabelecimento: "",
        email: "",
        telefone: "",
        cidade: "",
        status: "novo",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nomePessoa || !formData.nomeEstabelecimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setLeads(
        leads.map((lead) =>
          lead.id === editingId
            ? { ...lead, ...formData, status: formData.status as any }
            : lead
        )
      );
      toast.success("Lead atualizado com sucesso!");
    } else {
      const newLead: Lead = {
        id: Math.max(...leads.map((l) => l.id), 0) + 1,
        ...formData,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
      };
      setLeads([...leads, newLead]);
      toast.success("Lead criado com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este lead?")) {
      setLeads(leads.filter((lead) => lead.id !== id));
      toast.success("Lead deletado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Lead
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou estabelecimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os Status</option>
              <option value="novo">Novo</option>
              <option value="em_contato">Em Contato</option>
              <option value="qualificado">Qualificado</option>
              <option value="perdido">Perdido</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Leads */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Leads: {filteredLeads.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Estabelecimento</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{lead.nomePessoa}</td>
                    <td className="py-3 px-4">{lead.nomeEstabelecimento}</td>
                    <td className="py-3 px-4 text-sm">{lead.email}</td>
                    <td className="py-3 px-4">{lead.telefone}</td>
                    <td className="py-3 px-4">{lead.cidade}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[lead.status]}>
                        {lead.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(lead.dataCriacao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(lead)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(lead.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          Deletar
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

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{editingId ? "Editar Lead" : "Novo Lead"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Pessoa *</label>
                  <input
                    type="text"
                    value={formData.nomePessoa}
                    onChange={(e) =>
                      setFormData({ ...formData, nomePessoa: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeEstabelecimento}
                    onChange={(e) =>
                      setFormData({ ...formData, nomeEstabelecimento: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Silva Comércio LTDA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="joao@silva.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 98765-4321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="novo">Novo</option>
                    <option value="em_contato">Em Contato</option>
                    <option value="qualificado">Qualificado</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? "Atualizar" : "Criar"} Lead
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
