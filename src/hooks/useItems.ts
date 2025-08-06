
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Item } from '@/types';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const mapItemFromDB = (dbItem: any): Item => {
    return {
      id: dbItem.id,
      name: dbItem.name,
      description: dbItem.description || '',
      quantity: dbItem.quantity || 1,
      unit: dbItem.unit_of_measure || dbItem.unit || 'unidade',
      category: dbItem.category || '',
      brand: dbItem.brand,
      model: dbItem.model,
      sku: dbItem.sku,
      barcode: dbItem.barcode,
      unit_of_measure: dbItem.unit_of_measure || dbItem.unit || 'unidade',
      specifications: dbItem.specifications,
      images: dbItem.images,
      tags: dbItem.tags,
      min_quantity: dbItem.min_quantity || dbItem.quantity || 1,
      max_quantity: dbItem.max_quantity,
      estimated_price: dbItem.estimated_price || dbItem.last_price,
      currency: dbItem.currency || 'BRL',
      preferred_suppliers: dbItem.preferred_suppliers || (dbItem.supplier_id ? [dbItem.supplier_id] : []),
      lastPrice: dbItem.estimated_price || dbItem.last_price,
      supplierId: dbItem.supplier_id,
      supplierName: dbItem.supplier_name || '',
      needsSupplierSearch: dbItem.needs_supplier_search || false,
      requiresPhoto: dbItem.requires_photo || false,
      photoUrl: dbItem.photo_url,
      createdAt: dbItem.created_at,
      updatedAt: dbItem.updated_at,
    };
  };

  const mapItemToDB = (item: Partial<Item>) => {
    return {
      name: item.name,
      description: item.description,
      quantity: item.quantity || item.min_quantity || 1,
      unit_of_measure: item.unit_of_measure || item.unit || 'unidade',
      category: item.category,
      brand: item.brand,
      model: item.model,
      sku: item.sku,
      barcode: item.barcode,
      specifications: item.specifications,
      images: item.images,
      tags: item.tags,
      min_quantity: item.min_quantity || item.quantity || 1,
      max_quantity: item.max_quantity,
      estimated_price: item.estimated_price || item.lastPrice,
      currency: item.currency || 'BRL',
      preferred_suppliers: item.preferred_suppliers,
      supplier_id: item.supplierId,
      supplier_name: item.supplierName,
      needs_supplier_search: item.needsSupplierSearch,
      requires_photo: item.requiresPhoto,
      photo_url: item.photoUrl,
    };
  };

  // Carregar itens do banco
  const fetchItems = async () => {
    try {
      console.log('🔄 Carregando itens...');
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear dados do banco para o formato esperado
      const formattedItems: Item[] = data.map(mapItemFromDB);

      console.log('✅ Itens carregados:', formattedItems.length);
      setItems(formattedItems);
    } catch (error) {
      console.error('❌ Erro ao carregar itens:', error);
      toast({
        title: "Erro ao carregar itens",
        description: "Não foi possível carregar a lista de itens.",
        variant: "destructive"
      });
    } finally {
      console.log('🏁 Finalizando carregamento de itens');
      setLoading(false);
    }
  };

  // Criar novo item
  const createItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert(mapItemToDB(itemData))
        .select()
        .single();

      if (error) throw error;

      // Adicionar item ao estado local
      const newItem = mapItemFromDB(data);

      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (error) {
      console.error('Erro ao criar item:', error);
      toast({
        title: "Erro ao adicionar item",
        description: "Não foi possível adicionar o item à lista.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar item
  const updateItem = async (id: string, itemData: Partial<Item>) => {
    try {
      console.log('🔄 Atualizando item:', id, itemData);
      const updateData = mapItemToDB(itemData);
      console.log('📝 Dados mapeados para DB:', updateData);

      const { data, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }

      console.log('✅ Item atualizado no DB:', data);

      // Atualizar estado local
      const updatedItem = mapItemFromDB(data);
      console.log('🔄 Item mapeado do DB:', updatedItem);
      
      setItems(prev => {
        const newItems = prev.map(item => 
          item.id === id ? updatedItem : item
        );
        console.log('📋 Lista atualizada:', newItems.length, 'itens');
        return newItems;
      });

      return data;
    } catch (error) {
      console.error('❌ Erro ao atualizar item:', error);
      toast({
        title: "Erro ao atualizar item",
        description: "Não foi possível atualizar o item.",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar item
  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remover do estado local
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast({
        title: "Erro ao deletar item",
        description: "Não foi possível deletar o item.",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
};
