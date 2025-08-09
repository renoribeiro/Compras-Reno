# Compras Reno - Sistema de Gestão de Compras

## Versão 2.0.0

Sistema completo de gestão de compras com automação de cotações via WhatsApp, integração com Google Maps para busca de fornecedores e interface moderna desenvolvida em React + TypeScript.

## 🚀 Principais Funcionalidades

### ✅ Gestão de Itens
- Cadastro completo de itens com categorias
- Controle de quantidade e unidades de medida
- Busca automática de fornecedores via Google Maps
- Solicitação de fotos de produtos
- Importação em lote via CSV/Excel

### 🏪 Gestão de Fornecedores
- Cadastro detalhado com informações de contato
- Categorização por tipo de produto
- Integração com Google Places API
- Histórico de cotações e desempenho

### 💰 Sistema de Cotações
- Envio automático via WhatsApp Business API
- Processamento inteligente de respostas
- Comparação automática de preços
- Agendamento de cotações
- Histórico completo de cotações

### 📱 Automação WhatsApp
- Integração com Evolution API
- Templates personalizáveis de mensagens
- Processamento de respostas com IA
- Monitoramento de status de entrega
- Confirmação automática de pedidos

### 📊 Dashboard e Relatórios
- Visão geral de itens e fornecedores
- Histórico de cotações
- Análise de desempenho de fornecedores
- Estatísticas de economia

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **React Router** - Roteamento
- **React Hook Form** - Gerenciamento de formulários

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security (RLS)** - Segurança de dados
- **Real-time subscriptions** - Atualizações em tempo real

### APIs & Integrações
- **Evolution API** - WhatsApp Business
- **Google Places API** - Busca de fornecedores
- **Google Maps API** - Geolocalização
- **OpenAI API** - Processamento de linguagem natural

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- Chaves de API do Google (Places, Maps)
- Instância Evolution API configurada
- Conta OpenAI (opcional, para IA)

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/renoribeiro/Compras-Reno.git
cd Compras-Reno
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase

# Google APIs
VITE_GOOGLE_PLACES_API_KEY=sua_chave_google_places
VITE_GOOGLE_MAPS_API_KEY=sua_chave_google_maps

# Evolution API
VITE_EVOLUTION_API_URL=url_da_sua_instancia_evolution
VITE_EVOLUTION_API_KEY=chave_da_evolution_api

# OpenAI (opcional)
VITE_OPENAI_API_KEY=sua_chave_openai
```

### 4. Configure o banco de dados
Execute as migrações SQL no Supabase:

```sql
-- Criar tabelas principais
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  contact TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  quantity INTEGER DEFAULT 1,
  unit_of_measure TEXT,
  estimated_price DECIMAL(10,2),
  min_quantity INTEGER,
  supplier_id UUID REFERENCES suppliers(id),
  supplier_name TEXT,
  needs_supplier_search BOOLEAN DEFAULT false,
  requires_photo BOOLEAN DEFAULT false,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança (ajuste conforme necessário)
CREATE POLICY "Users can view their own data" ON suppliers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own data" ON items
  FOR ALL USING (auth.uid() IS NOT NULL);
```

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

## 📱 Configuração do WhatsApp

### Evolution API
1. Configure uma instância da Evolution API
2. Conecte seu WhatsApp Business
3. Configure os webhooks para receber respostas
4. Teste o envio de mensagens

### Templates de Mensagem
Personalize os templates em `src/config/messageTemplates.ts`

## 🔧 Configuração do Google

### Google Places API
1. Ative a API no Google Cloud Console
2. Crie credenciais (chave de API)
3. Configure as restrições de uso

### Google Maps API
1. Ative a API no Google Cloud Console
2. Configure a mesma chave ou crie uma nova
3. Ative os serviços necessários (Geocoding, Places)

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base (Radix UI)
│   ├── dashboard/      # Componentes do dashboard
│   ├── shopping/       # Componentes da lista de compras
│   ├── suppliers/      # Componentes de fornecedores
│   └── quotes/         # Componentes de cotações
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
├── services/           # Serviços de API
├── contexts/           # Contextos React
└── integrations/       # Integrações externas
```

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) no banco de dados
- Validação de dados com Zod
- Sanitização de inputs
- Rate limiting nas APIs

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte o repositório no Netlify
2. Configure as variáveis de ambiente
3. Build command: `npm run build`
4. Publish directory: `dist`

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: renoribeiro@github.com
- GitHub Issues: [Criar Issue](https://github.com/renoribeiro/Compras-Reno/issues)

---

**Desenvolvido com ❤️ por Reno Ribeiro**