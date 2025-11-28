import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("vendas");
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [representante, setRepresentante] = useState("todos");

  const handleExportarPDF = () => {
    toast.success("Relatório em PDF gerado com sucesso!");
  };

  const handleExportarExcel = () => {
    toast.success("Relatório em Excel exportado com sucesso!");
  };

  const relatorios = [
    {
      id: "vendas",
      nome: "Relatório de Vendas",
      descricao: "Vendas por período, representante e empresa",
      icon: "📊",
    },
    {
      id: "leads",
      nome: "Relatório de Leads",
      descricao: "Leads por status, fonte e representante",
      icon: "📈",
    },
    {
      id: "clientes",
      nome: "Relatório de Clientes",
      descricao: "Clientes por status, cidade e representante",
      icon: "👥",
    },
    {
      id: "comissoes",
      nome: "Relatório de Comissões",
      descricao: "Comissões por representante e período",
      icon: "💰",
    },
    {
      id: "orcamentos",
      nome: "Relatório de Orçamentos",
      descricao: "Orçamentos por status, empresa e período",
      icon: "📋",
    },
    {
      id: "performance",
      nome: "Relatório de Performance",
      descricao: "Performance de vendas e conversão de leads",
      icon: "🎯",
    },
  ];

  const dadosRelatorio = [
    { mes: "Janeiro", vendas: 45000, leads: 120, clientes: 25 },
    { mes: "Fevereiro", vendas: 52000, leads: 135, clientes: 32 },
    { mes: "Março", vendas: 48000, leads: 110, clientes: 28 },
    { mes: "Abril", vendas: 61000, leads: 150, clientes: 40 },
    { mes: "Maio", vendas: 55000, leads: 125, clientes: 35 },
    { mes: "Junho", vendas: 58000, leads: 140, clientes: 38 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      {/* Seleção de Relatório */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatorios.map((relatorio) => (
          <Card
            key={relatorio.id}
            className={`cursor-pointer transition ${
              tipoRelatorio === relatorio.id ? "border-blue-500 border-2" : ""
            }`}
            onClick={() => setTipoRelatorio(relatorio.id)}
          >
            <CardContent className="pt-6">
              <div className="text-4xl mb-2">{relatorio.icon}</div>
              <h3 className="font-semibold">{relatorio.nome}</h3>
              <p className="text-sm text-gray-600">{relatorio.descricao}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Este Trimestre</SelectItem>
                  <SelectItem value="semestre">Este Semestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                  <SelectItem value="customizado">Customizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodo === "customizado" && (
              <>
                <div>
                  <label className="text-sm font-semibold">Data Início</label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Data Fim</label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-semibold">Representante</label>
              <Select value={representante} onValueChange={setRepresentante}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="joao">João Silva</SelectItem>
                  <SelectItem value="maria">Maria Santos</SelectItem>
                  <SelectItem value="pedro">Pedro Costa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Relatório */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dados do Relatório</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExportarPDF} className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button size="sm" variant="outline" onClick={handleExportarExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Período</th>
                  <th className="text-right py-3 px-4 font-semibold">Vendas</th>
                  <th className="text-right py-3 px-4 font-semibold">Leads</th>
                  <th className="text-right py-3 px-4 font-semibold">Clientes</th>
                  <th className="text-right py-3 px-4 font-semibold">Taxa Conversão</th>
                </tr>
              </thead>
              <tbody>
                {dadosRelatorio.map((linha, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{linha.mes}</td>
                    <td className="py-3 px-4 text-right font-semibold">R$ {linha.vendas.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{linha.leads}</td>
                    <td className="py-3 px-4 text-right">{linha.clientes}</td>
                    <td className="py-3 px-4 text-right">
                      {((linha.clientes / linha.leads) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold">R$ {dadosRelatorio.reduce((sum, d) => sum + d.vendas, 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Leads</p>
              <p className="text-2xl font-bold">{dadosRelatorio.reduce((sum, d) => sum + d.leads, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold">{dadosRelatorio.reduce((sum, d) => sum + d.clientes, 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa Média Conversão</p>
              <p className="text-2xl font-bold">
                {(
                  (dadosRelatorio.reduce((sum, d) => sum + d.clientes, 0) /
                    dadosRelatorio.reduce((sum, d) => sum + d.leads, 0)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
