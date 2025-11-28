import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export default function Produtos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todos");

  // Dados de exemplo
  const produtos = [
    {
      id: 1,
      nome: "Produto A",
      sku: "SKU-001",
      categoria: "Eletrônicos",
      empresa: "Empresa A",
      preco: "R$ 1.500,00",
      status: "ativo",
    },
    {
      id: 2,
      nome: "Produto B",
      sku: "SKU-002",
      categoria: "Eletrônicos",
      empresa: "Empresa B",
      preco: "R$ 2.500,00",
      status: "ativo",
    },
    {
      id: 3,
      nome: "Produto C",
      sku: "SKU-003",
      categoria: "Acessórios",
      empresa: "Empresa A",
      preco: "R$ 500,00",
      status: "inativo",
    },
    {
      id: 4,
      nome: "Produto D",
      sku: "SKU-004",
      categoria: "Acessórios",
      empresa: "Empresa C",
      preco: "R$ 750,00",
      status: "ativo",
    },
  ];

  const categorias = ["todos", "Eletrônicos", "Acessórios", "Serviços"];

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = selectedCategoria === "todos" || produto.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
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
                  placeholder="Buscar por nome ou SKU..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "todos" ? "Todas as Categorias" : cat}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos ({filteredProdutos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold">Categoria</th>
                  <th className="text-left py-3 px-4 font-semibold">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold">Preço</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdutos.map((produto) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{produto.nome}</td>
                    <td className="py-3 px-4 font-mono text-sm">{produto.sku}</td>
                    <td className="py-3 px-4">{produto.categoria}</td>
                    <td className="py-3 px-4">{produto.empresa}</td>
                    <td className="py-3 px-4 font-semibold">{produto.preco}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[produto.status]}>
                        {statusLabels[produto.status]}
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
