// Utilitário centralizado para tratamento de erros
import { PostgrestError } from '@supabase/supabase-js';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  isUserFriendly: boolean;
}

export class ErrorHandler {
  private static userFriendlyMessages: Record<string, string> = {
    // Postgres errors
    '23505': 'Este item já existe no sistema.',
    '23503': 'Não é possível excluir este item pois ele está sendo usado.',
    '23514': 'Dados inválidos fornecidos.',
    '42P01': 'Erro interno do sistema.',
    
    // Common patterns
    'PGRST116': 'Nenhum resultado encontrado.',
    'PGRST301': 'Você não tem permissão para esta ação.',
    'PGRST204': 'Conteúdo não encontrado.',
    
    // Network errors
    'NETWORK_ERROR': 'Problema de conexão. Verifique sua internet.',
    'TIMEOUT_ERROR': 'Operação demorou muito. Tente novamente.',
    
    // Validation errors
    'VALIDATION_ERROR': 'Dados fornecidos são inválidos.',
    'REQUIRED_FIELD': 'Todos os campos obrigatórios devem ser preenchidos.',
    
    // Business logic errors
    'INSUFFICIENT_PERMISSIONS': 'Você não tem permissão para esta ação.',
    'QUOTA_EXCEEDED': 'Limite de uso excedido.',
    'RESOURCE_NOT_FOUND': 'Item não encontrado.',
  };

  static handle(error: any): AppError {
    console.error('🔥 ErrorHandler:', error);

    // PostgreSQL/Supabase errors
    if (error.code) {
      const friendlyMessage = this.userFriendlyMessages[error.code];
      if (friendlyMessage) {
        return {
          code: error.code,
          message: friendlyMessage,
          details: error.details || error.hint || error.message,
          isUserFriendly: true
        };
      }
    }

    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: this.userFriendlyMessages.NETWORK_ERROR,
        details: error.message,
        isUserFriendly: true
      };
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: this.userFriendlyMessages.TIMEOUT_ERROR,
        details: error.message,
        isUserFriendly: true
      };
    }

    // Custom app errors
    if (error.isAppError) {
      return error as AppError;
    }

    // Generic fallback
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      details: error.message || JSON.stringify(error),
      isUserFriendly: true
    };
  }

  static createAppError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      isUserFriendly: true,
      isAppError: true
    } as AppError & { isAppError: boolean };
  }

  static validateRequired(data: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => 
      !data[field] || (typeof data[field] === 'string' && !data[field].trim())
    );

    if (missingFields.length > 0) {
      throw this.createAppError(
        'REQUIRED_FIELD',
        `Campos obrigatórios não preenchidos: ${missingFields.join(', ')}`,
        { missingFields }
      );
    }
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry user errors
        const appError = this.handle(error);
        if (appError.code.startsWith('23') || appError.code.startsWith('PGRST3')) {
          throw error;
        }

        if (attempt === maxRetries) {
          throw error;
        }

        console.warn(`Tentativa ${attempt} falhou, tentando novamente em ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }

    throw lastError;
  }
}