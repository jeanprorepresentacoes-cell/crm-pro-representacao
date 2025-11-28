import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  website: string;
  status: "ativo" | "inativo";
  dataCriacao: string;
  logo?: string;
}

export default function EmpresasCompleto() {
  const [empresas, setEmpresas] = useState<Empresa[]>([
    {
      id: 1,
      nome: "Empresa A",
      cnpj: "12.345.678/0001-90",
      email: "contato@empresaa.com",
      telefone: "(11) 3000-0000",
      cidade: "São Paulo",
      website: "www.empresaa.com",
      status: "ativo",
      dataCriacao: "2024-01-10",
    },
    {
      id: 2,
      nome: "Empresa B",
      cnpj: "98.765.432/0001-12",
      email: "contato@empresab.com",
      telefone: "(21) 3000-0000",
      cidade: "Rio de Janeiro",
      website: "www.empresab.com",
      status: "ativo",
      dataCriacao: "2024-01-08",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    cidade: "",
    website: "",
    status: "ativo",
  });

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
  };

  const filteredEmpresas = empresas.filter((empresa) => {
    const matchSearch =
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnpj.includes(searchTerm);
    const matchStatus = !filterStatus || empresa.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (empresa?: Empresa) => {
    if (empresa) {
      setEditingId(empresa.id);
      setFormData({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
        email: empresa.email,
        telefone: empresa.telefone,
        cidade: empresa.cidade,
        website: empresa.website,
        status: empresa.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: "",
        cnpj: "",
        email: "",
        telefone: "",
        cidade: "",
        website: "",
        status: "ativo",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.cnpj) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setEmpresas(
        empresas.map((empresa) =>
          empresa.id === editingId
            ? { ...empresa, ...formData, status: formData.status as any }
            : empresa
        )
      );
      toast.success("Empresa atualizada com sucesso!");
    } else {
      const newEmpresa: Empresa = {
        id: Math.max(...empresas.map((e) => e.id), 0) + 1,
        ...formData,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
      };
      setEmpresas([...empresas, newEmpresa]);
      toast.success("Empresa criada com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta empresa?")) {
      setEmpresas(empresas.filter((empresa) => empresa.id !== id));
      toast.success("Empresa deletada com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Empresas Representadas</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Empresa
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
                placeholder="Buscar por nome ou CNPJ..."
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
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Empresas */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Empresas: {filteredEmpresas.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">CNPJ</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold">Website</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmpresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{empresa.nome}</td>
                    <td className="py-3 px-4 font-mono text-sm">{empresa.cnpj}</td>
                    <td className="py-3 px-4 text-sm">{empresa.email}</td>
                    <td className="py-3 px-4">{empresa.telefone}</td>
                    <td className="py-3 px-4">{empresa.cidade}</td>
                    <td className="py-3 px-4">
                      <a href={`https://${empresa.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                        {empresa.website}
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[empresa.status]}>
                        {empresa.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(empresa)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(empresa.id)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle>{editingId ? "Editar Empresa" : "Nova Empresa"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Empresa A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CNPJ *</label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cnpj: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12.345.678/0001-90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 3000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="www.empresa.com"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
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
                  {editingId ? "Atualizar" : "Criar"} Empresa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
