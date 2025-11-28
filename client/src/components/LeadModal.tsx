import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: any;
  onSuccess?: () => void;
}

export default function LeadModal({ open, onOpenChange, lead, onSuccess }: LeadModalProps) {
  const [formData, setFormData] = useState({
    nomePessoa: lead?.nomePessoa || "",
    nomeEstabelecimento: lead?.nomeEstabelecimento || "",
    cidade: lead?.cidade || "",
    telefone: lead?.telefone || "",
    email: lead?.email || "",
    observacoes: lead?.observacoes || "",
    fonteLead: lead?.fonteLead || "outro",
    dataUltimoContato: lead?.dataUltimoContato || new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const createLeadMutation = trpc.leads.create.useMutation();
  const updateLeadMutation = trpc.leads.update.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({ ...prev, telefone: formatted }));
  };

  const validateForm = () => {
    if (!formData.nomePessoa.trim()) {
      toast.error("Nome da pessoa é obrigatório");
      return false;
    }
    if (!formData.nomeEstabelecimento.trim()) {
      toast.error("Nome do estabelecimento é obrigatório");
      return false;
    }
    if (!formData.cidade.trim()) {
      toast.error("Cidade é obrigatória");
      return false;
    }
    if (!formData.telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return false;
    }
    if (formData.email && !formData.email.includes("@")) {
      toast.error("Email inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (lead) {
        await updateLeadMutation.mutateAsync({
          id: lead.id,
          data: formData,
        });
        toast.success("Lead atualizado com sucesso!");
      } else {
        await createLeadMutation.mutateAsync(formData);
        toast.success("Lead criado com sucesso!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead ? "Editar Lead" : "Novo Lead"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nomePessoa">Nome da Pessoa *</Label>
              <Input
                id="nomePessoa"
                name="nomePessoa"
                value={formData.nomePessoa}
                onChange={handleChange}
                placeholder="João Silva"
              />
            </div>
            <div>
              <Label htmlFor="nomeEstabelecimento">Estabelecimento *</Label>
              <Input
                id="nomeEstabelecimento"
                name="nomeEstabelecimento"
                value={formData.nomeEstabelecimento}
                onChange={handleChange}
                placeholder="Silva Comércio"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="São Paulo"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                placeholder="(11) 98765-4321"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao@silva.com"
              />
            </div>
            <div>
              <Label htmlFor="fonteLead">Fonte do Lead</Label>
              <Select value={formData.fonteLead} onValueChange={(value) => handleSelectChange("fonteLead", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="evento">Evento</SelectItem>
                  <SelectItem value="cold_call">Cold Call</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Adicione observações sobre o lead..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
