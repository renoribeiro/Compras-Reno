# Compras-Reno

Sistema de gestão de compras e cotações com integração WhatsApp e Supabase

## 📋 Sobre o Projeto

O Compras-Reno é uma aplicação completa para gestão de compras, cotações e fornecedores, desenvolvida com tecnologias modernas e integração com WhatsApp para automação de processos.

## 🚀 Funcionalidades

- **Lista de Compras Inteligente**: Gestão completa de itens com categorização, subcategorização, marcas e modelos
- **Gestão de Fornecedores**: Cadastro completo com informações de contato, avaliações e histórico
- **Sistema de Cotações**: Automação de solicitação de cotações via WhatsApp
- **Gestão de Pedidos**: Controle completo do fluxo de pedidos
- **Dashboard Analytics**: Visão geral de métricas e indicadores
- **Integração WhatsApp**: Comunicação automatizada com fornecedores
- **Busca Google Places**: Localização automática de fornecedores

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Autenticação**: Supabase Auth
- **Integração**: WhatsApp Business API
- **Mapas**: Google Places API
- **Formulários**: React Hook Form + Zod
- **Estado**: TanStack Query

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Supabase
- WhatsApp Business API (opcional)
- Google Places API Key (opcional)

### Configuração

1. **Clone o repositório**
```bash
git clone https://github.com/renoribeiro/Compras-Reno.git
cd Compras-Reno
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
VITE_GOOGLE_PLACES_API_KEY=sua_chave_google_places
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza Supabase com as seguintes tabelas principais:

- `items` - Itens da lista de compras
- `suppliers` - Fornecedores
- `quotes` - Cotações
- `orders` - Pedidos
- `quote_items` - Itens das cotações
- `order_items` - Itens dos pedidos

## 🚀 Deploy

### Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute as migrações em `supabase/migrations/`
3. Configure as Edge Functions

### Frontend
O projeto pode ser deployado em:
- Vercel
- Netlify
- GitHub Pages
- Qualquer provedor que suporte aplicações React

## 📱 Funcionalidades Principais

### Lista de Compras
- Cadastro de itens com informações detalhadas
- Categorização e subcategorização
- Controle de quantidade e unidades
- Preços estimados
- Fornecedores preferenciais

### Gestão de Fornecedores
- Cadastro completo com dados de contato
- Avaliações e histórico de cotações
- Integração com Google Places
- Status de verificação

### Sistema de Cotações
- Criação automática de cotações
- Envio via WhatsApp
- Acompanhamento de status
- Comparação de preços

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Reno Ribeiro**
- GitHub: [@renoribeiro](https://github.com/renoribeiro)

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!