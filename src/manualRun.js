import { generateTopicIdeas } from './services/topicService.js';
import { generateArticle } from './services/articleService.js';
import { saveArticle } from './repository/contentRepository.js';
import { publishToBlog } from './integrations/siteIntegration.js';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Executa o processo de geração de conteúdo manualmente
 * Útil para testes e geração sob demanda
 */
async function runContentGeneration() {
  try {
    console.log('=== Iniciando geração manual de conteúdo ===');
    console.log(`Data e hora: ${new Date().toLocaleString()}`);
    
    // Foco para o teste (você pode alterar ou passar um parâmetro via linha de comando)
    const focusKeyword = process.argv[2] || 'dicas-interiores';
    console.log(`Foco de conteúdo: ${focusKeyword}`);
    
    // 1. Gerar ideias de tópicos
    console.log('Gerando ideias de tópicos...');
    const topics = await generateTopicIdeas(focusKeyword);
    console.log('\nTópicos gerados:');
    topics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic}`);
    });
    
    // Para testes, usamos o primeiro tópico
    // Em uma versão mais avançada, pode-se permitir seleção pelo usuário
    const selectedIndex = 0;
    const selectedTopic = topics[selectedIndex];
    console.log(`\nTópico selecionado: ${selectedTopic}`);
    
    // 2. Gerar artigo COM IMAGEM
    console.log('\nGerando artigo com imagem... (isso pode levar alguns instantes)');
    const article = await generateArticle(selectedTopic, true); // true = com imagem
    console.log(`\nArtigo gerado: "${article.title}"`);
    
    if (article.imageUrl) {
      console.log(`Imagem incluída: ${article.imageUrl}`);
    } else {
      console.log('Nenhuma imagem foi incluída no artigo');
    }
    
    // 3. Salvar no repositório local
    const savedPath = await saveArticle(article);
    console.log(`Artigo salvo em: ${savedPath}`);
    
    // 4. Publicar no blog
    const publishedPath = await publishToBlog(article);
    console.log(`Artigo publicado no blog em: ${publishedPath}`);
    
    console.log('\n=== Geração de conteúdo concluída com sucesso ===');
    console.log('Verifique o conteúdo gerado nas pastas indicadas acima.');
  } catch (error) {
    console.error('\nErro no processo de geração de conteúdo:', error);
  }
}

// Auto-executa a função
runContentGeneration(); 