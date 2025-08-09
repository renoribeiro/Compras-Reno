export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          category: string
          created_at: string | null
          currency: string | null
          description: string | null
          estimated_price: number | null
          id: string
          images: string[] | null
          last_price: number | null
          max_quantity: number | null
          min_quantity: number | null
          name: string
          needs_supplier_search: boolean | null
          photo_url: string | null
          preferred_suppliers: string[] | null
          requires_photo: boolean | null
          specifications: Json | null
          supplier_id: string | null
          supplier_name: string | null
          tags: string[] | null
          unit_of_measure: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          estimated_price?: number | null
          id?: string
          images?: string[] | null
          last_price?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          name: string
          needs_supplier_search?: boolean | null
          photo_url?: string | null
          preferred_suppliers?: string[] | null
          requires_photo?: boolean | null
          specifications?: Json | null
          supplier_id?: string | null
          supplier_name?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          estimated_price?: number | null
          id?: string
          images?: string[] | null
          last_price?: number | null
          max_quantity?: number | null
          min_quantity?: number | null
          name?: string
          needs_supplier_search?: boolean | null
          photo_url?: string | null
          preferred_suppliers?: string[] | null
          requires_photo?: boolean | null
          specifications?: Json | null
          supplier_id?: string | null
          supplier_name?: string | null
          tags?: string[] | null
          unit_of_measure?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          quote_id: string
          requested_quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          quote_id: string
          requested_quantity: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          quote_id?: string
          requested_quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_supplier_responses: {
        Row: {
          created_at: string | null
          delivery_time: string | null
          id: string
          notes: string | null
          price: number | null
          quantity: number | null
          quote_item_id: string
          status: string | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_time?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          quote_item_id: string
          status?: string | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_time?: string | null
          id?: string
          notes?: string | null
          price?: number | null
          quantity?: number | null
          quote_item_id?: string
          status?: string | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_supplier_responses_quote_item_id_fkey"
            columns: ["quote_item_id"]
            isOneToOne: false
            referencedRelation: "quote_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_supplier_responses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          suppliers_count: number | null
          title: string
          total_items: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          suppliers_count?: number | null
          title: string
          total_items?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          suppliers_count?: number | null
          title?: string
          total_items?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          category: string | null
          contact: string | null
          contact_info: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          items_count: number | null
          last_quote: string | null
          name: string
          notes: string | null
          payment_term: string | null
          payment_types: string[] | null
          phone: string
          registration_date: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact?: string | null
          contact_info?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          items_count?: number | null
          last_quote?: string | null
          name: string
          notes?: string | null
          payment_term?: string | null
          payment_types?: string[] | null
          phone: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact?: string | null
          contact_info?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          items_count?: number | null
          last_quote?: string | null
          name?: string
          notes?: string | null
          payment_term?: string | null
          payment_types?: string[] | null
          phone?: string
          registration_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          role: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          role?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      llm_configurations: {
        Row: {
          config_data: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          organization_id: string | null
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config_data: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          organization_id?: string | null
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config_data?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          organization_id?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          item_id: string
          notes: string | null
          order_id: string
          requested_quantity: number
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_id: string
          notes?: string | null
          order_id: string
          requested_quantity: number
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          order_id?: string
          requested_quantity?: number
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_supplier_responses: {
        Row: {
          confirmed_quantity: number | null
          created_at: string | null
          delivery_date: string | null
          id: string
          message_id: string | null
          notes: string | null
          order_id: string
          order_item_id: string
          payment_terms: string | null
          phone_number: string | null
          response_date: string | null
          status: string | null
          supplier_id: string
          total_price: number | null
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          confirmed_quantity?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          message_id?: string | null
          notes?: string | null
          order_id: string
          order_item_id: string
          payment_terms?: string | null
          phone_number?: string | null
          response_date?: string | null
          status?: string | null
          supplier_id: string
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          confirmed_quantity?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          message_id?: string | null
          notes?: string | null
          order_id?: string
          order_item_id?: string
          payment_terms?: string | null
          phone_number?: string | null
          response_date?: string | null
          status?: string | null
          supplier_id?: string
          total_price?: number | null
          unit_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_supplier_responses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_supplier_responses_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_supplier_responses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          suppliers_count: number | null
          title: string
          total_items: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          suppliers_count?: number | null
          title: string
          total_items?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          suppliers_count?: number | null
          title?: string
          total_items?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_sensitive_data: {
        Args: { encrypted_data: string; encryption_key: string }
        Returns: string
      }
      encrypt_sensitive_data: {
        Args: { data_to_encrypt: string; encryption_key: string }
        Returns: string
      }
      find_supplier_by_phone: {
        Args: { phone_input: string }
        Returns: {
          id: string
          name: string
          phone: string
          email: string
        }[]
      }
      normalize_phone: {
        Args: { phone_input: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const