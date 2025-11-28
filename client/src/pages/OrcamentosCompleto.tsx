import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

interface Orcamento {
  id: number;
  numero: string;
  cliente: string;
  empresa: string;
  valor: number;
  desconto: number;
  total: number;
  status: "rascunho" | "enviado" | "aceito" | "rejeitado";
  dataCriacao: string;
  itens: OrcamentoItem[];
}

interface OrcamentoItem {
  id: number;
  produto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export default function OrcamentosCompleto() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([
    {
      id: 1,
      numero: "ORC-001",
      cliente: "João Silva",
      empresa: "Silva Comércio",
      valor: 5000,
      desconto: 500,
      total: 4500,
      status: "enviado",
      dataCriacao: "2024-01-15",
      itens: [
        { id: 1, produto: "Produto A", quantidade: 10, precoUnitario: 250, subtotal: 2500 },
        { id: 2, produto: "Produto B", quantidade: 10, precoUnitario: 250, subtotal: 2500 },
      ],
    },
    {
      id: 2,
      numero: "ORC-002",
      cliente: "Maria Santos",
      empresa: "Santos Importação",
      valor: 8000,
      desconto: 800,
      total: 7200,
      status: "rascunho",
      dataCriacao: "2024-01-14",
      itens: [],
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
    valor: 0,
    desconto: 0,
    status: "rascunho",
  });

  const statusColors: Record<string, string> = {
    rascunho: "bg-gray-100 text-gray-700",
    enviado: "bg-blue-100 text-blue-700",
    aceito: "bg-green-100 text-green-700",
    rejeitado: "bg-red-100 text-red-700",
  };

  const filteredOrcamentos = orcamentos.filter((orc) => {
    const matchSearch =
      orc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orc.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || orc.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (orcamento?: Orcamento) => {
    if (orcamento) {
      setEditingId(orcamento.id);
      setFormData({
        numero: orcamento.numero,
        cliente: orcamento.cliente,
        empresa: orcamento.empresa,
        valor: orcamento.valor,
        desconto: orcamento.desconto,
        status: orcamento.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        numero: `ORC-${String(orcamentos.length + 1).padStart(3, "0")}`,
        cliente: "",
        empresa: "",
        valor: 0,
        desconto: 0,
        status: "rascunho",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.numero || !formData.cliente || !formData.empresa) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const total = formData.valor - formData.desconto;

    if (editingId) {
      setOrcamentos(
        orcamentos.map((orc) =>
          orc.id === editingId
            ? { ...orc, ...formData, total, status: formData.status as any }
            : orc
        )
      );
      toast.success("Orçamento atualizado com sucesso!");
    } else {
      const newOrcamento: Orcamento = {
        id: Math.max(...orcamentos.map((o) => o.id), 0) + 1,
        ...formData,
        total,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
        itens: [],
      };
      setOrcamentos([...orcamentos, newOrcamento]);
      toast.success("Orçamento criado com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este orçamento?")) {
      setOrcamentos(orcamentos.filter((orc) => orc.id !== id));
      toast.success("Orçamento deletado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orçamentos</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
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
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aceito">Aceito</option>
              <option value="rejeitado">Rejeitado</option>
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

      {/* Tabela de Orçamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Orçamentos: {filteredOrcamentos.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Número</th>
                  <th className="text-left py-3 px-4 font-semibold">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-right py-3 px-4 font-semibold">Valor</th>
                  <th className="text-right py-3 px-4 font-semibold">Desconto</th>
                  <th className="text-right py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Data</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrcamentos.map((orc) => (
                  <tr key={orc.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-mono font-semibold">{orc.numero}</td>
                    <td className="py-3 px-4">{orc.cliente}</td>
                    <td className="py-3 px-4">{orc.empresa}</td>
                    <td className="py-3 px-4 text-right">R$ {orc.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right">R$ {orc.desconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right font-bold">R$ {orc.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[orc.status]}>
                        {orc.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(orc.dataCriacao).toLocaleDateString("pt-BR")}
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
                          onClick={() => handleOpenModal(orc)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(orc.id)}
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
              <CardTitle>{editingId ? "Editar Orçamento" : "Novo Orçamento"}</CardTitle>
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
                    placeholder="ORC-001"
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
                  <label className="block text-sm font-medium mb-2">Valor</label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Desconto</label>
                  <input
                    type="number"
                    value={formData.desconto}
                    onChange={(e) =>
                      setFormData({ ...formData, desconto: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rascunho">Rascunho</option>
                    <option value="enviado">Enviado</option>
                    <option value="aceito">Aceito</option>
                    <option value="rejeitado">Rejeitado</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-semibold text-blue-900">
                  Total: R$ {(formData.valor - formData.desconto).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? "Atualizar" : "Criar"} Orçamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
