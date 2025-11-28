import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Lock, Bell, Palette } from "lucide-react";

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);

  const [perfil, setPerfil] = useState({
    nome: "Gabrielle Silveira",
    email: "gaby.bsb.gyn@gmail.com",
    telefone: "(61) 98765-4321",
    cargo: "Gerente de Vendas",
    departamento: "Vendas",
  });

  const [empresa, setEmpresa] = useState({
    nomeEmpresa: "CRM Pro Representações",
    cnpj: "12.345.678/0001-90",
    email: "contato@crmpro.com",
    telefone: "(61) 3000-1000",
    endereco: "Rua das Flores, 123",
    cidade: "Brasília",
    estado: "DF",
    website: "www.crmpro.com",
  });

  const [notificacoes, setNotificacoes] = useState({
    emailNovoLead: true,
    emailNovoCliente: true,
    emailOrcamentoEnviado: true,
    emailVendaConfirmada: true,
    emailComissaoPaga: true,
    notificacaoPush: true,
  });

  const [aparencia, setAparencia] = useState({
    tema: "claro",
    idioma: "pt-BR",
    formatoData: "DD/MM/YYYY",
    formatoMoeda: "R$",
  });

  const handleSavePerfil = async () => {
    setLoading(true);
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmpresa = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Dados da empresa atualizados com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar dados da empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificacoes = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferências de notificação atualizadas!");
    } catch (error) {
      toast.error("Erro ao atualizar notificações");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAparencia = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferências de aparência atualizadas!");
    } catch (error) {
      toast.error("Erro ao atualizar aparência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      {/* Abas */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "perfil"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab("empresa")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "empresa"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Empresa
        </button>
        <button
          onClick={() => setActiveTab("notificacoes")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "notificacoes"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Notificações
        </button>
        <button
          onClick={() => setActiveTab("aparencia")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "aparencia"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Aparência
        </button>
        <button
          onClick={() => setActiveTab("seguranca")}
          className={`px-4 py-2 font-semibold border-b-2 transition ${
            activeTab === "seguranca"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Segurança
        </button>
      </div>

      {/* Aba Perfil */}
      {activeTab === "perfil" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Perfil do Usuário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={perfil.nome}
                  onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={perfil.email}
                  onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={perfil.telefone}
                  onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={perfil.cargo}
                  onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                value={perfil.departamento}
                onChange={(e) => setPerfil({ ...perfil, departamento: e.target.value })}
              />
            </div>

            <Button onClick={handleSavePerfil} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aba Empresa */}
      {activeTab === "empresa" && (
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                <Input
                  id="nomeEmpresa"
                  value={empresa.nomeEmpresa}
                  onChange={(e) => setEmpresa({ ...empresa, nomeEmpresa: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={empresa.cnpj}
                  onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emailEmpresa">Email</Label>
                <Input
                  id="emailEmpresa"
                  type="email"
                  value={empresa.email}
                  onChange={(e) => setEmpresa({ ...empresa, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="telefoneEmpresa">Telefone</Label>
                <Input
                  id="telefoneEmpresa"
                  value={empresa.telefone}
                  onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={empresa.endereco}
                onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={empresa.cidade}
                  onChange={(e) => setEmpresa({ ...empresa, cidade: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={empresa.estado}
                  onChange={(e) => setEmpresa({ ...empresa, estado: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={empresa.website}
                  onChange={(e) => setEmpresa({ ...empresa, website: e.target.value })}
                />
              </div>
            </div>

            <Button onClick={handleSaveEmpresa} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aba Notificações */}
      {activeTab === "notificacoes" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Preferências de Notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "emailNovoLead", label: "Email ao receber novo lead" },
                { key: "emailNovoCliente", label: "Email ao converter lead em cliente" },
                { key: "emailOrcamentoEnviado", label: "Email ao enviar orçamento" },
                { key: "emailVendaConfirmada", label: "Email ao confirmar venda" },
                { key: "emailComissaoPaga", label: "Email ao receber comissão" },
                { key: "notificacaoPush", label: "Notificações push no navegador" },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={item.key}
                    checked={notificacoes[item.key as keyof typeof notificacoes]}
                    onChange={(e) =>
                      setNotificacoes({
                        ...notificacoes,
                        [item.key]: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor={item.key} className="mb-0">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveNotificacoes} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aba Aparência */}
      {activeTab === "aparencia" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferências de Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tema">Tema</Label>
                <Select value={aparencia.tema} onValueChange={(value) => setAparencia({ ...aparencia, tema: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claro">Claro</SelectItem>
                    <SelectItem value="escuro">Escuro</SelectItem>
                    <SelectItem value="auto">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="idioma">Idioma</Label>
                <Select value={aparencia.idioma} onValueChange={(value) => setAparencia({ ...aparencia, idioma: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formatoData">Formato de Data</Label>
                <Select value={aparencia.formatoData} onValueChange={(value) => setAparencia({ ...aparencia, formatoData: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="formatoMoeda">Formato de Moeda</Label>
                <Select value={aparencia.formatoMoeda} onValueChange={(value) => setAparencia({ ...aparencia, formatoMoeda: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="R$">R$ (Real)</SelectItem>
                    <SelectItem value="$">$ (Dólar)</SelectItem>
                    <SelectItem value="€">€ (Euro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveAparencia} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Aba Segurança */}
      {activeTab === "seguranca" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Alterar Senha</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <Input id="senhaAtual" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <Input id="novaSenha" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input id="confirmarSenha" type="password" placeholder="••••••••" />
                </div>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Autenticação de Dois Fatores</h3>
              <p className="text-sm text-gray-600 mb-3">
                Adicione uma camada extra de segurança à sua conta
              </p>
              <Button variant="outline">Ativar 2FA</Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Sessões Ativas</h3>
              <p className="text-sm text-gray-600 mb-3">
                Você tem 2 sessões ativas
              </p>
              <Button variant="outline" className="text-red-500 hover:text-red-700">
                Desconectar Todas as Sessões
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
