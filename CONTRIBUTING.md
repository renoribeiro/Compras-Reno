# Contribuindo para o Compras-Reno

Obrigado por considerar contribuir para o Compras-Reno! Este documento fornece diretrizes para contribuições.

## Como Contribuir

### 1. Fork do Repositório

1. Faça um fork do repositório
2. Clone seu fork localmente:
```bash
git clone https://github.com/seu-usuario/Compras-Reno.git
cd Compras-Reno
```

### 2. Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

3. Execute o projeto:
```bash
npm run dev
```

### 3. Criando uma Branch

Crie uma branch para sua feature ou correção:
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 4. Padrões de Código

- Use TypeScript para todos os novos arquivos
- Siga as convenções do ESLint configurado
- Use Tailwind CSS para estilização
- Componentes devem usar shadcn/ui quando possível
- Mantenha a consistência com o código existente

### 5. Commits

Use mensagens de commit claras e descritivas:
```bash
git commit -m "feat: adiciona funcionalidade X"
git commit -m "fix: corrige bug Y"
git commit -m "docs: atualiza documentação Z"
```

### 6. Testes

Antes de submeter:
- Teste sua funcionalidade manualmente
- Verifique se não há erros no console
- Execute o build para verificar se não há erros de TypeScript:
```bash
npm run build
```

### 7. Pull Request

1. Push sua branch:
```bash
git push origin feature/nome-da-feature
```

2. Abra um Pull Request no GitHub
3. Descreva claramente as mudanças realizadas
4. Referencie issues relacionadas se houver

## Tipos de Contribuição

### 🐛 Reportar Bugs

- Use o template de issue para bugs
- Inclua passos para reproduzir
- Adicione screenshots se relevante

### 💡 Sugerir Features

- Use o template de issue para features
- Descreva o problema que a feature resolve
- Explique como deveria funcionar

### 📝 Melhorar Documentação

- Correções de typos
- Melhorias na clareza
- Adição de exemplos

### 🔧 Correções de Código

- Correções de bugs
- Melhorias de performance
- Refatorações

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── services/      # Serviços e APIs
├── types/         # Definições de tipos
├── utils/         # Utilitários
└── lib/           # Configurações e helpers
```

## Tecnologias Principais

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase
- **Estado**: TanStack Query
- **Formulários**: React Hook Form + Zod

## Dúvidas?

Se tiver dúvidas sobre como contribuir:

1. Abra uma issue com a tag "question"
2. Entre em contato através do GitHub

Obrigado por contribuir! 🚀