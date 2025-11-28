import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Venda {
  id: number;
  numero: string;
  cliente: string;
  empresa: string;
  representante: string;
  valor: number;
  comissao: number;
  status: "pendente" | "confirmada" | "entregue" | "cancelada";
  dataCriacao: string;
  dataEntrega?: string;
}

export default function VendasCompleto() {
  const [vendas, setVendas] = useState<Venda[]>([
    {
      id: 1,
      numero: "VND-001",
      cliente: "João Silva",
      empresa: "Silva Comércio",
      representante: "Carlos",
      valor: 4500,
      comissao: 450,
      status: "confirmada",
      dataCriacao: "2024-01-15",
      dataEntrega: "2024-01-20",
    },
    {
      id: 2,
      numero: "VND-002",
      cliente: "Maria Santos",
      empresa: "Santos Importação",
      representante: "Ana",
      valor: 7200,
      comissao: 720,
      status: "pendente",
      dataCriacao: "2024-01-14",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    empresa: "",
    representante: "",
    valor: 0,
    comissao: 0,
    status: "pendente",
  });

  const statusColors: Record<string, string> = {
    pendente: "bg-yellow-100 text-yellow-700",
    confirmada: "bg-blue-100 text-blue-700",
    entregue: "bg-green-100 text-green-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const filteredVendas = vendas.filter((venda) => {
    const matchSearch =
      venda.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venda.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || venda.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (venda?: Venda) => {
    if (venda) {
      setEditingId(venda.id);
      setFormData({
        numero: venda.numero,
        cliente: venda.cliente,
        empresa: venda.empresa,
        representante: venda.representante,
        valor: venda.valor,
        comissao: venda.comissao,
        status: venda.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        numero: `VND-${String(vendas.length + 1).padStart(3, "0")}`,
        cliente: "",
        empresa: "",
        representante: "",
        valor: 0,
        comissao: 0,
        status: "pendente",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.numero || !formData.cliente || !formData.empresa) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setVendas(
        vendas.map((venda) =>
          venda.id === editingId
            ? { ...venda, ...formData, status: formData.status as any }
            : venda
        )
      );
      toast.success("Venda atualizada com sucesso!");
    } else {
      const newVenda: Venda = {
        id: Math.max(...vendas.map((v) => v.id), 0) + 1,
        ...formData,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
      };
      setVendas([...vendas, newVenda]);
      toast.success("Venda criada com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta venda?")) {
      setVendas(vendas.filter((venda) => venda.id !== id));
      toast.success("Venda deletada com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vendas</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Venda
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
                placeholder="Buscar por número ou cliente..."
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
              <option value="pendente">Pendente</option>
              <option value="confirmada">Confirmada</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
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

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Vendas: {filteredVendas.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Número</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Representante</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-right py-3 px-4 font-semibold">Comissão</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendas.map((venda) => (
                  <tr key={venda.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono font-semibold">{venda.numero}</td>
                    <td className="py-3 px-4">{venda.cliente}</td>
                    <td className="py-3 px-4">{venda.empresa}</td>
                    <td className="py-3 px-4">{venda.representante}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {venda.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right text-green-600 font-semibold">R$ {venda.comissao.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[venda.status]}>
                        {venda.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(venda.dataCriacao).toLocaleDateString("pt-BR")}
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
                          onClick={() => handleOpenModal(venda)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(venda.id)}
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
              <CardTitle>{editingId ? "Editar Venda" : "Nova Venda"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Número *</label>
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VND-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cliente *</label>
                  <input
                    type="text"
                    value={formData.cliente}
                    onChange={(e) =>
                      setFormData({ ...formData, cliente: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Empresa *</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Silva Comércio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Representante</label>
                  <input
                    type="text"
                    value={formData.representante}
                    onChange={(e) =>
                      setFormData({ ...formData, representante: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Carlos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valor</label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Comissão</label>
                  <input
                    type="number"
                    value={formData.comissao}
                    onChange={(e) =>
                      setFormData({ ...formData, comissao: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="450"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelada">Cancelada</option>
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
                  {editingId ? "Atualizar" : "Criar"} Venda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
