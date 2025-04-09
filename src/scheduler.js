import cron from 'node-cron';
import { generateTopicIdeas } from './services/topicService.js';
import { generateArticle } from './services/articleService.js';
import { saveArticle } from './repository/contentRepository.js';
import { publishToBlog } from './integrations/siteIntegration.js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Configura o agendador de tarefas para múltiplas execuções diárias
 */
export function setupScheduler() {
  // Define os diferentes focos para cada horário do dia
  const contentFocus = {
    morning: ['dicas-reformas', 'tendencias-design', 'materiais-construcao'],
    afternoon: ['antes-depois', 'inspiracoes-decoracao', 'reformas-economicas'],
    evening: ['projetos-destaque', 'dicas-interiores', 'reformas-modernas']
  };

  // Função de geração de conteúdo reutilizável
  const generateContent = async (timeOfDay) => {
    try {
      console.log(`=== Iniciando geração de conteúdo - ${timeOfDay} ===`);
      console.log(`Data e hora: ${new Date().toLocaleString()}`);
      
      // 1. Gerar ideias de tópicos com foco específico para o horário
      const focus = contentFocus[timeOfDay];
      const focusKeyword = focus[Math.floor(Math.random() * focus.length)];
      console.log(`Foco do conteúdo: ${focusKeyword}`);
      
      const topics = await generateTopicIdeas(focusKeyword); // Passa o foco para o gerador
      console.log(`Tópicos gerados: ${topics.join(', ')}`);
      
      // 2. Selecionar um tópico
      const selectedTopic = topics[0];
      console.log(`Tópico selecionado: ${selectedTopic}`);
      
      // 3. Gerar artigo completo COM IMAGEM (garantir que a requisição especifique imagem)
      console.log('Gerando artigo com imagem...');
      const article = await generateArticle(selectedTopic, true); // true = com imagem
      console.log(`Artigo gerado: ${article.title}`);
      
      // 4. Salvar no repositório local
      const savedPath = await saveArticle(article);
      console.log(`Artigo salvo em: ${savedPath}`);
      
      // 5. Publicar no blog
      const publishedPath = await publishToBlog(article);
      console.log(`Artigo publicado no blog em: ${publishedPath}`);
      
      console.log(`=== Geração de conteúdo ${timeOfDay} concluída com sucesso ===`);
    } catch (error) {
      console.error(`Erro no processo de geração ${timeOfDay}:`, error);
    }
  };

  // Executa às 10h da manhã - Conteúdo matinal
  cron.schedule('0 10 * * *', async () => {
    await generateContent('morning');
  });
  
  // Executa às 15h - Conteúdo da tarde
  cron.schedule('0 15 * * *', async () => {
    await generateContent('afternoon');
  });
  
  // Executa às 19:49 - Conteúdo da noite
  cron.schedule('49 19 * * *', async () => {
    await generateContent('evening');
  });
  
  console.log('Agendador configurado com 3 publicações diárias:');
  console.log('- Manhã: 10:00 (foco em dicas e tendências)');
  console.log('- Tarde: 15:00 (foco em antes e depois e inspirações)');
  console.log('- Noite: 19:49 (foco em projetos destacados)');
} 