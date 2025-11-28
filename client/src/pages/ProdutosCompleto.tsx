import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Search, Filter, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Produto {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  empresa: string;
  preco: number;
  estoque: number;
  status: "ativo" | "inativo";
  dataCriacao: string;
}

export default function ProdutosCompleto() {
  const [produtos, setProdutos] = useState<Produto[]>([
    {
      id: 1,
      nome: "Produto A",
      sku: "SKU-001",
      categoria: "Eletrônicos",
      empresa: "Empresa A",
      preco: 250,
      estoque: 50,
      status: "ativo",
      dataCriacao: "2024-01-10",
    },
    {
      id: 2,
      nome: "Produto B",
      sku: "SKU-002",
      categoria: "Vestuário",
      empresa: "Empresa B",
      preco: 150,
      estoque: 100,
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
    sku: "",
    categoria: "",
    empresa: "",
    preco: 0,
    estoque: 0,
    status: "ativo",
  });

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !filterStatus || produto.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleOpenModal = (produto?: Produto) => {
    if (produto) {
      setEditingId(produto.id);
      setFormData({
        nome: produto.nome,
        sku: produto.sku,
        categoria: produto.categoria,
        empresa: produto.empresa,
        preco: produto.preco,
        estoque: produto.estoque,
        status: produto.status,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: "",
        sku: "",
        categoria: "",
        empresa: "",
        preco: 0,
        estoque: 0,
        status: "ativo",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nome || !formData.sku) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setProdutos(
        produtos.map((produto) =>
          produto.id === editingId
            ? { ...produto, ...formData, status: formData.status as any }
            : produto
        )
      );
      toast.success("Produto atualizado com sucesso!");
    } else {
      const newProduto: Produto = {
        id: Math.max(...produtos.map((p) => p.id), 0) + 1,
        ...formData,
        status: formData.status as any,
        dataCriacao: new Date().toISOString().split("T")[0],
      };
      setProdutos([...produtos, newProduto]);
      toast.success("Produto criado com sucesso!");
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      setProdutos(produtos.filter((produto) => produto.id !== id));
      toast.success("Produto deletado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
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
                placeholder="Buscar por nome ou SKU..."
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

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Total de Produtos: {filteredProdutos.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-right py-3 px-4 font-semibold">Preço</th>
                  <th className="text-right py-3 px-4 font-semibold">Estoque</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdutos.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium">{produto.nome}</td>
                    <td className="py-3 px-4 font-mono text-sm">{produto.sku}</td>
                    <td className="py-3 px-4">{produto.categoria}</td>
                    <td className="py-3 px-4">{produto.empresa}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {produto.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-right">
                      <Badge variant="outline" className={produto.estoque > 20 ? "bg-green-50" : "bg-orange-50"}>
                        {produto.estoque} unidades
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[produto.status]}>
                        {produto.status.toUpperCase()}
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
                          onClick={() => handleOpenModal(produto)}
                          className="gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(produto.id)}
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
              <CardTitle>{editingId ? "Editar Produto" : "Novo Produto"}</CardTitle>
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
                    placeholder="Produto A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="SKU-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Eletrônicos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Empresa</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Empresa A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Preço</label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData({ ...formData, preco: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estoque</label>
                  <input
                    type="number"
                    value={formData.estoque}
                    onChange={(e) =>
                      setFormData({ ...formData, estoque: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
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
                  {editingId ? "Atualizar" : "Criar"} Produto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
