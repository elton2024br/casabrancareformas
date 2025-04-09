# Casa Branca Reformas - Website

Projeto do website da Casa Branca Reformas, empresa especializada em reformas residenciais e comerciais. O site apresenta os serviços da empresa, portfólio de projetos, depoimentos de clientes, blog com conteúdo informativo sobre reformas e seção de contato.

## 🚀 Funcionalidades Principais

### ✨ Apresentação da Empresa
- Página inicial com banner principal e destaque dos serviços oferecidos
- Seção "Sobre Nós" com história da empresa e diferenciais
- Galeria de fotos "Antes e Depois" mostrando a transformação dos projetos

### 📁 Portfólio
- Exibição dos projetos realizados com fotos, descrições e detalhes
- Filtro por categorias (residencial, comercial, etc.)
- Página detalhada de cada projeto com galeria de imagens

### 📝 Blog
- Sistema completo de blog com artigos relacionados a reformas
- Categorização e tags para melhor organização do conteúdo
- Sistema de comentários para interação com os leitores
- Botões de compartilhamento social para maior divulgação
- Estrutura otimizada para SEO com dados estruturados e metadados

### 👥 Depoimentos
- Seção de depoimentos de clientes com fotos e textos
- Sistema de avaliação com estrelas
- Formulário para envio de novos depoimentos

### 📞 Contato
- Formulário de contato com validação
- Informações completas de contato e localização
- Integração com WhatsApp para contato direto

### 🔐 Área Administrativa
- Painel de administração para gestão de conteúdo
- Editor de posts do blog com preview em tempo real
- Sistema de geração de conteúdo baseado em IA
- Gestão de portfólio e depoimentos
- Dashboard com métricas e estatísticas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Tailwind CSS
- **Componentes UI**: Shadcn/UI, Lucide Icons
- **Roteamento**: React Router
- **Validação**: Zod
- **Geração de Conteúdo**: OpenAI API, Perplexity API
- **Otimização de Imagens**: Componente próprio para lazy loading e responsividade
- **Dados Estruturados**: JSON-LD para SEO
- **Estilização**: TailwindCSS, com design system personalizado

## 📋 Estrutura de Diretórios

```
src/
├── components/       # Componentes reutilizáveis
│   ├── blog/         # Componentes específicos do blog
│   ├── layout/       # Componentes de layout (header, footer, etc)
│   └── ui/           # Componentes de interface
├── config/           # Configurações do projeto
├── content/          # Conteúdo estático (blog posts, etc)
├── hooks/            # Custom hooks
├── lib/              # Bibliotecas e utilitários
├── pages/            # Páginas principais
│   └── admin/        # Páginas da área administrativa
├── styles/           # Estilos globais
├── types/            # Definições de tipos TypeScript
└── utils/            # Funções utilitárias
```

## 🔄 Fluxo de Geração de Conteúdo com IA

O sistema de blog inclui um avançado gerador de conteúdo automatizado:

1. O administrador insere um tópico e configurações (tom, público-alvo, extensão)
2. O sistema realiza pesquisa em tempo real usando a API Perplexity
3. A API OpenAI é utilizada para estruturar e escrever o conteúdo com base na pesquisa
4. O artigo gerado passa por verificação de fatos automática
5. O conteúdo é enriquecido com exemplos, imagens sugeridas e dados adicionais
6. Metadados de SEO são gerados automaticamente (título, descrição, palavras-chave)
7. O administrador pode revisar e publicar o artigo finalizado

## 🔧 Instalação e Uso

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/casabrancareformas.git
cd casabrancareformas
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

4. Execute o projeto em desenvolvimento
```bash
npm run dev
```

5. Para build de produção
```bash
npm run build
npm run preview # para visualizar a build
```

## 📈 SEO e Performance

- Implementação completa de SEO com metadados, dados estruturados e sitemap
- Otimização de imagens para carregamento rápido
- Estratégia de caching para melhor performance
- Breadcrumbs para navegação e indexação
- URLs amigáveis para mecanismos de busca

## 📱 Responsividade

O site é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:
- Desktop
- Tablet
- Dispositivos móveis

## 📄 Licença

Este projeto é de propriedade da Casa Branca Reformas. Todos os direitos reservados.
