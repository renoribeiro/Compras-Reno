export const defaultTemplates = {
  quote_initial: {
    title: 'Primeira Mensagem de Cotação',
    content: `🏪 *Nova Cotação Disponível*

📋 *Cotação:* {cotacao_titulo}
📅 *Data:* {cotacao_data}

📦 *Itens solicitados:*
{itens_lista}

💰 Olá {fornecedor_nome}, por favor envie seus melhores preços para os itens acima.

📞 Para responder, basta enviar uma mensagem com os preços de cada item.

🕐 Data limite: {data_limite}

Obrigado!`,
    variables: ['fornecedor_nome', 'cotacao_titulo', 'cotacao_data', 'itens_lista', 'data_limite']
  },

  quote_resend: {
    title: 'Reenvio de Cotação',
    content: `🔄 *Reenvio de Cotação*

📋 *Cotação:* {cotacao_titulo}
📅 *Data original:* {cotacao_data}

📦 *Itens solicitados:*
{itens_lista}

💰 Olá {fornecedor_nome}, ainda não recebemos sua cotação para os itens acima.

📞 Por favor, envie seus preços quando possível.

🕐 Data limite: {data_limite}

Obrigado pela atenção!`,
    variables: ['fornecedor_nome', 'cotacao_titulo', 'cotacao_data', 'itens_lista', 'data_limite']
  },

  order_initial: {
    title: 'Primeira Mensagem de Pedido',
    content: `📋 *Novo Pedido*

Olá {fornecedor_nome}! 👋

🏢 *Pedido:* {pedido_numero}
📅 *Data:* {pedido_data}

📦 *Itens do Pedido:*
{itens_lista}

💰 *Total:* {valor_total}
🚚 *Entrega:* {data_entrega}

📝 *Observações:* {observacoes}

Poderia confirmar este pedido? Obrigado! 🙏`,
    variables: ['fornecedor_nome', 'pedido_numero', 'pedido_titulo', 'itens_lista', 'valor_total', 'data_entrega', 'observacoes', 'pedido_data', 'empresa_nome']
  },

  order_resend: {
    title: 'Reenvio de Pedido',
    content: `🔄 *REENVIO* - Pedido

Olá {fornecedor_nome}! 👋

🏢 *Pedido:* {pedido_numero}
📅 *Data original:* {pedido_data}

📦 *Itens do Pedido:*
{itens_lista}

💰 *Total:* {valor_total}
🚚 *Entrega:* {data_entrega}

📝 *Observações:* {observacoes}

Aguardamos sua confirmação. Obrigado! 🙏`,
    variables: ['fornecedor_nome', 'pedido_numero', 'pedido_titulo', 'itens_lista', 'valor_total', 'data_entrega', 'observacoes', 'pedido_data', 'empresa_nome']
  },

  order_confirmation: {
    title: 'Confirmação de Pedido Recebida',
    content: `✅ *Pedido Confirmado*

Obrigado {fornecedor_nome}! 🙏

🏢 *Pedido:* {pedido_numero}
💰 *Total:* {valor_total}
🚚 *Entrega prevista:* {data_entrega}

Seu pedido foi confirmado com sucesso!

Qualquer dúvida, entre em contato conosco.`,
    variables: ['fornecedor_nome', 'pedido_numero', 'valor_total', 'data_entrega']
  },

  agent_welcome: {
    title: 'Boas-vindas do Agente',
    content: `👋 Olá {cliente_nome}!

Sou o assistente virtual da {empresa_nome}.

Como posso ajudá-lo hoje?`,
    variables: ['cliente_nome', 'empresa_nome']
  },

  agent_quote_response: {
    title: 'Resposta Automática de Cotação',
    content: `📋 Obrigado {cliente_nome}!

Recebemos sua cotação e nossa equipe está analisando.

Em breve retornaremos com uma resposta.`,
    variables: ['cliente_nome']
  },

  follow_up_reminder: {
    title: 'Lembrete de Follow-up',
    content: `📞 Olá {cliente_nome}!

Gostaríamos de saber se precisa de mais alguma informação sobre {contexto_conversa}.

Estamos à disposição para ajudar!`,
    variables: ['cliente_nome', 'contexto_conversa']
  }
};

export const getDefaultTemplate = (templateType: string) => {
  return defaultTemplates[templateType as keyof typeof defaultTemplates] || null;
};

export const getAllTemplateTypes = () => {
  return Object.keys(defaultTemplates);
};