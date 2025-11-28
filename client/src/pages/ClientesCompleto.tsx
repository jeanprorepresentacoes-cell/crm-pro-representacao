import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Cliente {
  id: number;
  nomePessoa: string;
  nomeEstabelecimento: string;
  cnpj: string;
  email: string;
  telefone: string;
  cidade: string;
  status: "ativo" | "inativo" | "suspenso";
  dataCriacao: string;
  limiteCredito: number;
}

export default function ClientesCompleto() {
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: 1,
      nomePessoa: "João Silva",
      nomeEstabelecimento: "Silva Comércio LTDA",
      cnpj: "12.345.678/0001-90",
      email: "joao@silva.com",
      telefone: "(11) 98765-4321",
      cidade: "São Paulo",
      status: "ativo",
      dataCriacao: "2024-01-10",
      limiteCredito: 50000,
    },
    {
      id: 2,
      nomePessoa: "Maria Santos",
      nomeEstabelecimento: "Santos Importação",
      cnpj: "98.765.432/0001-12",
      email: "maria@santos.com",
      telefone: "(21) 98765-4321",
      cidade: "Rio de Janeiro",
      status: "ativo",
      dataCriacao: "2024-01-08",
      limiteCredito: 75000,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    nomePessoa: "",
    nomeEstabelecimento: "",
    cnpj: "",
    email: "",
    telefone: "",
    cidade: "",
    status: "ativo",
    limiteCredito: 0,
  });

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
    suspenso: "bg-red-100 text-red-700",
  };

  const filteredClientes = clientes.filter((cliente) => {
    const matchSearch =
      cliente.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.nomeEstabelecimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cnpj.includes(searchTerm);
    const matchStatus = !filterStatus || cliente.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (cliente?: Cliente) => {
    if (cliente) {
      setEditingId(cliente.id);
      setFormData({
        nomePessoa: cliente.nomePessoa,
        nomeEstabelecimento: cliente.nomeEstabelecimento,
        cnpj: cliente.cnpj,
        email: cliente.email,
        telefone: cliente.telefone,
        cidade: cliente.cidade,
        status: cliente.status,
        limiteCredito: cliente.limiteCredito,
      });
    } else {
      setEditingId(null);
      setFormData({
        nomePessoa: "",
        nomeEstabelecimento: "",
        cnpj: "",
        email: "",
        telefone: "",
        cidade: "",
        status: "ativo",
        limiteCredito: 0,
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
      setClientes(
        clientes.map((cliente) =>
          cliente.id === editingId
            ? { ...cliente, ...formData, status: formData.status as any }
            : cliente
        )
      );
      toast.success("Cliente atualizado com sucesso!");
    } else {
      const newCliente: Cliente = {
        id: Math.max(...clientes.map((c) => c.id), 0) + 1,
        ...formData,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
      };
      setClientes([...clientes, newCliente]);
      toast.success("Cliente criado com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este cliente?")) {
      setClientes(clientes.filter((cliente) => cliente.id !== id));
      toast.success("Cliente deletado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
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
                placeholder="Buscar por nome, estabelecimento ou CNPJ..."
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
              <option value="suspenso">Suspenso</option>
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

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Clientes: {filteredClientes.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Estabelecimento</th>
                  <th className="text-left py-3 px-4 font-semibold">CNPJ</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Telefone</th>
                  <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Limite Crédito</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{cliente.nomePessoa}</td>
                    <td className="py-3 px-4">{cliente.nomeEstabelecimento}</td>
                    <td className="py-3 px-4 font-mono text-sm">{cliente.cnpj}</td>
                    <td className="py-3 px-4 text-sm">{cliente.email}</td>
                    <td className="py-3 px-4">{cliente.telefone}</td>
                    <td className="py-3 px-4">{cliente.cidade}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[cliente.status]}>
                        {cliente.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      R$ {cliente.limiteCredito.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(cliente)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(cliente.id)}
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
          <Card className="w-full max-w-3xl my-8">
            <CardHeader>
              <CardTitle>{editingId ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
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
                  <label className="block text-sm font-medium mb-2">CNPJ</label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="12.345.678/0001-90"
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
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="suspenso">Suspenso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Limite de Crédito</label>
                  <input
                    type="number"
                    value={formData.limiteCredito}
                    onChange={(e) =>
                      setFormData({ ...formData, limiteCredito: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
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
                  {editingId ? "Atualizar" : "Criar"} Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
