
// Tipos globais para o sistema
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone?: string;
  address?: string;
  category: string;
  paymentTerm?: string;
  paymentTypes?: string[];
  notes?: string;
  isActive?: boolean;
  itemsCount?: number;
  lastQuote?: string;
  registrationDate?: string;
  updatedAt?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  category: string;
  brand?: string;
  model?: string;
  sku?: string;
  barcode?: string;
  unit_of_measure?: string;
  specifications?: Record<string, any>;
  images?: string[];
  tags?: string[];
  min_quantity?: number;
  max_quantity?: number;
  estimated_price?: number;
  currency?: string;
  preferred_suppliers?: string[];
  lastPrice?: number;
  supplierId?: string;
  supplierName?: string;
  needsSupplierSearch?: boolean;
  requiresPhoto?: boolean;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quote {
  id: string;
  title: string;
  status: 'draft' | 'pending' | 'completed' | 'expired' | 'cancelled';
  createdAt: string;
  deliveryDate?: string;
  expiresAt?: string;
  totalItems: number;
  suppliersCount: number;
  items: QuoteItem[];
  suppliers: Supplier[];
}

export interface QuoteItem {
  id: string;
  itemId: string;
  quoteId: string;
  item: Item;
  requestedQuantity: number;
  suppliers: QuoteSupplierResponse[];
}

export interface QuoteSupplierResponse {
  id: string;
  supplierId: string;
  quoteItemId: string;
  supplier: Supplier;
  price?: number;
  quantity?: number;
  deliveryTime?: string;
  notes?: string;
  status: 'pending' | 'responded' | 'declined';
}

// Tipos para o serviço de busca de fornecedores
export interface SupplierSearchResult {
  placeId: string;
  name: string;
  address: string;
  category: string;
  phone?: string;
  distance?: number;
  rating?: number;
}

// Tipos para autenticação - atualizados para o novo sistema
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

// Tipo atualizado para perfil do usuário
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'user';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipos para organizações
export interface Organization {
  id: string;
  name: string;
  admin_user_id: string;
  max_users: number;
  created_at: string;
  updated_at: string;
}

// Tipos para usuários extras
export interface ExtraUsers {
  id: string;
  organization_id: string;
  extra_users_count: number;
  monthly_fee: number;
  created_at: string;
  updated_at: string;
}

// Tipos para assinatura - atualizados com novos valores
export interface Subscription {
  id: string;
  userId: string;
  email: string;
  stripeCustomerId?: string;
  mercadopagoCustomerId?: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  plan: 'monthly' | 'annual';
  amount: number;
  currency: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para fotos de produtos
export interface ProductPhoto {
  id: string;
  itemId: string;
  supplierId: string;
  photoUrl: string;
  requestedBy?: string;
  uploadedAt: string;
  approved: boolean;
  notes?: string;
  createdAt: string;
}

// Tipos para pedidos
export interface Order {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'partial' | 'complete' | 'cancelled' | 'expired';
  createdAt: string;
  deliveryDate?: string;
  totalItems: number;
  suppliersCount: number;
  items: OrderItem[];
  suppliers: Supplier[];
}

export interface OrderItem {
  id: string;
  itemId: string;
  orderId: string;
  item: Item;
  requestedQuantity: number;
  unitPrice?: number;
  totalPrice?: number;
  notes?: string;
  suppliers: OrderSupplierResponse[];
}

export interface OrderSupplierResponse {
  id: string;
  supplierId: string;
  orderItemId: string;
  orderId: string;
  supplier: Supplier;
  price?: number;
  quantity?: number;
  deliveryTime?: string;
  notes?: string;
  status: 'pending' | 'responded' | 'declined';
  confirmedAt?: string;
}

// Tipos para logs de status de pedidos
export interface OrderStatusLog {
  id: string;
  orderId: string;
  status: string;
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

// Tipos para configurações do app
export interface AppSettings {
  id: string;
  organizationId: string;
  autoConfirmOrders: boolean;
  autoConfirmQuotes: boolean;
  defaultDeliveryDays: number;
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
  messageTemplates: {
    orderConfirmation: string;
    quoteRequest: string;
    deliveryReminder: string;
  };
  createdAt: string;
  updatedAt: string;
}
