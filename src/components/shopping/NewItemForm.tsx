import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import NewSupplierModal from "./NewSupplierModal";
import { Item, Supplier } from "@/types";

interface NewItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  availableCategories: string[];
  availableSuppliers: Supplier[];
  onAddNewSupplier: () => void;
}

const units = ["Unidade", "Pacote", "Caixa", "Kg", "Grama", "Litro", "Metro"];

const NewItemForm = ({ open, onOpenChange, onAddItem, availableCategories, availableSuppliers, onAddNewSupplier }: NewItemFormProps) => {
  const { toast } = useToast();
  const { suppliers: databaseSuppliers, loading: suppliersLoading, createSupplier } = useSuppliers();
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: 1,
    unit: "Unidade",
    category: "",
    supplierId: "",
    noSupplier: false,
    requiresPhoto: false
  });
  const [loading, setLoading] = useState(false);

  // Combina fornecedores locais com fornecedores do banco de dados
  const allSuppliers = [
    ...availableSuppliers,
    ...databaseSuppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      category: supplier.category,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone
    }))
  ];

  // Remove duplicatas baseado no ID
  const uniqueSuppliers = allSuppliers.filter((supplier, index, self) => 
    index === self.findIndex(s => s.id === supplier.id)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "quantity" ? parseInt(value) || 0 : value 
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNoSupplierChange = (checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      noSupplier: checked,
      supplierId: checked ? "" : prev.supplierId
    }));
  };

  const handleRequiresPhotoChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, requiresPhoto: checked }));
  };

  const handleAddNewSupplier = () => {
    setIsNewSupplierModalOpen(true);
  };

  const handleSupplierAdded = async (supplierData: any) => {
    try {
      await createSupplier(supplierData);
      setIsNewSupplierModalOpen(false);
      toast({
        title: "Fornecedor adicionado",
        description: "Fornecedor criado com sucesso!",
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || formData.quantity <= 0) {
      toast({
        title: "Campos inválidos",
        description: "Preencha todos os campos obrigatórios corretamente",
        variant: "destructive"
      });
      return;
    }

    if (!formData.noSupplier && !formData.supplierId) {
      toast({
        title: "Fornecedor obrigatório",
        description: "Selecione um fornecedor ou marque que ainda não tem fornecedor",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const selectedSupplier = uniqueSuppliers.find(s => s.id === formData.supplierId);
      
      const newItemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        unit: formData.unit,
        category: formData.category,
        supplierId: formData.noSupplier ? undefined : formData.supplierId,
        supplierName: formData.noSupplier ? undefined : selectedSupplier?.name,
        needsSupplierSearch: formData.noSupplier,
        requiresPhoto: formData.requiresPhoto
      };
      
      await onAddItem(newItemData);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        quantity: 1,
        unit: "Unidade",
        category: "",
        supplierId: "",
        noSupplier: false,
        requiresPhoto: false
      });
      
      onOpenChange(false);
      
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar fornecedores pela categoria selecionada
  const filteredSuppliers = uniqueSuppliers.filter(
    supplier => !formData.category || supplier.category === formData.category
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do item *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nome do item"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Descrição detalhada do item"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => handleSelectChange("unit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
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

              {/* Checkbox para solicitar foto */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="requiresPhoto"
                    checked={formData.requiresPhoto}
                    onCheckedChange={handleRequiresPhotoChange}
                  />
                  <Label htmlFor="requiresPhoto" className="text-sm">
                    Solicitar foto atualizada do produto ao fornecedor
                  </Label>
                </div>
                
                {formData.requiresPhoto && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Quando este item for cotado, será solicitada uma foto atualizada ao fornecedor 
                      para controle de qualidade antes da confirmação do pedido.
                    </p>
                  </div>
                )}
              </div>

              {/* Seção de fornecedor */}
              <div className="space-y-2">
                <Label>Fornecedor</Label>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox 
                    id="noSupplier"
                    checked={formData.noSupplier}
                    onCheckedChange={handleNoSupplierChange}
                  />
                  <Label htmlFor="noSupplier" className="text-sm">
                    Ainda não tenho fornecedor (buscar automaticamente)
                  </Label>
                </div>

                {!formData.noSupplier && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Select 
                        value={formData.supplierId} 
                        onValueChange={(value) => handleSelectChange("supplierId", value)}
                        disabled={formData.noSupplier || suppliersLoading}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder={suppliersLoading ? "Carregando fornecedores..." : "Selecione um fornecedor"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSuppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleAddNewSupplier}
                        disabled={formData.noSupplier}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formData.category && filteredSuppliers.length === 0 && !suppliersLoading && (
                      <p className="text-sm text-muted-foreground">
                        Nenhum fornecedor cadastrado para a categoria "{formData.category}".
                      </p>
                    )}
                  </div>
                )}

                {formData.noSupplier && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      A ferramenta buscará automaticamente fornecedores na sua região usando Google e Google Maps, 
                      priorizando seu bairro e depois sua cidade.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || suppliersLoading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de novo fornecedor */}
      <NewSupplierModal
        open={isNewSupplierModalOpen}
        onOpenChange={setIsNewSupplierModalOpen}
        onAddSupplier={handleSupplierAdded}
        availableCategories={availableCategories}
      />
    </>
  );
};

export default NewItemForm;