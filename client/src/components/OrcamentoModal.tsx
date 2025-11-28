import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface OrcamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento?: any;
  onSuccess?: () => void;
}

interface ItemOrcamento {
  id?: string;
  nomeProduto: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  ordem: number;
}

export default function OrcamentoModal({ open, onOpenChange, orcamento, onSuccess }: OrcamentoModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clienteId: orcamento?.clienteId || "",
    empresaRepresentadaId: orcamento?.empresaRepresentadaId || "",
    dataValidade: orcamento?.dataValidade || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    descontoPercentual: orcamento?.descontoPercentual || "",
    descontoValor: orcamento?.descontoValor || "",
    observacoes: orcamento?.observacoes || "",
    condicoesPagamento: orcamento?.condicoesPagamento || "",
  });

  const [itens, setItens] = useState<ItemOrcamento[]>(orcamento?.itens || []);
  const [loading, setLoading] = useState(false);

  const { data: clientes } = trpc.clientes.list.useQuery({ limit: 100 });
  const { data: empresas } = trpc.empresas.list.useQuery({ limit: 100 });
  const createOrcamentoMutation = trpc.orcamentos.create.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || value }));
  };

  const addItem = () => {
    const newItem: ItemOrcamento = {
      id: Math.random().toString(),
      nomeProduto: "",
      descricao: "",
      quantidade: 1,
      valorUnitario: 0,
      valorTotal: 0,
      ordem: itens.length + 1,
    };
    setItens([...itens, newItem]);
  };

  const removeItem = (id: string | undefined) => {
    setItens(itens.filter((item) => item.id !== id));
  };

  const updateItem = (id: string | undefined, field: string, value: any) => {
    setItens(
      itens.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantidade" || field === "valorUnitario") {
            updated.valorTotal = updated.quantidade * updated.valorUnitario;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotal = () => {
    let subtotal = itens.reduce((sum, item) => sum + item.valorTotal, 0);
    if (formData.descontoPercentual) {
      subtotal = subtotal * (1 - parseFloat(formData.descontoPercentual as string) / 100);
    } else if (formData.descontoValor) {
      subtotal -= parseFloat(formData.descontoValor as string);
    }
    return subtotal;
  };

  const validateForm = () => {
    if (!formData.clienteId) {
      toast.error("Cliente é obrigatório");
      return false;
    }
    if (!formData.empresaRepresentadaId) {
      toast.error("Empresa é obrigatória");
      return false;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createOrcamentoMutation.mutateAsync({
        ...formData,
        clienteId: parseInt(formData.clienteId as string),
        empresaRepresentadaId: parseInt(formData.empresaRepresentadaId as string),
        itens,
      });
      toast.success("Orçamento criado com sucesso!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar orçamento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Orçamento - Etapa {step} de 4</DialogTitle>
        </DialogHeader>

        {/* Etapa 1: Cliente */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="clienteId">Selecione o Cliente *</Label>
              <Select value={formData.clienteId?.toString() || ""} onValueChange={(value) => handleSelectChange("clienteId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((cliente: any) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nomePessoa} - {cliente.nomeEstabelecimento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Etapa 2: Empresa */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="empresaRepresentadaId">Selecione a Empresa *</Label>
              <Select value={formData.empresaRepresentadaId?.toString() || ""} onValueChange={(value) => handleSelectChange("empresaRepresentadaId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas?.map((empresa: any) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Etapa 3: Produtos */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Itens do Orçamento</h3>
              <Button onClick={addItem} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Produto</th>
                    <th className="text-left py-2 px-2">Descrição</th>
                    <th className="text-right py-2 px-2">Qtd</th>
                    <th className="text-right py-2 px-2">V. Unit.</th>
                    <th className="text-right py-2 px-2">V. Total</th>
                    <th className="text-center py-2 px-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {itens.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-2">
                        <Input
                          value={item.nomeProduto}
                          onChange={(e) => updateItem(item.id, "nomeProduto", e.target.value)}
                          placeholder="Nome do produto"
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          value={item.descricao}
                          onChange={(e) => updateItem(item.id, "descricao", e.target.value)}
                          placeholder="Descrição"
                          className="text-sm"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => updateItem(item.id, "quantidade", parseFloat(e.target.value))}
                          className="text-sm text-right"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.valorUnitario}
                          onChange={(e) => updateItem(item.id, "valorUnitario", parseFloat(e.target.value))}
                          className="text-sm text-right"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-semibold">
                        R$ {item.valorTotal.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 text-right">
                  <div className="text-lg">
                    Subtotal: <span className="font-semibold">R$ {itens.reduce((sum, item) => sum + item.valorTotal, 0).toFixed(2)}</span>
                  </div>
                  <div className="text-lg">
                    Total: <span className="font-semibold text-green-600">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Etapa 4: Dados Adicionais */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataValidade">Data de Validade</Label>
                <Input
                  id="dataValidade"
                  name="dataValidade"
                  type="date"
                  value={formData.dataValidade}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="descontoPercentual">Desconto (%)</Label>
                <Input
                  id="descontoPercentual"
                  name="descontoPercentual"
                  type="number"
                  step="0.01"
                  value={formData.descontoPercentual}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="condicoesPagamento">Condições de Pagamento</Label>
              <Textarea
                id="condicoesPagamento"
                name="condicoesPagamento"
                value={formData.condicoesPagamento}
                onChange={handleChange}
                placeholder="Condições de pagamento..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : onOpenChange(false))}
          >
            {step === 1 ? "Cancelar" : "Anterior"}
          </Button>
          {step < 4 && (
            <Button onClick={() => setStep(step + 1)}>
              Próximo
            </Button>
          )}
          {step === 4 && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Salvando..." : "Criar Orçamento"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
