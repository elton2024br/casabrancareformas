import fs from 'fs-extra';
import path from 'path';

// Diretório do blog no site
const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

/**
 * Publica um artigo no blog do site
 * @param {Object} article - Artigo a ser publicado
 * @returns {Promise<string>} Caminho do arquivo publicado
 */
export async function publishToBlog(article) {
  try {
    // Garante que o diretório do blog existe
    await fs.ensureDir(BLOG_DIR);
    
    const fileName = `${article.slug}.md`;
    const filePath = path.join(BLOG_DIR, fileName);
    
    // Prepara os metadados para o frontmatter
    const imageMetadata = article.imageUrl ? `imageUrl: "${article.imageUrl}"\n` : '';
    const mobileSrcMetadata = article.mobileSrc ? `mobileSrc: "${article.mobileSrc}"\n` : '';
    
    // Adiciona informações de pesquisa se disponíveis
    const researchMetadata = article.researchInfo ? 
      `researchDate: "${article.researchInfo.researchedAt}"\nresearchSource: "${article.researchInfo.source}"\n` : '';
    
    // Data atual formatada para exibição
    const formattedDate = new Date().toISOString().split('T')[0];
    
    // Tags baseadas no conteúdo
    const defaultTags = ['reformas', 'casa', 'dicas'];
    const contentTags = extractKeywords(article.content, article.title);
    const allTags = [...new Set([...defaultTags, ...contentTags])]; // Remove duplicatas
    const tagsString = JSON.stringify(allTags.slice(0, 5)); // Limita a 5 tags
    
    const fileContent = `---
title: "${article.title}"
date: "${article.date}"
slug: "${article.slug}"
featured: false
${imageMetadata}${mobileSrcMetadata}${researchMetadata}tags: ${tagsString}
description: "${article.title}. Leia este artigo atualizado da Casa Branca Reformas e descubra mais sobre reformas residenciais."
lastUpdated: "${formattedDate}"
---

${article.content}`;

    await fs.writeFile(filePath, fileContent);
    
    // Atualiza o índice de blog se necessário
    await updateBlogIndex(article);
    
    return filePath;
  } catch (error) {
    console.error("Erro ao publicar no blog:", error);
    throw error;
  }
}

/**
 * Extrai palavras-chave relevantes do conteúdo
 * @param {string} content - Conteúdo do artigo
 * @param {string} title - Título do artigo
 * @returns {Array<string>} Lista de palavras-chave
 */
function extractKeywords(content, title) {
  // Lista de palavras comuns para ignorar
  const stopWords = ['de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'com', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'ao', 'ele', 'das', 'seu', 'sua', 'ou', 'isso', 'você'];
  
  // Extrair palavras do conteúdo e título
  const text = (title + ' ' + content).toLowerCase();
  
  // Remover markdown, pontuação e quebras de linha
  const cleanText = text
    .replace(/#+\s/g, '') // Remove símbolos de título
    .replace(/\*\*/g, '') // Remove asteriscos de negrito
    .replace(/\*/g, '')   // Remove asteriscos de itálico
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove pontuação
    .replace(/\n/g, ' '); // Substitui quebras de linha por espaços
  
  // Divide em palavras
  const words = cleanText.split(' ').filter(word => 
    word.length > 3 && !stopWords.includes(word)
  );
  
  // Conta frequência
  const wordCount = {};
  words.forEach(word => {
    if (wordCount[word]) {
      wordCount[word]++;
    } else {
      wordCount[word] = 1;
    }
  });
  
  // Extrai as palavras mais frequentes
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
}

/**
 * Atualiza o índice de artigos do blog
 * @param {Object} article - Artigo a ser adicionado ao índice
 */
async function updateBlogIndex(article) {
  try {
    const indexPath = path.join(BLOG_DIR, '_index.json');
    let blogIndex = [];
    
    // Verifica se o índice já existe
    if (await fs.pathExists(indexPath)) {
      const indexContent = await fs.readFile(indexPath, 'utf8');
      blogIndex = JSON.parse(indexContent);
    }
    
    // Adiciona o novo artigo ao índice
    blogIndex.push({
      title: article.title,
      date: article.date,
      slug: article.slug,
      featured: false,
      tags: ["reformas", "dicas", "casa"],
      ...(article.imageUrl && { imageUrl: article.imageUrl }),
      ...(article.mobileSrc && { mobileSrc: article.mobileSrc }),
      ...(article.researchInfo && { 
        researchDate: article.researchInfo.researchedAt,
        researchSource: article.researchInfo.source 
      })
    });
    
    // Ordena por data (mais recente primeiro)
    blogIndex.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Salva o índice atualizado
    await fs.writeFile(indexPath, JSON.stringify(blogIndex, null, 2));
    
    return indexPath;
  } catch (error) {
    console.error("Erro ao atualizar índice do blog:", error);
    // Não lançamos o erro para não interromper o fluxo principal
  }
} 