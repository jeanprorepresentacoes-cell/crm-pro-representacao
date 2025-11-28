import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ProdutoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto?: any;
  empresas?: any[];
  onSuccess?: () => void;
}

export default function ProdutoModal({ open, onOpenChange, produto, empresas = [], onSuccess }: ProdutoModalProps) {
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    descricao: produto?.descricao || "",
    codigoSku: produto?.codigoSku || "",
    empresaRepresentadaId: produto?.empresaRepresentadaId || "",
    categoria: produto?.categoria || "",
    precoBase: produto?.precoBase || "",
    ativo: produto?.ativo !== false,
  });

  const [loading, setLoading] = useState(false);
  const createProdutoMutation = trpc.produtos.create.useMutation();
  const updateProdutoMutation = trpc.produtos.update.useMutation();
  const { data: empresasData } = trpc.empresas.list.useQuery({ limit: 100 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: name === "empresaRepresentadaId" ? parseInt(value) : value }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast.error("Nome do produto é obrigatório");
      return false;
    }
    if (!formData.codigoSku.trim()) {
      toast.error("Código SKU é obrigatório");
      return false;
    }
    if (!formData.empresaRepresentadaId) {
      toast.error("Empresa é obrigatória");
      return false;
    }
    if (!formData.precoBase || parseFloat(formData.precoBase as string) <= 0) {
      toast.error("Preço base deve ser maior que zero");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        precoBase: parseFloat(formData.precoBase as string),
      };

      if (produto) {
        await updateProdutoMutation.mutateAsync({
          id: produto.id,
          data: submitData,
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProdutoMutation.mutateAsync(submitData);
        toast.success("Produto criado com sucesso!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Produto A"
              />
            </div>
            <div>
              <Label htmlFor="codigoSku">Código SKU *</Label>
              <Input
                id="codigoSku"
                name="codigoSku"
                value={formData.codigoSku}
                onChange={handleChange}
                placeholder="SKU-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresaRepresentadaId">Empresa *</Label>
              <Select
                value={formData.empresaRepresentadaId?.toString() || ""}
                onValueChange={(value) => handleSelectChange("empresaRepresentadaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasData?.map((empresa: any) => (
                    <SelectItem key={empresa.id} value={empresa.id.toString()}>
                      {empresa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                placeholder="Eletrônicos"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="precoBase">Preço Base *</Label>
            <Input
              id="precoBase"
              name="precoBase"
              type="number"
              step="0.01"
              value={formData.precoBase}
              onChange={handleChange}
              placeholder="1500.00"
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição do produto..."
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData((prev) => ({ ...prev, ativo: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="ativo" className="mb-0">Produto Ativo</Label>
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
