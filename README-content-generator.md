# Sistema de Autogeração de Conteúdo - Casa Branca Reformas

Sistema automatizado para geração e publicação de conteúdo para o blog usando a API da OpenAI.

## Funcionalidades

- Geração automática de ideias para tópicos de blog
- Criação de artigos completos com conteúdo otimizado para SEO
- Armazenamento local dos artigos gerados
- Integração com o blog do site
- Agendamento de publicações semanais
- Modo de execução manual para testes

## Requisitos

- Node.js 18.0 ou superior
- Conta na OpenAI com chave de API
- Projeto React com estrutura de blog configurada

## Configuração

1. Configure sua chave de API da OpenAI:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione sua chave de API: `OPENAI_API_KEY=sua_chave_aqui`

2. Instale as dependências:
   ```
   npm install
   ```

## Uso

### Execução Automática

Para iniciar o sistema com o agendador (executa toda segunda-feira às 9h):

```
npm run content:start
```

### Geração Manual

Para gerar um artigo manualmente (útil para testes):

```
npm run content:generate
```

## Estrutura de Arquivos

- `src/services/` - Serviços de geração de conteúdo
  - `openaiService.js` - Integração com a API da OpenAI
  - `topicService.js` - Geração de ideias de tópicos
  - `articleService.js` - Geração de artigos completos
- `src/repository/` - Armazenamento de conteúdo
  - `contentRepository.js` - Salva e recupera artigos do sistema de arquivos
- `src/integrations/` - Integração com o site
  - `siteIntegration.js` - Publica conteúdo no blog
- `src/scheduler.js` - Configura o agendador de tarefas
- `src/manualRun.js` - Script para execução manual
- `src/index.js` - Ponto de entrada do sistema

## Personalização

Para alterar a frequência de publicação, edite o padrão cron em `src/scheduler.js`.
Por padrão, está configurado para executar toda segunda-feira às 9h (`0 9 * * 1`).

## Estrutura dos Artigos Gerados

Os artigos são gerados no formato markdown e incluem:
- Título otimizado para SEO
- Introdução envolvente
- 3-4 seções com subtítulos
- Conclusão com call-to-action
- Entre 800-1200 palavras
- Metadados para categorização

## Proximos Passos

1. Implementar análise de tendências para selecionar tópicos mais relevantes
2. Adicionar geração de imagens usando DALL-E
3. Integrar com Google Analytics para avaliar desempenho dos artigos
4. Permitir revisão humana antes da publicação
5. Integrar com ferramentas de análise de SEO 