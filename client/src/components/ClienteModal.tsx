import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: any;
  onSuccess?: () => void;
}

export default function ClienteModal({ open, onOpenChange, cliente, onSuccess }: ClienteModalProps) {
  const [formData, setFormData] = useState({
    nomePessoa: cliente?.nomePessoa || "",
    nomeEstabelecimento: cliente?.nomeEstabelecimento || "",
    cnpj: cliente?.cnpj || "",
    cpf: cliente?.cpf || "",
    cidade: cliente?.cidade || "",
    telefone: cliente?.telefone || "",
    email: cliente?.email || "",
    enderecCompleto: cliente?.enderecCompleto || "",
    numero: cliente?.numero || "",
    complemento: cliente?.complemento || "",
    bairro: cliente?.bairro || "",
    cep: cliente?.cep || "",
    observacoes: cliente?.observacoes || "",
    status: cliente?.status || "ativo",
    limiteCredito: cliente?.limiteCredito || "",
    condicaoPagamento: cliente?.condicaoPagamento || "30 dias",
  });

  const [loading, setLoading] = useState(false);
  const createClienteMutation = trpc.clientes.create.useMutation();
  const updateClienteMutation = trpc.clientes.update.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, cnpj: formatCNPJ(e.target.value) }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, cep: formatCEP(e.target.value) }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }));
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
    if (!formData.email.includes("@")) {
      toast.error("Email inválido");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (cliente) {
        await updateClienteMutation.mutateAsync({
          id: cliente.id,
          data: formData,
        });
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await createClienteMutation.mutateAsync(formData);
        toast.success("Cliente criado com sucesso!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Informações Básicas</h3>
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
          </div>

          {/* Documentos */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Documentos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleCNPJChange}
                  placeholder="12.345.678/0001-90"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="123.456.789-00"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@silva.com"
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
          </div>

          {/* Endereço */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="enderecCompleto">Endereço Completo *</Label>
                <Input
                  id="enderecCompleto"
                  name="enderecCompleto"
                  value={formData.enderecCompleto}
                  onChange={handleChange}
                  placeholder="Rua das Flores"
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="123"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Apto 101"
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Centro"
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleCEPChange}
                  placeholder="01310-100"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Localização</h3>
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
          </div>

          {/* Informações Comerciais */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Informações Comerciais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="limiteCredito">Limite de Crédito</Label>
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
                <Select value={formData.condicaoPagamento} onValueChange={(value) => handleSelectChange("condicaoPagamento", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="à vista">À Vista</SelectItem>
                    <SelectItem value="15 dias">15 Dias</SelectItem>
                    <SelectItem value="30 dias">30 Dias</SelectItem>
                    <SelectItem value="60 dias">60 Dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Status</h3>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Adicione observações sobre o cliente..."
              rows={3}
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
