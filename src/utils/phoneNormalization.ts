/**
 * Utilitário centralizado para normalização de números de telefone
 * Resolve o problema do nono dígito em números de celular brasileiros
 */

/**
 * Gera todas as variações possíveis de um número de telefone para busca
 * Lida com o problema do nono dígito e diferentes formatos
 */
export const normalizePhoneNumber = (phone: string): string[] => {
  console.log(`📞 INÍCIO normalizePhoneNumber para: ${phone}`);
  
  const cleanPhone = phone.replace(/\D/g, '');
  console.log(`📞 Telefone limpo: ${cleanPhone} (${cleanPhone.length} dígitos)`);
  
  const variations: string[] = [];
  
  // Função auxiliar para adicionar variações sem duplicatas
  const addVariation = (variation: string) => {
    if (variation && !variations.includes(variation)) {
      variations.push(variation);
      console.log(`📞 Adicionada variação: ${variation}`);
    }
  };
  
  // Sempre adicionar o número original limpo
  addVariation(cleanPhone);
  
  // CASO 1: Número com DDI (55) e SEM nono dígito (12 dígitos)
  // Ex: 558596227722 -> adicionar 5585996227722
  if (cleanPhone.startsWith('55') && cleanPhone.length === 12 && cleanPhone.charAt(4) !== '9') {
    console.log('📞 CASO 1: DDI + sem nono dígito');
    const ddi = cleanPhone.slice(0, 2);      // "55"
    const ddd = cleanPhone.slice(2, 4);      // "85"
    const numero = cleanPhone.slice(4);      // "96227722"
    const comNonoDigito = `${ddi}${ddd}9${numero}`;
    addVariation(comNonoDigito);
    console.log(`📞 ${cleanPhone} -> ${comNonoDigito} (adicionado 9º dígito)`);
  }
  
  // CASO 2: Número com DDI (55) e COM nono dígito (13 dígitos)
  // Ex: 5585996227722 -> adicionar 558596227722
  if (cleanPhone.startsWith('55') && cleanPhone.length === 13 && cleanPhone.charAt(4) === '9') {
    console.log('📞 CASO 2: DDI + com nono dígito');
    const ddi = cleanPhone.slice(0, 2);      // "55"
    const ddd = cleanPhone.slice(2, 4);      // "85"
    const numero = cleanPhone.slice(5);      // "96227722" (pula o 9)
    const semNonoDigito = `${ddi}${ddd}${numero}`;
    addVariation(semNonoDigito);
    console.log(`📞 ${cleanPhone} -> ${semNonoDigito} (removido 9º dígito)`);
  }
  
  // CASO 3: Número SEM DDI - adicionar DDI (55)
  if (!cleanPhone.startsWith('55') && cleanPhone.length >= 8) {
    console.log('📞 CASO 3: Sem DDI - adicionando 55');
    const comDDI = `55${cleanPhone}`;
    addVariation(comDDI);
    
    // Se tem 10 dígitos (DDD + 8), adicionar versão com 9º dígito
    if (cleanPhone.length === 10) {
      const ddd = cleanPhone.slice(0, 2);
      const numero = cleanPhone.slice(2);
      const comDDIeNono = `55${ddd}9${numero}`;
      addVariation(comDDIeNono);
      console.log(`📞 ${cleanPhone} -> ${comDDIeNono} (DDI + 9º dígito)`);
    }
    
    // Se tem 11 dígitos (DDD + 9 + 8), adicionar versão sem 9º dígito
    if (cleanPhone.length === 11 && cleanPhone.charAt(2) === '9') {
      const ddd = cleanPhone.slice(0, 2);
      const numero = cleanPhone.slice(3);
      const comDDIsemNono = `55${ddd}${numero}`;
      addVariation(comDDIsemNono);
      console.log(`📞 ${cleanPhone} -> ${comDDIsemNono} (DDI - 9º dígito)`);
    }
  }
  
  // CASO 4: Se tem DDI, adicionar versão sem DDI
  if (cleanPhone.startsWith('55') && cleanPhone.length >= 10) {
    const semDDI = cleanPhone.slice(2);
    addVariation(semDDI);
  }
  
  // CASO 5: Adicionar últimos 8 dígitos (para compatibilidade)
  if (cleanPhone.length >= 8) {
    const last8 = cleanPhone.slice(-8);
    addVariation(last8);
  }
  
  console.log(`📞 FIM normalizePhoneNumber. Total de variações: ${variations.length}`);
  console.log(`📞 Variações geradas: ${JSON.stringify(variations)}`);
  
  return variations;
};

/**
 * Formata um número de telefone para envio via WhatsApp
 * Garante que tenha o código do país (55)
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se já tem DDI (55), retorna como está
  if (cleanPhone.startsWith('55')) {
    return cleanPhone;
  }
  
  // Adiciona DDI (55)
  return `55${cleanPhone}`;
};

/**
 * Valida se um número de telefone está em formato válido
 */
export const isValidPhoneFormat = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Aceita formatos:
  // - 8 dígitos (apenas número)
  // - 10 dígitos (DDD + número)
  // - 11 dígitos (DDD + 9 + número)
  // - 12 dígitos (55 + DDD + número)
  // - 13 dígitos (55 + DDD + 9 + número)
  return [8, 10, 11, 12, 13].includes(cleanPhone.length);
};

/**
 * Extrai o número de telefone de um JID do WhatsApp
 * Ex: "5585996227722@s.whatsapp.net" -> "5585996227722"
 */
export const extractPhoneFromJid = (jid: string): string => {
  return jid.replace('@s.whatsapp.net', '').replace('@c.us', '');
};

/**
 * Busca um fornecedor por número de telefone usando todas as variações possíveis
 */
export const findSupplierByPhone = async (
  supabase: any, 
  phoneNumber: string, 
  userId: string
): Promise<any | null> => {
  console.log(`🔍 Buscando fornecedor para telefone: ${phoneNumber}`);
  
  const phoneVariations = normalizePhoneNumber(phoneNumber);
  console.log(`🔍 Testando ${phoneVariations.length} variações`);
  
  // Buscar fornecedores do usuário
  const { data: suppliers, error } = await supabase
    .from('suppliers')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('❌ Erro ao buscar fornecedores:', error);
    return null;
  }
  
  if (!suppliers || suppliers.length === 0) {
    console.log('⚠️ Nenhum fornecedor encontrado para o usuário');
    return null;
  }
  
  console.log(`📋 Verificando ${suppliers.length} fornecedores`);
  
  // Testar cada variação contra cada fornecedor
  for (const variation of phoneVariations) {
    console.log(`🔍 Testando variação: ${variation}`);
    
    for (const supplier of suppliers) {
      const supplierVariations = normalizePhoneNumber(supplier.phone);
      
      if (supplierVariations.includes(variation)) {
        console.log(`✅ FORNECEDOR ENCONTRADO: ${supplier.name} (${supplier.phone})`);
        console.log(`✅ Match: ${variation} encontrado em ${JSON.stringify(supplierVariations)}`);
        return supplier;
      }
    }
  }
  
  console.log('❌ Nenhum fornecedor encontrado para as variações testadas');
  return null;
};