import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, X, Plus } from "lucide-react";
import NewSupplierModal from "./NewSupplierModal";
import { Item, Supplier } from "@/types";

interface EditItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onUpdateItem: (updatedItem: Item) => void;
  availableCategories: string[];
  availableSuppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
}

const EditItemModal = ({
  open,
  onOpenChange,
  item,
  onUpdateItem,
  availableCategories,
  availableSuppliers,
  onAddSupplier
}: EditItemModalProps) => {
  const { toast } = useToast();
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    unit: "",
    category: "",
    lastPrice: "",
    supplierId: undefined as string | undefined
  });

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    console.log("EditItemModal: useEffect triggered - open:", open, "item:", item);
    
    if (item && open) {
      console.log("EditItemModal: Setting form data for item:", item);
      setFormData({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        lastPrice: item.lastPrice?.toString() || "",
        supplierId: item.supplierId || undefined
      });
    } else if (!open) {
      // Reset form when modal closes
      console.log("EditItemModal: Resetting form data");
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        unit: "",
        category: "",
        lastPrice: "",
        supplierId: undefined
      });
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("EditItemModal: handleSubmit called", formData);
    
    if (!item) {
      console.error("EditItemModal: No item to update");
      return;
    }

    if (!formData.name.trim() || !formData.category || formData.quantity <= 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios corretamente.",
        variant: "destructive"
      });
      return;
    }

    const selectedSupplier = availableSuppliers.find(s => s.id === formData.supplierId);

    const updatedItem: Item = {
      ...item,
      name: formData.name.trim(),
      description: formData.description.trim(),
      quantity: formData.quantity,
      unit: formData.unit.trim(),
      category: formData.category,
      lastPrice: formData.lastPrice ? parseFloat(formData.lastPrice) : undefined,
      supplierId: formData.supplierId || undefined,
      supplierName: selectedSupplier?.name || undefined,
      needsSupplierSearch: !formData.supplierId
    };

    console.log("EditItemModal: updating item", updatedItem);

    onUpdateItem(updatedItem);
    onOpenChange(false);

    toast({
      title: "Item atualizado",
      description: `${updatedItem.name} foi atualizado com sucesso!`
    });
  };

  const handleCancel = () => {
    console.log("EditItemModal: cancel clicked");
    onOpenChange(false);
  };

  const handleSupplierSelect = (value: string) => {
    if (value === "new-supplier") {
      setIsNewSupplierModalOpen(true);
    } else {
      setFormData(prev => ({ ...prev, supplierId: value || undefined }));
    }
  };

  const handleNewSupplierAdded = (newSupplier: Supplier) => {
    onAddSupplier(newSupplier);
    setFormData(prev => ({ ...prev, supplierId: newSupplier.id }));
    setIsNewSupplierModalOpen(false);
    
    toast({
      title: "Fornecedor adicionado",
      description: `${newSupplier.name} foi adicionado com sucesso!`
    });
  };

  console.log("EditItemModal: rendering with open =", open, "item =", item);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
            <DialogDescription>
              Atualize as informações do item na lista de compras.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Item *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Papel A4"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição detalhada do item"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Quantidade *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unidade</Label>
                <Input
                  id="edit-unit"
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="Ex: Pacote, Unidade, Caixa"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lastPrice">Último Preço (R$)</Label>
                <Input
                  id="edit-lastPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.lastPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastPrice: e.target.value }))}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Fornecedor</Label>
                <Select 
                  value={formData.supplierId || undefined} 
                  onValueChange={handleSupplierSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new-supplier" className="text-blue-600 font-medium">
                      <div className="flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Fornecedor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <NewSupplierModal
        open={isNewSupplierModalOpen}
        onOpenChange={setIsNewSupplierModalOpen}
        onAddSupplier={handleNewSupplierAdded}
        availableCategories={availableCategories}
      />
    </>
  );
};

export default EditItemModal;