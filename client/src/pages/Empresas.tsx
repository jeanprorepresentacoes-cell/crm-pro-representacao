import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Globe, Mail, Phone } from "lucide-react";

export default function Empresas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Dados de exemplo
  const empresas = [
    {
      id: 1,
      nome: "Empresa A LTDA",
      cnpj: "12.345.678/0001-90",
      cidade: "São Paulo",
      email: "contato@empresaa.com",
      telefone: "(11) 3000-1000",
      website: "www.empresaa.com",
      status: "ativo",
      logo: "🏢",
    },
    {
      id: 2,
      nome: "Empresa B Distribuidora",
      cnpj: "98.765.432/0001-10",
      cidade: "Rio de Janeiro",
      email: "contato@empresab.com",
      telefone: "(21) 3000-2000",
      website: "www.empresab.com",
      status: "ativo",
      logo: "📦",
    },
    {
      id: 3,
      nome: "Empresa C Importação",
      cnpj: "55.555.555/0001-55",
      cidade: "Belo Horizonte",
      email: "contato@empresac.com",
      telefone: "(31) 3000-3000",
      website: "www.empresac.com",
      status: "inativo",
      logo: "🌍",
    },
  ];

  const statusColors: Record<string, string> = {
    ativo: "bg-green-100 text-green-700",
    inativo: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    ativo: "Ativo",
    inativo: "Inativo",
  };

  const filteredEmpresas = empresas.filter((empresa) => {
    const matchesSearch =
      empresa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empresa.cnpj.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Empresas Representadas</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou CNPJ..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                onClick={() => setViewMode("cards")}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => setViewMode("table")}
              >
                Tabela
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visualização em Cards */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmpresas.map((empresa) => (
            <Card key={empresa.id} className="hover:shadow-lg transition">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{empresa.logo}</div>
                  <Badge className={statusColors[empresa.status]}>
                    {statusLabels[empresa.status]}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">{empresa.nome}</h3>
                <p className="text-sm text-gray-600 mb-3">{empresa.cnpj}</p>
                <p className="text-sm text-gray-600 mb-4">{empresa.cidade}</p>
                <div className="flex gap-2 mb-4">
                  <a href={`tel:${empresa.telefone}`} className="text-blue-500 hover:text-blue-700">
                    <Phone className="h-4 w-4" />
                  </a>
                  <a href={`mailto:${empresa.email}`} className="text-blue-500 hover:text-blue-700">
                    <Mail className="h-4 w-4" />
                  </a>
                  <a href={`https://${empresa.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Visualização em Tabela */}
      {viewMode === "table" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas ({filteredEmpresas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold">CNPJ</th>
                    <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmpresas.map((empresa) => (
                    <tr key={empresa.id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">{empresa.nome}</td>
                      <td className="py-3 px-4 font-mono text-sm">{empresa.cnpj}</td>
                      <td className="py-3 px-4">{empresa.cidade}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusColors[empresa.status]}>
                          {statusLabels[empresa.status]}
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
      )}
    </div>
  );
}
