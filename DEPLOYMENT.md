
# Guia de Deployment para HostGator Brasil

Este guia irá ajudá-lo a fazer o deployment da sua aplicação React na hospedagem compartilhada do HostGator Brasil.

## Pré-requisitos

- Conta de hospedagem no HostGator Brasil
- Cliente FTP (como FileZilla) ou acesso ao gerenciador de arquivos do HostGator
- Node.js instalado em sua máquina local

## Processo de Build

1. Abra seu terminal/prompt de comando
2. Navegue até o diretório do seu projeto
3. Execute o comando de build:
   ```
   npm run build
   ```
4. Isso criará uma pasta `dist` com seus arquivos prontos para produção

## Upload para o HostGator

1. Conecte-se à sua conta do HostGator usando FTP ou o gerenciador de arquivos
2. Navegue até o diretório public_html (ou o diretório onde você deseja hospedar o site)
3. Faça upload de todo o conteúdo da sua pasta local `dist` para este diretório

## Configuração para Roteamento do lado do Cliente

O arquivo `.htaccess` já está incluído em seu projeto e será carregado com o resto dos arquivos. Isso gerencia os redirecionamentos para o roteamento do lado do cliente.

## Testando seu Deployment

1. Visite seu domínio em um navegador
2. Navegue para diferentes páginas para garantir que o roteamento funcione corretamente
3. Teste todas as funcionalidades, especialmente a integração com o Supabase

## Solução de Problemas

- Se as rotas não funcionarem, verifique se o arquivo `.htaccess` foi carregado corretamente
- Se as chamadas de API falharem, verifique sua configuração do Supabase
- Para quaisquer erros do servidor, verifique os logs de erro no painel de controle do HostGator

## Nota sobre Variáveis de Ambiente

A URL e a chave do Supabase são compiladas em sua aplicação durante o processo de build. Se você precisar alterá-las posteriormente, será necessário atualizá-las em seu código e reconstruir a aplicação.
