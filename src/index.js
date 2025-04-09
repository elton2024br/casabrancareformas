import { setupScheduler } from './scheduler.js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

console.log('Iniciando sistema de autogeração de conteúdo');

// Verifica se a chave da API foi configurada
if (!process.env.OPENAI_API_KEY) {
  console.error('ERRO: Chave da API OpenAI não configurada!');
  console.error('Por favor, configure a variável OPENAI_API_KEY no arquivo .env');
  process.exit(1);
}

// Inicializa o agendador
setupScheduler();

console.log('\nSistema iniciado com sucesso');
console.log('O agendador está executando em segundo plano');
console.log('Para gerar conteúdo manualmente, execute: node src/manualRun.js');
console.log('Para encerrar, pressione Ctrl+C\n'); 