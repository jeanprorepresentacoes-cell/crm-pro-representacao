import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Download, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";

interface ImportacaoItem {
  id: string;
  nomePessoa: string;
  nomeEstabelecimento: string;
  email: string;
  telefone: string;
  cidade: string;
  status: "pendente" | "sucesso" | "erro";
  mensagem?: string;
}

export default function Importacao() {
  const [tipoImportacao, setTipoImportacao] = useState("leads");
  const [items, setItems] = useState<ImportacaoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [importando, setImportando] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      toast.error("Apenas arquivos CSV ou XLSX são permitidos");
      return;
    }

    setLoading(true);
    Papa.parse(file, {
      header: true,
      complete: (results: any) => {
        const dados = results.data.filter((row: any) => row.nomePessoa);
        const itemsFormatados = dados.map((row: any, idx: number) => ({
          id: `item-${idx}`,
          nomePessoa: row.nomePessoa || "",
          nomeEstabelecimento: row.nomeEstabelecimento || "",
          email: row.email || "",
          telefone: row.telefone || "",
          cidade: row.cidade || "",
          status: "pendente" as const,
        }));

        setItems(itemsFormatados);
        toast.success(`${itemsFormatados.length} registros carregados`);
        setLoading(false);
      },
      error: () => {
        toast.error("Erro ao processar arquivo");
        setLoading(false);
      },
    });
  };

  const handleImportar = async () => {
    if (items.length === 0) {
      toast.error("Nenhum item para importar");
      return;
    }

    setImportando(true);
    try {
      // Simular importação
      const novoItems = items.map((item, idx) => ({
        ...item,
        status: Math.random() > 0.1 ? ("sucesso" as const) : ("erro" as const),
        mensagem: Math.random() > 0.1 ? undefined : "Email duplicado",
      }));

      setItems(novoItems);
      const sucessos = novoItems.filter((i) => i.status === "sucesso").length;
      const erros = novoItems.filter((i) => i.status === "erro").length;

      toast.success(`${sucessos} registros importados com sucesso, ${erros} com erro`);
    } catch (error) {
      toast.error("Erro ao importar dados");
    } finally {
      setImportando(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ["nomePessoa", "nomeEstabelecimento", "email", "telefone", "cidade"],
      ["João Silva", "Silva Comércio LTDA", "joao@silva.com", "(11) 98765-4321", "São Paulo"],
      ["Maria Santos", "Santos Importação", "maria@santos.com", "(21) 98765-4321", "Rio de Janeiro"],
    ];

    const csv = template.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `template-${tipoImportacao}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template baixado com sucesso");
  };

  const sucessos = items.filter((i) => i.status === "sucesso").length;
  const erros = items.filter((i) => i.status === "erro").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Importação em Lote</h1>

      {/* Seleção de Tipo */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setTipoImportacao("leads");
            setItems([]);
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            tipoImportacao === "leads"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Importar Leads
        </button>
        <button
          onClick={() => {
            setTipoImportacao("clientes");
            setItems([]);
          }}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            tipoImportacao === "clientes"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Importar Clientes
        </button>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">Clique para selecionar arquivo</p>
              <p className="text-sm text-gray-600">ou arraste e solte aqui</p>
              <p className="text-xs text-gray-500 mt-2">Formatos aceitos: CSV, XLSX</p>
            </label>
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadTemplate} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Template
            </Button>
            {items.length > 0 && (
              <Button onClick={handleImportar} disabled={importando} className="gap-2">
                {importando ? "Importando..." : "Importar Dados"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-3xl font-bold">{items.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Importados com Sucesso</p>
              <p className="text-3xl font-bold text-green-600">{sucessos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Com Erro</p>
              <p className="text-3xl font-bold text-red-600">{erros}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela de Resultados */}
      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold">Estabelecimento</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Telefone</th>
                    <th className="text-left py-3 px-4 font-semibold">Cidade</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.nomePessoa}</td>
                      <td className="py-3 px-4">{item.nomeEstabelecimento}</td>
                      <td className="py-3 px-4 text-sm">{item.email}</td>
                      <td className="py-3 px-4">{item.telefone}</td>
                      <td className="py-3 px-4">{item.cidade}</td>
                      <td className="py-3 px-4">
                        {item.status === "sucesso" && (
                          <Badge className="bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                            <CheckCircle className="h-3 w-3" />
                            Sucesso
                          </Badge>
                        )}
                        {item.status === "erro" && (
                          <Badge className="bg-red-100 text-red-700 flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" />
                            Erro
                          </Badge>
                        )}
                        {item.status === "pendente" && (
                          <Badge className="bg-gray-100 text-gray-700">Pendente</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {items.some((i) => i.mensagem) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-semibold text-yellow-800 mb-2">Mensagens de Erro:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {items
                    .filter((i) => i.mensagem)
                    .map((item) => (
                      <li key={item.id}>
                        <strong>{item.nomePessoa}:</strong> {item.mensagem}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
