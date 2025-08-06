import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Import, Plus, Settings, Edit, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import NewItemForm from "@/components/shopping/NewItemForm";
import ImportFileModal from "@/components/shopping/ImportFileModal";
import CategoryModal from "@/components/shopping/CategoryModal";
import SupplierSearchModal from "@/components/shopping/SupplierSearchModal";
import EditItemModal from "@/components/shopping/EditItemModal";
import DeleteItemDialog from "@/components/shopping/DeleteItemDialog";
import GoogleSuppliersModal from "@/components/suppliers/GoogleSuppliersModal";
import { supplierSearchService, SupplierSearchResult } from "@/services/supplierSearchService";
import { useToast } from "@/hooks/use-toast";
import { Item, Supplier } from "@/types";
import ShoppingListHeader from "@/components/shopping/ShoppingListHeader";
import { useItems } from "@/hooks/useItems";
import { useSuppliers } from "@/hooks/useSuppliers";

const ShoppingList = () => {
  const { toast } = useToast();
  const { items, loading: itemsLoading, createItem, updateItem, deleteItem } = useItems();
  const { suppliers, getUniqueCategories } = useSuppliers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSupplierSearchModalOpen, setIsSupplierSearchModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGoogleSuppliersModalOpen, setIsGoogleSuppliersModalOpen] = useState(false);
  const [selectedItemCategory, setSelectedItemCategory] = useState("");
  const [supplierSearchResults, setSupplierSearchResults] = useState<SupplierSearchResult[]>([]);
  const [searchingItem, setSearchingItem] = useState<Item | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [supplierSearchLoading, setSupplierSearchLoading] = useState(false);
  
  // Categorias base/padrão
  const baseCategorias = [
    "Material de Escritório",
    "Eletrônicos", 
    "Material de Limpeza",
    "Alimentos",
    "Embalagens"
  ];

  // Estado para categorias dinâmicas (combinando base + fornecedores + personalizadas)
  const [categories, setCategories] = useState<string[]>(baseCategorias);

  // Atualizar categorias sempre que a lista de fornecedores mudar
  useEffect(() => {
    const supplierCategories = getUniqueCategories();
    const allCategories = [...new Set([...baseCategorias, ...supplierCategories])].sort();
    setCategories(allCategories);
    
    console.log('Categorias atualizadas:', allCategories);
    console.log('Categorias dos fornecedores:', supplierCategories);
  }, [suppliers, getUniqueCategories]);

  // Função para adicionar novo item - agora usa o banco de dados
  const handleAddItem = useCallback(async (newItemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newItem = await createItem(newItemData);
      
      // Se o item precisa de busca de fornecedor, inicia a busca automaticamente
      if (newItemData.needsSupplierSearch) {
        await searchSuppliersForItem(newItem);
      }
      
      toast({
        title: "Item adicionado",
        description: `${newItemData.name} foi adicionado com sucesso à lista!`
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
    }
  }, [createItem]);

  // Função para buscar fornecedores para um item
  const searchSuppliersForItem = async (item: Item) => {
    setSearchingItem(item);
    setSupplierSearchLoading(true);
    setIsSupplierSearchModalOpen(true);

    try {
      const location = await supplierSearchService.getUserLocation();
      if (location) {
        const results = await supplierSearchService.searchSuppliers(
          item.category,
          location,
          item.name
        );
        setSupplierSearchResults(results);
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar fornecedores automaticamente.",
        variant: "destructive"
      });
    } finally {
      setSupplierSearchLoading(false);
    }
  };

  // Função para selecionar um fornecedor da busca
  const handleSelectSupplierFromSearch = async (supplier: SupplierSearchResult) => {
    if (searchingItem) {
      try {
        await updateItem(searchingItem.id, {
          supplierName: supplier.name,
          needsSupplierSearch: false 
        });
        
        toast({
          title: "Fornecedor selecionado",
          description: `${supplier.name} foi vinculado ao item ${searchingItem.name}.`
        });
      } catch (error) {
        console.error('Erro ao atualizar item:', error);
      }
    }
    setIsSupplierSearchModalOpen(false);
    setSearchingItem(null);
  };

  // Função para adicionar fornecedor da busca como novo fornecedor
  const handleAddSupplierFromSearch = (supplier: SupplierSearchResult) => {
    // Esta funcionalidade pode ser implementada quando o hook useSuppliers estiver integrado
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A adição de novos fornecedores será implementada em breve."
    });
    
    setIsSupplierSearchModalOpen(false);
    setSearchingItem(null);
  };

  // Função para importar itens
  const handleImportItems = (importedItems: Item[]) => {
    // Implementar importação via banco de dados
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A importação de itens será implementada em breve."
    });
  };

  // Função para atualizar categorias (agora combina com as dos fornecedores)
  const handleCategoriesUpdate = (updatedCategories: string[]) => {
    const supplierCategories = getUniqueCategories();
    const allCategories = [...new Set([...updatedCategories, ...supplierCategories])].sort();
    setCategories(allCategories);
  };

  // Função para editar item
  const handleEditItem = (item: Item) => {
    console.log("ShoppingList: handleEditItem called with item", item);
    setEditingItem(item);
    setIsEditItemModalOpen(true);
  };

  // Função para atualizar item
  const handleUpdateItem = async (updatedItemData: Item) => {
    try {
      await updateItem(updatedItemData.id, updatedItemData);
      setEditingItem(null);
      setIsEditItemModalOpen(false);
      
      toast({
        title: "Item atualizado",
        description: "Item foi atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  // Função para excluir item
  const handleDeleteItem = (item: Item) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      setDeletingItem(null);
      
      toast({
        title: "Item excluído",
        description: "Item foi removido da lista com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  // Filtragem de itens com base na pesquisa
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  if (itemsLoading) {
    return (
      <div className="space-y-6">
        <ShoppingListHeader />
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Carregando itens...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ShoppingListHeader />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Itens</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar itens..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Categorias
                </Button>
                <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                  <Import className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button onClick={() => setIsNewItemModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Item
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                  <TableHead className="hidden xl:table-cell">Marca</TableHead>
                  <TableHead className="hidden xl:table-cell">Modelo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead className="hidden lg:table-cell">Unidade</TableHead>
                  <TableHead className="hidden xl:table-cell">Preço Est.</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[150px] truncate" title={item.name}>
                        {item.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate" title={item.description}>
                        {item.description || '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs">
                        {item.brand || '-'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs">
                        {item.model || '-'}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        <div>
                          <div>{item.quantity || '-'}</div>
                          <div className="text-muted-foreground">{item.unit || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-xs">
                        {item.unit || '-'}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs">
                        {item.lastPrice ? (
                          formatCurrency(item.lastPrice)
                        ) : (
                          <span className="text-muted-foreground">Não cotado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.needsSupplierSearch ? (
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => searchSuppliersForItem(item)}
                            >
                              Buscar Local
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedItemCategory(item.category);
                                setIsGoogleSuppliersModalOpen(true);
                              }}
                            >
                              Google Maps
                            </Button>
                          </div>
                        ) : item.supplierName ? (
                          <span className="text-sm">{item.supplierName}</span>
                        ) : (
                          <div className="flex gap-1">
                            <span className="text-sm text-muted-foreground">Sem fornecedor</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedItemCategory(item.category);
                                setIsGoogleSuppliersModalOpen(true);
                              }}
                            >
                              Buscar
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteItem(item)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      Nenhum item encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de novo item */}
      <NewItemForm
        open={isNewItemModalOpen}
        onOpenChange={setIsNewItemModalOpen}
        onAddItem={handleAddItem}
        availableCategories={categories}
        availableSuppliers={suppliers}
        onAddNewSupplier={() => {
          setIsNewItemModalOpen(false);
        }}
      />

      {/* Modal de importação */}
      <ImportFileModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onImportComplete={handleImportItems}
      />

      {/* Modal de categorias */}
      <CategoryModal
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
        onCategoriesUpdate={handleCategoriesUpdate}
        existingCategories={categories}
      />

      {/* Modal de busca de fornecedores */}
      <SupplierSearchModal
        open={isSupplierSearchModalOpen}
        onOpenChange={setIsSupplierSearchModalOpen}
        searchResults={supplierSearchResults}
        onSelectSupplier={handleSelectSupplierFromSearch}
        onAddAsNewSupplier={handleAddSupplierFromSearch}
        itemName={searchingItem?.name || ""}
        loading={supplierSearchLoading}
      />

      {/* Modal de edição de item */}
      <EditItemModal
        open={isEditItemModalOpen}
        onOpenChange={(open) => {
          setIsEditItemModalOpen(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        item={editingItem}
        onUpdateItem={handleUpdateItem}
        availableCategories={categories}
        availableSuppliers={suppliers}
        onAddSupplier={(supplier) => {
          // Implementar adição de fornecedor
        }}
      />

      {/* Dialog de exclusão de item */}
      <DeleteItemDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        item={deletingItem}
        onDeleteItem={handleConfirmDelete}
      />

      {/* Modal de busca Google Places para itens */}
      <GoogleSuppliersModal
        open={isGoogleSuppliersModalOpen}
        onOpenChange={setIsGoogleSuppliersModalOpen}
        defaultCategory={selectedItemCategory}
        onCreateSupplier={(supplier) => {
          toast({
            title: "Fornecedor adicionado",
            description: `${supplier.name} foi adicionado aos seus fornecedores.`
          });
          setIsGoogleSuppliersModalOpen(false);
        }}
      />
    </div>
  );
};

export default ShoppingList;