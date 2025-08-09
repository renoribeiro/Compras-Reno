
// Utilitário para gerar IDs únicos
// Compatível com UUID do Supabase quando migrarmos

export const generateId = (): string => {
  // Por enquanto usando timestamp + random, mas será substituído por UUID do Supabase
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Função para validar se é um ID válido
export const isValidId = (id: string): boolean => {
  return id && id.length > 0 && typeof id === 'string';
};

// Função para gerar UUID v4 (preparação para Supabase)
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};