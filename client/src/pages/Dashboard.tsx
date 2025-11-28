import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import { TrendingUp, Users, ShoppingCart, FileText, DollarSign, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");

  // Dados de vendas por mês
  const vendasPorMes = [
    { mes: "Jan", vendas: 4000, leads: 120, clientes: 25, comissao: 400 },
    { mes: "Fev", vendas: 5200, leads: 135, clientes: 32, comissao: 520 },
    { mes: "Mar", vendas: 4800, leads: 110, clientes: 28, comissao: 480 },
    { mes: "Abr", vendas: 6100, leads: 150, clientes: 40, comissao: 610 },
    { mes: "Mai", vendas: 5500, leads: 125, clientes: 35, comissao: 550 },
    { mes: "Jun", vendas: 5800, leads: 140, clientes: 38, comissao: 580 },
  ];

  // Dados de distribuição de leads
  const distribuicaoLeads = [
    { name: "Novo", value: 45, fill: "#0ea5e9" },
    { name: "Em Contato", value: 30, fill: "#06b6d4" },
    { name: "Qualificado", value: 20, fill: "#14b8a6" },
    { name: "Perdido", value: 5, fill: "#f43f5e" },
  ];

  // Top 5 clientes
  const topClientes = [
    { nome: "Cliente A", vendas: 12500 },
    { nome: "Cliente B", vendas: 9800 },
    { nome: "Cliente C", vendas: 8200 },
    { nome: "Cliente D", vendas: 7100 },
    { nome: "Cliente E", vendas: 5900 },
  ];

  // Dados de funil de conversão
  const funilConversao = [
    { stage: "Leads", value: 145, fill: "#0ea5e9" },
    { stage: "Qualificados", value: 95, fill: "#8b5cf6" },
    { stage: "Orçamentos", value: 62, fill: "#ec4899" },
    { stage: "Vendas", value: 38, fill: "#10b981" },
  ];

  const KPICard = ({ icon: Icon, title, value, change, color }: any) => (
    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-0 group-hover:opacity-20 rounded-full blur-2xl transition-all duration-500" style={{ background: `linear-gradient(135deg, var(--color-${color}), transparent)` }}></div>
      <CardContent className="pt-6 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-2 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-2 font-semibold">
              <ArrowUpRight className="h-3 w-3" />
              {change} desde o mês passado
            </div>
          </div>
          <div className={`p-4 rounded-xl ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow-2xl border border-gray-700 backdrop-blur-sm">
          <p className="font-bold text-sm">{payload[0].payload.mes || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao seu painel de controle</p>
        </div>
        <div className="flex gap-2">
          {["semana", "mes", "trimestre"].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              onClick={() => setSelectedPeriod(period)}
              className="capitalize font-semibold"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards com Animações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          icon={Users}
          title="Total de Leads"
          value="145"
          change="12%"
          color="bg-cyan-500"
        />
        <KPICard
          icon={ShoppingCart}
          title="Total de Clientes"
          value="89"
          change="5%"
          color="bg-emerald-500"
        />
        <KPICard
          icon={TrendingUp}
          title="Vendas do Mês"
          value="R$ 45.200"
          change="8%"
          color="bg-violet-500"
        />
        <KPICard
          icon={FileText}
          title="Orçamentos Pendentes"
          value="23"
          change="3%"
          color="bg-orange-500"
        />
        <KPICard
          icon={DollarSign}
          title="Comissão a Receber"
          value="R$ 4.520"
          change="15%"
          color="bg-pink-500"
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Área - Vendas por Mês */}
        <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
              </div>
              Vendas por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={vendasPorMes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="mes" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="vendas"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVendas)"
                  isAnimationActive
                  animationDuration={1500}
                  filter="url(#shadow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição de Leads */}
        <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              Distribuição de Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={distribuicaoLeads}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {distribuicaoLeads.map((entry: any, index: number): any => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Top 5 Clientes */}
        <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-violet-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-violet-600" />
              </div>
              Top 5 Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topClientes} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="nome" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="vendas"
                  fill="url(#colorBar)"
                  radius={[12, 12, 0, 0]}
                  animationDuration={1200}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Funil - Conversão */}
        <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              Funil de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {funilConversao.map((item: any, index: number) => (
                <div key={index} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition">{item.stage}</span>
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-gray-200 transition">
                      {item.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{
                        width: `${(item.value / funilConversao[0].value) * 100}%`,
                        backgroundColor: item.fill,
                        boxShadow: `0 0 20px ${item.fill}40`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    {((item.value / funilConversao[0].value) * 100).toFixed(1)}% de conversão
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tipo: "Novo Lead", descricao: "João Silva - Ha 2 horas", cor: "bg-cyan-100 text-cyan-700", icon: "🔵" },
              { tipo: "Orçamento Enviado", descricao: "ABC Comércio - Ha 4 horas", cor: "bg-amber-100 text-amber-700", icon: "📄" },
              { tipo: "Venda Confirmada", descricao: "XYZ Ltda - Ha 6 horas", cor: "bg-emerald-100 text-emerald-700", icon: "✅" },
              { tipo: "Cliente Criado", descricao: "Silva Comércio - Ha 1 dia", cor: "bg-violet-100 text-violet-700", icon: "👤" },
            ].map((atividade: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 border border-transparent hover:border-gray-200 group cursor-pointer transform hover:scale-102"
              >
                <div className="text-2xl">{atividade.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-gray-900">{atividade.tipo}</p>
                  <p className="text-sm text-gray-600">{atividade.descricao}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${atividade.cor}`}>
                  {atividade.tipo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
