import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any;
  onSuccess?: () => void;
}

export default function ConvertLeadModal({ open, onOpenChange, lead, onSuccess }: ConvertLeadModalProps) {
  const [formData, setFormData] = useState({
    cpf: "",
    limiteCredito: "",
    condicaoPagamento: "30 dias",
  });

  const [loading, setLoading] = useState(false);
  const createClienteMutation = trpc.clientes.create.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.cpf.trim()) {
      toast.error("CPF é obrigatório");
      return false;
    }
    if (!formData.limiteCredito || parseFloat(formData.limiteCredito) <= 0) {
      toast.error("Limite de crédito deve ser maior que zero");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createClienteMutation.mutateAsync({
        nomePessoa: lead?.nomePessoa || "",
        nomeEstabelecimento: lead?.nomeEstabelecimento || "",
        cpf: formData.cpf,
        email: lead?.email || "",
        telefone: lead?.telefone || "",
        cidade: lead?.cidade || "",
        enderecCompleto: "",
        numero: "",
        bairro: "",
        cep: "",
        limiteCredito: parseFloat(formData.limiteCredito),
        condicaoPagamento: formData.condicaoPagamento,
      });
      toast.success("Lead convertido em cliente com sucesso!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao converter lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Converter Lead em Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm">
              <strong>Lead:</strong> {lead?.nomePessoa}
            </p>
            <p className="text-sm">
              <strong>Estabelecimento:</strong> {lead?.nomeEstabelecimento}
            </p>
          </div>

          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="123.456.789-00"
            />
          </div>

          <div>
            <Label htmlFor="limiteCredito">Limite de Crédito *</Label>
            <Input
              id="limiteCredito"
              name="limiteCredito"
              type="number"
              value={formData.limiteCredito}
              onChange={handleChange}
              placeholder="10000"
            />
          </div>

          <div>
            <Label htmlFor="condicaoPagamento">Condição de Pagamento</Label>
            <select
              id="condicaoPagamento"
              value={formData.condicaoPagamento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  condicaoPagamento: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="à vista">À Vista</option>
              <option value="15 dias">15 Dias</option>
              <option value="30 dias">30 Dias</option>
              <option value="60 dias">60 Dias</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Convertendo..." : "Converter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
