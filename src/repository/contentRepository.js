import fs from 'fs-extra';
import path from 'path';

// Diretório onde os artigos serão salvos
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Salva um artigo gerado no sistema de arquivos
 * @param {Object} article - Artigo a ser salvo
 * @returns {Promise<string>} Caminho do arquivo salvo
 */
export async function saveArticle(article) {
  try {
    // Garante que o diretório existe
    await fs.ensureDir(CONTENT_DIR);
    
    const fileName = `${article.slug}.md`;
    const filePath = path.join(CONTENT_DIR, fileName);
    
    // Formata o conteúdo com metadados YAML
    const fileContent = `---
title: "${article.title}"
date: "${article.date}"
slug: "${article.slug}"
---

${article.content}`;

    await fs.writeFile(filePath, fileContent);
    return filePath;
  } catch (error) {
    console.error("Erro ao salvar artigo:", error);
    throw error;
  }
}

/**
 * Recupera todos os artigos salvos
 * @returns {Promise<Array>} Lista de artigos
 */
export async function getAllArticles() {
  try {
    // Garante que o diretório existe
    await fs.ensureDir(CONTENT_DIR);
    
    const files = await fs.readdir(CONTENT_DIR);
    const articles = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Extrai metadados do YAML front matter
        const metaMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (metaMatch) {
          const metaText = metaMatch[1];
          const articleContent = metaMatch[2];
          
          // Parse simples dos metadados
          const meta = {};
          metaText.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              let value = valueParts.join(':').trim();
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }
              meta[key.trim()] = value;
            }
          });
          
          articles.push({
            ...meta,
            content: articleContent.trim(),
            filePath
          });
        }
      }
    }
    
    return articles;
  } catch (error) {
    console.error("Erro ao recuperar artigos:", error);
    throw error;
  }
} 