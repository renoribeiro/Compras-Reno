# Changelog - Sistema de Compras Reno

## Versão 2.0.0 - Remoção de Subcategorias (Janeiro 2025)

### 🗑️ Removido
- **Campo `subcategory`** removido do tipo `Item`
- **Coluna "Subcategoria"** removida da tabela de itens na interface
- **Campo `subcategory`** removido da tabela `items` no banco de dados

### 🔧 Correções
- **Mapeamento de dados** corrigido no hook `useItems`
- **Sincronização** entre frontend e backend aprimorada
- **Campos faltantes** adicionados na tabela `items`:
  - `quantity`, `supplier_id`, `supplier_name`
  - `needs_supplier_search`, `requires_photo`, `photo_url`

### ✨ Melhorias
- **Logs de debug** adicionados para rastreamento de operações
- **Fallbacks robustos** para campos opcionais
- **Validação de dados** aprimorada
- **Estrutura do banco** completamente alinhada com o código

### 🚀 Tecnologias
- React 18.3.1
- TypeScript 5.5.3
- Supabase 2.50.0
- Vite 5.4.1
- Tailwind CSS 3.4.11

### 📋 Arquivos Principais Modificados
- `src/types/index.ts` - Remoção do campo subcategory
- `src/hooks/useItems.ts` - Correção do mapeamento de dados
- `src/pages/ShoppingList.tsx` - Remoção da coluna subcategoria
- Migração do banco de dados para remoção da coluna subcategory

---

## Versão 1.0.0 - Versão Inicial
- Sistema completo de gestão de compras e cotações
- Integração com WhatsApp
- Interface moderna com React e Tailwind CSS
- Backend Supabase com autenticação e banco de dados