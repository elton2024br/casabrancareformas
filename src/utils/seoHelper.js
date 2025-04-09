/**
 * Utilitários para otimização de SEO
 * 
 * Este arquivo contém funções para análise, avaliação e melhorias
 * de otimização para mecanismos de busca (SEO) para artigos e posts.
 */

import { ARTICLE_CATEGORIES } from '../config/articleCategories';

// Lista de palavras-chave comuns a serem evitadas em excesso
const COMMON_STOPWORDS = [
  'a', 'o', 'e', 'é', 'de', 'da', 'do', 'que', 'em', 'um', 'uma',
  'para', 'com', 'não', 'os', 'as', 'se', 'na', 'no', 'pelo', 'pela',
  'por', 'como', 'mas', 'ou', 'ao', 'dos', 'das', 'este', 'esta', 'isto'
];

/**
 * Analisa o título para verificar se está otimizado para SEO
 * 
 * @param {string} title - O título a ser analisado
 * @returns {Object} Objeto com análise e sugestões
 */
export function analyzeTitleSEO(title) {
  if (!title) return { 
    score: 0, 
    message: 'Título não fornecido', 
    suggestions: ['Adicione um título'] 
  };

  const length = title.length;
  const words = title.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  let score = 100;
  const suggestions = [];
  
  // Verificar comprimento (ideal: 50-60 caracteres)
  if (length < 30) {
    score -= 30;
    suggestions.push('O título é muito curto (ideal: 50-60 caracteres)');
  } else if (length > 70) {
    score -= 20;
    suggestions.push('O título é muito longo. Considere reduzi-lo para menos de 60 caracteres');
  } else if (length > 60) {
    score -= 10;
    suggestions.push('O título está um pouco longo. Considere reduzi-lo para menos de 60 caracteres');
  }
  
  // Verificar número de palavras (ideal: 6-10 palavras)
  if (wordCount < 4) {
    score -= 20;
    suggestions.push('Adicione mais palavras relevantes ao título (ideal: 6-10 palavras)');
  } else if (wordCount > 12) {
    score -= 15;
    suggestions.push('Reduza o número de palavras no título (ideal: 6-10 palavras)');
  }
  
  // Verificar capitalização apropriada
  const hasProperCapitalization = words.every(word => 
    COMMON_STOPWORDS.includes(word.toLowerCase()) || 
    word[0] === word[0].toUpperCase()
  );
  
  if (!hasProperCapitalization) {
    score -= 10;
    suggestions.push('Use capitalização apropriada (primeira letra maiúscula para palavras principais)');
  }
  
  // Formatação da pontuação final
  let message = '';
  if (score >= 90) {
    message = 'Excelente! O título está bem otimizado para SEO.';
  } else if (score >= 70) {
    message = 'Bom título. Pequenos ajustes podem melhorar ainda mais.';
  } else if (score >= 50) {
    message = 'O título precisa de melhorias para otimização de SEO.';
  } else {
    message = 'O título necessita de revisão significativa para SEO.';
  }
  
  return {
    score,
    message,
    suggestions: suggestions.length > 0 ? suggestions : ['Nenhuma sugestão, o título parece bom!'],
    length,
    wordCount
  };
}

/**
 * Extrai e analisa palavras-chave do conteúdo
 * 
 * @param {string} content - Conteúdo HTML do artigo
 * @returns {Object} Palavras-chave extraídas e sua análise
 */
export function extractKeywords(content) {
  if (!content) return { keywords: [], topKeywords: [] };
  
  // Remover HTML tags e converter para minúsculas
  const plainText = content.replace(/<[^>]*>/g, ' ').toLowerCase();
  
  // Dividir em palavras e remover pontuação
  const words = plainText.split(/\s+/)
    .map(word => word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''))
    .filter(word => word.length > 3 && !COMMON_STOPWORDS.includes(word));
  
  // Contar frequência das palavras
  const wordFrequency = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Ordenar por frequência
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
  
  // Extrair n-gramas (2 e 3 palavras)
  const bigrams = [];
  const trigrams = [];
  
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] && words[i+1]) {
      bigrams.push(`${words[i]} ${words[i+1]}`);
    }
    
    if (i < words.length - 2 && words[i+2]) {
      trigrams.push(`${words[i]} ${words[i+1]} ${words[i+2]}`);
    }
  }
  
  // Contar frequência de n-gramas
  const bigramFrequency = {};
  bigrams.forEach(bigram => {
    bigramFrequency[bigram] = (bigramFrequency[bigram] || 0) + 1;
  });
  
  const trigramFrequency = {};
  trigrams.forEach(trigram => {
    trigramFrequency[trigram] = (trigramFrequency[trigram] || 0) + 1;
  });
  
  // Ordenar n-gramas por frequência
  const sortedBigrams = Object.entries(bigramFrequency)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([phrase, count]) => ({ phrase, count }));
  
  const sortedTrigrams = Object.entries(trigramFrequency)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([phrase, count]) => ({ phrase, count }));
  
  // Combinar palavras-chave
  const keywords = [
    ...sortedWords.slice(0, 15),
    ...sortedBigrams.slice(0, 10).map(item => ({ 
      word: item.phrase, 
      count: item.count 
    })),
    ...sortedTrigrams.slice(0, 5).map(item => ({ 
      word: item.phrase, 
      count: item.count 
    }))
  ];
  
  return {
    keywords,
    topKeywords: keywords.slice(0, 10).map(k => k.word),
    wordFrequency: sortedWords.slice(0, 20),
    phrases: {
      bigrams: sortedBigrams.slice(0, 10),
      trigrams: sortedTrigrams.slice(0, 5)
    }
  };
}

/**
 * Sugere categorias apropriadas com base no conteúdo
 * 
 * @param {string} title - Título do artigo
 * @param {string} content - Conteúdo HTML do artigo
 * @returns {Array} Categorias sugeridas em ordem de relevância
 */
export function suggestCategories(title, content) {
  if (!title && !content) return [];
  
  // Extrair texto do conteúdo
  const plainText = (content || '').replace(/<[^>]*>/g, ' ').toLowerCase();
  const fullText = `${(title || '').toLowerCase()} ${plainText}`;
  
  // Pontuação para cada categoria
  const categoryScores = ARTICLE_CATEGORIES.map(category => {
    // Verificar palavras-chave do nome da categoria
    const nameWords = category.name.toLowerCase().split(/\s+/);
    const nameScore = nameWords.reduce((score, word) => {
      if (word.length <= 3) return score; // Ignorar palavras muito curtas
      return score + (fullText.includes(word) ? 5 : 0);
    }, 0);
    
    // Verificar palavras da descrição da categoria
    const descWords = category.description.toLowerCase().split(/\s+/);
    const uniqueDescWords = [...new Set(descWords)];
    const descScore = uniqueDescWords.reduce((score, word) => {
      if (word.length <= 3 || COMMON_STOPWORDS.includes(word)) return score;
      return score + (fullText.includes(word) ? 2 : 0);
    }, 0);
    
    // Pontuação para correspondência exata da categoria
    const exactMatchScore = fullText.includes(category.name.toLowerCase()) ? 20 : 0;
    
    // Pontuação total
    const totalScore = nameScore + descScore + exactMatchScore;
    
    return {
      category,
      score: totalScore
    };
  });
  
  // Ordenar por pontuação e retornar as mais relevantes
  return categoryScores
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .map(item => ({
      ...item.category,
      relevanceScore: item.score
    }));
}

/**
 * Analisa o conteúdo para otimização de SEO
 * 
 * @param {string} title - Título do artigo
 * @param {string} description - Descrição do artigo
 * @param {string} content - Conteúdo HTML
 * @returns {Object} Análise de SEO com pontuação e sugestões
 */
export function analyzeSEO(title, description, content) {
  // Análise do título
  const titleAnalysis = analyzeTitleSEO(title);
  
  // Análise da descrição (meta description)
  const descriptionLength = (description || '').length;
  const descriptionScore = descriptionLength > 0 
    ? (descriptionLength < 50 ? 30 : (descriptionLength > 160 ? 60 : 100))
    : 0;
  
  const descriptionSuggestions = [];
  if (descriptionLength === 0) {
    descriptionSuggestions.push('Adicione uma meta description.');
  } else if (descriptionLength < 50) {
    descriptionSuggestions.push('A descrição é muito curta. Ideal: 120-160 caracteres.');
  } else if (descriptionLength > 160) {
    descriptionSuggestions.push('A descrição é muito longa. Limite para 160 caracteres.');
  }
  
  // Análise de palavras-chave
  const keywordsAnalysis = extractKeywords(content);
  const topKeywords = keywordsAnalysis.topKeywords;
  
  // Verificar densidade de palavras-chave no título
  const keywordInTitleCount = topKeywords.filter(keyword => 
    title && title.toLowerCase().includes(keyword)
  ).length;
  
  const keywordTitleScore = keywordInTitleCount > 0 ? 100 : 40;
  const keywordTitleSuggestions = keywordInTitleCount === 0 && topKeywords.length > 0
    ? [`Considere incluir uma das principais palavras-chave no título: ${topKeywords.slice(0, 3).join(', ')}`]
    : [];
  
  // Verificar uso de palavras-chave na descrição
  const keywordInDescCount = topKeywords.filter(keyword => 
    description && description.toLowerCase().includes(keyword)
  ).length;
  
  const keywordDescScore = keywordInDescCount > 0 ? 100 : 40;
  const keywordDescSuggestions = keywordInDescCount === 0 && topKeywords.length > 0
    ? [`Considere incluir palavras-chave principais na descrição: ${topKeywords.slice(0, 3).join(', ')}`]
    : [];
  
  // Análise de conteúdo
  const plainText = (content || '').replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  
  let contentScore = 0;
  const contentSuggestions = [];
  
  if (wordCount < 300) {
    contentScore = 30;
    contentSuggestions.push('O conteúdo é muito curto. Recomendado: mínimo de 500 palavras.');
  } else if (wordCount < 500) {
    contentScore = 60;
    contentSuggestions.push('O conteúdo está um pouco curto. Recomendado: 500-2000 palavras.');
  } else if (wordCount > 500 && wordCount < 2000) {
    contentScore = 100;
  } else {
    contentScore = 90;
    contentSuggestions.push('Conteúdo longo é bom, mas certifique-se de que é relevante e envolvente.');
  }
  
  // Verificar uso de cabeçalhos (H1, H2, H3)
  const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
  const h2Count = (content.match(/<h2[^>]*>/g) || []).length;
  const h3Count = (content.match(/<h3[^>]*>/g) || []).length;
  
  let headingsScore = 0;
  const headingSuggestions = [];
  
  if (h1Count > 1) {
    headingsScore = 40;
    headingSuggestions.push('Use apenas um H1 por página, normalmente para o título principal.');
  } else if (h1Count === 0) {
    headingsScore = 50;
    headingSuggestions.push('Adicione um cabeçalho H1 para o título principal.');
  } else {
    headingsScore = 100;
  }
  
  if (h2Count === 0) {
    headingsScore = Math.min(headingsScore, 60);
    headingSuggestions.push('Adicione cabeçalhos H2 para organizar o conteúdo em seções.');
  }
  
  if (h2Count > 0 && h3Count === 0 && wordCount > 800) {
    headingSuggestions.push('Considere adicionar cabeçalhos H3 para subseções em artigos mais longos.');
  }
  
  // Verificar links internos/externos
  const internalLinkCount = (content.match(/href="[^"]*\/[^"]*"/g) || []).length;
  const externalLinkCount = (content.match(/href="(https?:)?\/\/[^"]*"/g) || []).length;
  
  let linkScore = 100;
  const linkSuggestions = [];
  
  if (internalLinkCount === 0) {
    linkScore -= 20;
    linkSuggestions.push('Adicione links internos para outros conteúdos relevantes no site.');
  }
  
  if (externalLinkCount === 0 && wordCount > 500) {
    linkScore -= 10;
    linkSuggestions.push('Considere adicionar links para fontes externas confiáveis para aumentar a credibilidade.');
  }
  
  // Verificar uso de imagens e atributos alt
  const imageCount = (content.match(/<img[^>]*>/g) || []).length;
  const imagesWithAlt = (content.match(/<img[^>]*alt="[^"]*"[^>]*>/g) || []).length;
  
  let imageScore = 100;
  const imageSuggestions = [];
  
  if (imageCount === 0 && wordCount > 300) {
    imageScore = 60;
    imageSuggestions.push('Adicione imagens relevantes para tornar o conteúdo mais atraente e compreensível.');
  } else if (imageCount > 0 && imagesWithAlt < imageCount) {
    imageScore = 70;
    imageSuggestions.push('Adicione atributos alt descritivos a todas as imagens.');
  }
  
  // Calcular pontuação geral
  const overallScore = Math.round(
    (titleAnalysis.score * 0.15) +
    (descriptionScore * 0.15) +
    (keywordTitleScore * 0.1) +
    (keywordDescScore * 0.1) +
    (contentScore * 0.2) +
    (headingsScore * 0.1) +
    (linkScore * 0.1) +
    (imageScore * 0.1)
  );
  
  // Formatar resultado
  return {
    score: overallScore,
    title: {
      score: titleAnalysis.score,
      suggestions: titleAnalysis.suggestions
    },
    description: {
      score: descriptionScore,
      length: descriptionLength,
      suggestions: descriptionSuggestions
    },
    keywords: {
      list: topKeywords,
      inTitle: {
        score: keywordTitleScore,
        suggestions: keywordTitleSuggestions
      },
      inDescription: {
        score: keywordDescScore,
        suggestions: keywordDescSuggestions
      }
    },
    content: {
      score: contentScore,
      wordCount,
      suggestions: contentSuggestions
    },
    headings: {
      score: headingsScore,
      counts: { h1: h1Count, h2: h2Count, h3: h3Count },
      suggestions: headingSuggestions
    },
    links: {
      score: linkScore,
      counts: { internal: internalLinkCount, external: externalLinkCount },
      suggestions: linkSuggestions
    },
    images: {
      score: imageScore,
      counts: { total: imageCount, withAlt: imagesWithAlt },
      suggestions: imageSuggestions
    },
    suggestedCategories: suggestCategories(title, content).slice(0, 3)
  };
}

/**
 * Gera meta tags para inclusão no HTML
 * 
 * @param {Object} articleData - Dados do artigo
 * @returns {string} Meta tags formatadas em HTML
 */
export function generateMetaTags(articleData) {
  if (!articleData || !articleData.title) return '';
  
  const { 
    title = '', 
    description = '', 
    slug = '',
    author = '',
    category = '',
    image = '',
    published = new Date().toISOString(),
    modified = new Date().toISOString(),
    keywords = []
  } = articleData;
  
  const baseUrl = 'https://casabrancareformas.com.br';
  const articleUrl = `${baseUrl}/blog/${slug}`;
  
  const tags = [
    `<meta name="description" content="${description}">`,
    `<meta name="keywords" content="${keywords.join(', ')}">`,
    
    // Open Graph tags
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${articleUrl}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:site_name" content="Casabranca Reformas">`,
    image && `<meta property="og:image" content="${image.startsWith('http') ? image : baseUrl + image}">`,
    
    // Twitter Card tags
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    image && `<meta name="twitter:image" content="${image.startsWith('http') ? image : baseUrl + image}">`,
    
    // Article specific meta tags
    `<meta property="article:published_time" content="${published}">`,
    `<meta property="article:modified_time" content="${modified}">`,
    category && `<meta property="article:section" content="${category}">`,
    ...keywords.map(keyword => `<meta property="article:tag" content="${keyword}">`)
  ].filter(Boolean);
  
  return tags.join('\n');
}

/**
 * Gera dados estruturados (schema.org) para artigos
 * 
 * @param {Object} articleData - Dados do artigo
 * @returns {string} Script de dados estruturados para inclusão no HTML
 */
export function generateStructuredData(articleData) {
  if (!articleData || !articleData.title) return '';
  
  const { 
    title = '', 
    description = '', 
    slug = '',
    author = '',
    authorUrl = '',
    category = '',
    image = '',
    published = new Date().toISOString(),
    modified = new Date().toISOString(),
    content = '',
    wordCount = 0
  } = articleData;
  
  const baseUrl = 'https://casabrancareformas.com.br';
  const articleUrl = `${baseUrl}/blog/${slug}`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "headline": title,
    "description": description,
    "image": image ? (image.startsWith('http') ? image : baseUrl + image) : undefined,
    "author": {
      "@type": "Person",
      "name": author,
      "url": authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Casabranca Reformas",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": published,
    "dateModified": modified,
    "articleBody": content ? content.replace(/<[^>]*>/g, ' ') : undefined,
    "articleSection": category || undefined,
    "wordCount": wordCount || undefined
  };
  
  // Remover propriedades indefinidas
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });
  
  if (structuredData.author && Object.keys(structuredData.author).length === 1) {
    structuredData.author = structuredData.author.name;
  }
  
  return `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
}

/**
 * SEO Helper Module
 * 
 * Utilitário para análise e otimização SEO de conteúdo para o blog.
 * Inclui análise de palavras-chave, verificação de metadados,
 * e recomendações para melhorar a otimização para motores de busca.
 */

/**
 * Analisa a pontuação SEO de um conteúdo com base em vários critérios
 * 
 * @param {string} content - Conteúdo do artigo
 * @param {Array<string>} targetKeywords - Palavras-chave alvo para o artigo
 * @returns {Object} - Análise SEO detalhada com pontuação
 */
export function analyzeSeoScore(content, targetKeywords = []) {
  if (!content) {
    return {
      score: 0,
      strengths: [],
      weaknesses: ["Conteúdo vazio"],
      metrics: {}
    };
  }

  // Normalizar conteúdo para análise
  const textContent = content.replace(/[,\.!?;:'"()\[\]{}]/g, ' ').toLowerCase();
  const words = textContent.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Análise de palavras-chave
  const keywordMetrics = analyzeKeywords(textContent, targetKeywords);
  
  // Análise de estrutura
  const structureMetrics = analyzeStructure(content);
  
  // Análise de legibilidade
  const readabilityMetrics = analyzeReadability(content);
  
  // Calcular pontuação geral (0-100)
  const metrics = {
    ...keywordMetrics,
    ...structureMetrics,
    ...readabilityMetrics,
    wordCount
  };
  
  const keywordScore = Math.min(100, 
    (keywordMetrics.keywordDensity >= 1 && keywordMetrics.keywordDensity <= 3 ? 25 : 
      keywordMetrics.keywordDensity > 0 ? 15 : 0) +
    (keywordMetrics.primaryKeywordInFirstParagraph ? 15 : 0) +
    (keywordMetrics.keywordInHeadings / Math.max(1, structureMetrics.headingCount) * 20)
  );
  
  const structureScore = Math.min(100,
    (structureMetrics.hasH2 ? 15 : 0) +
    (structureMetrics.headingRatio > 0.02 && structureMetrics.headingRatio < 0.1 ? 15 : 0) +
    (structureMetrics.listCount > 0 ? 10 : 0) +
    (structureMetrics.paragraphCount > 5 ? 10 : 0) +
    (structureMetrics.avgParagraphLength < 150 ? 10 : 0) +
    (structureMetrics.hasSchema ? 20 : 0) +
    (structureMetrics.hasImages ? 10 : 0)
  );
  
  const readabilityScore = Math.min(100,
    (readabilityMetrics.fleschScore > 60 ? 30 : 
      readabilityMetrics.fleschScore > 50 ? 20 : 
      readabilityMetrics.fleschScore > 40 ? 10 : 0) +
    (readabilityMetrics.avgSentenceLength < 20 ? 20 : 
      readabilityMetrics.avgSentenceLength < 25 ? 10 : 0) +
    (readabilityMetrics.complexWordPercentage < 0.2 ? 20 : 
      readabilityMetrics.complexWordPercentage < 0.3 ? 10 : 0) +
    (readabilityMetrics.passiveVoiceCount / Math.max(1, readabilityMetrics.sentenceCount) < 0.1 ? 10 : 0)
  );
  
  const contentLengthScore = Math.min(100,
    wordCount >= 1500 ? 100 :
    wordCount >= 1000 ? 80 :
    wordCount >= 750 ? 60 :
    wordCount >= 500 ? 40 :
    wordCount >= 300 ? 20 : 0
  );
  
  // Peso para cada componente
  const totalScore = Math.round(
    keywordScore * 0.3 +
    structureScore * 0.3 +
    readabilityScore * 0.2 +
    contentLengthScore * 0.2
  );
  
  // Identificar pontos fortes e fracos
  const strengths = [];
  const weaknesses = [];
  
  // Palavras-chave
  if (keywordMetrics.keywordDensity >= 1 && keywordMetrics.keywordDensity <= 3) {
    strengths.push("Densidade de palavras-chave ideal (1-3%)");
  } else if (keywordMetrics.keywordDensity > 3) {
    weaknesses.push("Densidade de palavras-chave muito alta (possível keyword stuffing)");
  } else if (keywordMetrics.keywordDensity < 1 && keywordMetrics.keywordDensity > 0) {
    weaknesses.push("Densidade de palavras-chave baixa");
  } else if (keywordMetrics.keywordDensity === 0) {
    weaknesses.push("Palavras-chave alvo não encontradas no conteúdo");
  }
  
  if (keywordMetrics.primaryKeywordInFirstParagraph) {
    strengths.push("Palavra-chave principal presente no primeiro parágrafo");
  } else {
    weaknesses.push("Palavra-chave principal ausente no primeiro parágrafo");
  }
  
  if (keywordMetrics.keywordInHeadings > 0) {
    strengths.push("Palavras-chave presentes em cabeçalhos");
  } else {
    weaknesses.push("Palavras-chave ausentes em cabeçalhos");
  }
  
  // Estrutura
  if (structureMetrics.hasH2) {
    strengths.push("Uso adequado de cabeçalhos H2");
  } else {
    weaknesses.push("Ausência de cabeçalhos H2");
  }
  
  if (structureMetrics.headingRatio > 0.02 && structureMetrics.headingRatio < 0.1) {
    strengths.push("Proporção adequada de cabeçalhos no texto");
  } else if (structureMetrics.headingRatio > 0.1) {
    weaknesses.push("Excesso de cabeçalhos em relação ao conteúdo");
  } else {
    weaknesses.push("Poucos cabeçalhos para a extensão do conteúdo");
  }
  
  if (structureMetrics.listCount > 0) {
    strengths.push("Uso de listas para melhorar a escaneabilidade");
  } else {
    weaknesses.push("Ausência de listas para quebrar o texto");
  }
  
  if (structureMetrics.avgParagraphLength < 150) {
    strengths.push("Parágrafos de tamanho adequado para leitura");
  } else {
    weaknesses.push("Parágrafos muito longos dificultam a leitura");
  }
  
  if (structureMetrics.hasSchema) {
    strengths.push("Presença de dados estruturados (schema.org)");
  } else {
    weaknesses.push("Ausência de dados estruturados (schema.org)");
  }
  
  // Legibilidade
  if (readabilityMetrics.fleschScore > 60) {
    strengths.push("Texto de fácil leitura (Flesch Reading Ease > 60)");
  } else if (readabilityMetrics.fleschScore > 50) {
    strengths.push("Texto de legibilidade moderada");
  } else {
    weaknesses.push("Texto de difícil leitura (Flesch Reading Ease < 50)");
  }
  
  if (readabilityMetrics.avgSentenceLength < 20) {
    strengths.push("Sentenças curtas facilitam a compreensão");
  } else {
    weaknesses.push("Sentenças longas dificultam a leitura");
  }
  
  // Comprimento do conteúdo
  if (wordCount >= 1000) {
    strengths.push("Conteúdo longo e abrangente (1000+ palavras)");
  } else if (wordCount >= 750) {
    strengths.push("Conteúdo de tamanho razoável");
  } else if (wordCount < 500) {
    weaknesses.push("Conteúdo curto pode não ser suficiente para SEO (menos de 500 palavras)");
  }
  
  return {
    score: totalScore,
    strengths,
    weaknesses,
    metrics
  };
}

/**
 * Analisa a presença e distribuição de palavras-chave no conteúdo
 * 
 * @param {string} content - Conteúdo normalizado do artigo
 * @param {Array<string>} targetKeywords - Palavras-chave alvo
 * @returns {Object} - Métricas relacionadas às palavras-chave
 */
function analyzeKeywords(content, targetKeywords) {
  // Se não houver palavras-chave, retornar métricas vazias
  if (!targetKeywords || targetKeywords.length === 0) {
    return {
      keywordDensity: 0,
      primaryKeywordInFirstParagraph: false,
      keywordInHeadings: 0,
      keywordCount: 0
    };
  }
  
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const totalWords = words.length;
  
  // Normalizar palavras-chave para comparação
  const normalizedKeywords = targetKeywords.map(kw => kw.toLowerCase());
  const primaryKeyword = normalizedKeywords[0]; // Considerar a primeira como principal
  
  // Contar ocorrências de palavras-chave
  let keywordCount = 0;
  for (const word of words) {
    if (normalizedKeywords.some(kw => word.includes(kw) || kw.includes(word))) {
      keywordCount++;
    }
  }
  
  // Verificar presença de palavra-chave principal no primeiro parágrafo
  const firstParagraph = content.split(/\n\s*\n/)[0] || '';
  const primaryKeywordInFirstParagraph = normalizedKeywords.some(kw => 
    firstParagraph.includes(kw)
  );
  
  // Verificar presença de palavras-chave em cabeçalhos
  const headingRegex = /#+ .+|<h[1-6]>.+<\/h[1-6]>/gi;
  const headings = content.match(headingRegex) || [];
  
  let keywordInHeadings = 0;
  for (const heading of headings) {
    for (const keyword of normalizedKeywords) {
      if (heading.toLowerCase().includes(keyword)) {
        keywordInHeadings++;
        break; // Contar apenas uma vez por cabeçalho
      }
    }
  }
  
  // Calcular densidade de palavras-chave (%)
  const keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0;
  
  return {
    keywordDensity,
    primaryKeywordInFirstParagraph,
    keywordInHeadings,
    keywordCount
  };
}

/**
 * Analisa a estrutura do conteúdo para SEO
 * 
 * @param {string} content - Conteúdo do artigo
 * @returns {Object} - Métricas relacionadas à estrutura
 */
function analyzeStructure(content) {
  // Identificar cabeçalhos
  const h1Regex = /<h1>|^# /gm;
  const h2Regex = /<h2>|^## /gm;
  const h3Regex = /<h3>|^### /gm;
  const h4Regex = /<h4>|^#### /gm;
  const h5Regex = /<h5>|^##### /gm;
  const h6Regex = /<h6>|^###### /gm;
  
  const h1Count = (content.match(h1Regex) || []).length;
  const h2Count = (content.match(h2Regex) || []).length;
  const h3Count = (content.match(h3Regex) || []).length;
  const h4Count = (content.match(h4Regex) || []).length;
  const h5Count = (content.match(h5Regex) || []).length;
  const h6Count = (content.match(h6Regex) || []).length;
  
  const headingCount = h1Count + h2Count + h3Count + h4Count + h5Count + h6Count;
  
  // Identificar parágrafos
  const paragraphRegex = /<p>|^(?!<h[1-6]>|<ul>|<ol>|<li>|<blockquote>|<pre>|<table>|#).+$/gm;
  const paragraphs = content.match(paragraphRegex) || [];
  const paragraphCount = paragraphs.length;
  
  // Calcular tamanho médio de parágrafos
  let totalParagraphLength = 0;
  for (const paragraph of paragraphs) {
    totalParagraphLength += paragraph.length;
  }
  const avgParagraphLength = paragraphCount > 0 ? totalParagraphLength / paragraphCount : 0;
  
  // Identificar listas
  const ulRegex = /<ul>|^- /gm;
  const olRegex = /<ol>|^\d+\. /gm;
  const ulCount = (content.match(ulRegex) || []).length;
  const olCount = (content.match(olRegex) || []).length;
  const listCount = ulCount + olCount;
  
  // Identificar imagens
  const imageRegex = /<img|!\[/g;
  const imageCount = (content.match(imageRegex) || []).length;
  
  // Verificar presença de dados estruturados (schema.org)
  const schemaRegex = /<script type="application\/ld\+json">|<[^>]+ itemscope|<[^>]+ itemprop/i;
  const hasSchema = schemaRegex.test(content);
  
  // Calcular proporção de cabeçalhos em relação ao conteúdo total
  const contentLength = content.length;
  const headingRatio = contentLength > 0 ? headingCount / contentLength : 0;
  
  return {
    headingCount,
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    hasH2: h2Count > 0,
    paragraphCount,
    avgParagraphLength,
    listCount,
    imageCount,
    hasImages: imageCount > 0,
    hasSchema,
    headingRatio
  };
}

/**
 * Analisa a legibilidade do conteúdo
 * 
 * @param {string} content - Conteúdo do artigo
 * @returns {Object} - Métricas relacionadas à legibilidade
 */
function analyzeReadability(content) {
  // Extrair texto puro
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Dividir em sentenças
  const sentenceRegex = /[^.!?]+[.!?]+/g;
  const sentences = plainText.match(sentenceRegex) || [];
  const sentenceCount = sentences.length;
  
  // Contagem de palavras e sílabas
  let wordCount = 0;
  let syllableCount = 0;
  let complexWordCount = 0; // Palavras com 3+ sílabas
  
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/).filter(word => word.length > 0);
    wordCount += words.length;
    
    for (const word of words) {
      const syllables = countSyllables(word);
      syllableCount += syllables;
      
      if (syllables >= 3) {
        complexWordCount++;
      }
    }
  }
  
  // Calcular comprimento médio de sentenças
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  
  // Calcular percentual de palavras complexas
  const complexWordPercentage = wordCount > 0 ? complexWordCount / wordCount : 0;
  
  // Detectar voz passiva (aproximação básica)
  const passiveRegex = /\b(é|são|foi|foram|ser[áã]o|seria[m]?)\s+\w+[ado]s?\b/gi;
  const passiveMatches = plainText.match(passiveRegex) || [];
  const passiveVoiceCount = passiveMatches.length;
  
  // Calcular Flesch Reading Ease (adaptado para português)
  // Fórmula: 206.835 - (1.015 × ASL) - (84.6 × ASW)
  // ASL = comprimento médio da sentença
  // ASW = sílabas por palavra
  const syllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * syllablesPerWord);
  
  return {
    sentenceCount,
    avgSentenceLength,
    syllablesPerWord,
    complexWordPercentage,
    passiveVoiceCount,
    fleschScore: Math.max(0, Math.min(100, fleschScore)) // Limitar entre 0 e 100
  };
}

/**
 * Conta o número aproximado de sílabas em uma palavra (português)
 * 
 * @param {string} word - Palavra para contar sílabas
 * @returns {number} - Número estimado de sílabas
 */
function countSyllables(word) {
  if (!word || word.length === 0) return 0;
  
  // Remover pontuação e converter para minúsculas
  word = word.toLowerCase().replace(/[.,;:!?()[\]{}'"]/g, '');
  
  // Regras específicas para português
  word = word.replace(/gu[ei]/g, 'gi'); // Contar "gue", "gui" como uma sílaba
  word = word.replace(/qu[ei]/g, 'ki'); // Contar "que", "qui" como uma sílaba
  
  // Contar vogais
  const vowelGroups = word.match(/[aáàãâeéêiíoóôõuúü]+/gi) || [];
  let count = vowelGroups.length;
  
  // Ajustar para ditongos e tritongos
  const diphthongs = [
    'ai', 'ãi', 'ei', 'éi', 'êi', 'oi', 'ôi', 'ui', 'au', 'ão', 'eu', 'éu', 'êu', 'iu', 'ou'
  ];
  
  for (const diphthong of diphthongs) {
    const regex = new RegExp(diphthong, 'gi');
    const matches = word.match(regex) || [];
    count -= matches.length; // Subtrair contagens duplas
  }
  
  // Casos especiais de palavras terminadas em vogal + l, r, z
  if (/[aeiouáàãâéêíóôõúü][lrz]$/.test(word)) {
    count++;
  }
  
  return Math.max(1, count); // No mínimo uma sílaba
}

/**
 * Gera sugestões de melhoria com base na análise SEO
 * 
 * @param {Object} seoAnalysis - Resultado da análise SEO
 * @returns {Array<string>} - Lista de sugestões para melhorar o SEO
 */
export function getSeoImprovementSuggestions(seoAnalysis) {
  if (!seoAnalysis) return [];
  
  const { score, strengths, weaknesses, metrics } = seoAnalysis;
  const suggestions = [];
  
  // Converter fraquezas em sugestões acionáveis
  for (const weakness of weaknesses) {
    if (weakness.includes("Densidade de palavras-chave baixa")) {
      suggestions.push("Aumente a presença de palavras-chave no texto, mantendo-se entre 1-3% de densidade");
    }
    else if (weakness.includes("Densidade de palavras-chave muito alta")) {
      suggestions.push("Reduza a repetição excessiva de palavras-chave para evitar penalizações");
    }
    else if (weakness.includes("Palavra-chave principal ausente no primeiro parágrafo")) {
      suggestions.push("Inclua a palavra-chave principal naturalmente no primeiro parágrafo");
    }
    else if (weakness.includes("Palavras-chave ausentes em cabeçalhos")) {
      suggestions.push("Incorpore palavras-chave em alguns cabeçalhos H2 ou H3 de forma natural");
    }
    else if (weakness.includes("Ausência de cabeçalhos H2")) {
      suggestions.push("Adicione cabeçalhos H2 para estruturar melhor o conteúdo e facilitar a leitura");
    }
    else if (weakness.includes("Poucos cabeçalhos para a extensão do conteúdo")) {
      suggestions.push("Adicione mais cabeçalhos para dividir o conteúdo em seções menores");
    }
    else if (weakness.includes("Ausência de listas para quebrar o texto")) {
      suggestions.push("Utilize listas ordenadas ou não-ordenadas para melhorar a escaneabilidade");
    }
    else if (weakness.includes("Parágrafos muito longos")) {
      suggestions.push("Divida parágrafos longos em unidades menores, idealmente com menos de 150 caracteres");
    }
    else if (weakness.includes("Ausência de dados estruturados")) {
      suggestions.push("Adicione marcação schema.org para melhorar a compreensão do conteúdo pelos motores de busca");
    }
    else if (weakness.includes("Texto de difícil leitura")) {
      suggestions.push("Simplifique o texto usando frases mais curtas e vocabulário mais acessível");
    }
    else if (weakness.includes("Sentenças longas dificultam a leitura")) {
      suggestions.push("Reduza o comprimento das sentenças, mantendo-as idealmente abaixo de 20 palavras");
    }
    else if (weakness.includes("Conteúdo curto")) {
      suggestions.push("Expanda o conteúdo para pelo menos 750-1000 palavras para maior profundidade e relevância");
    }
  }
  
  // Adicionar sugestões baseadas na pontuação
  if (score < 40) {
    suggestions.push("Considere uma revisão completa do conteúdo para otimização SEO");
  } else if (score < 60) {
    suggestions.push("Implemente as sugestões acima para melhorar sua pontuação SEO");
  } else if (score < 80) {
    suggestions.push("Seu conteúdo está no caminho certo, mas pode ser ainda mais otimizado");
  }
  
  return suggestions;
}

/**
 * Gera um snippet para meta descrição otimizado para SEO
 * 
 * @param {string} content - Conteúdo do artigo
 * @param {string} title - Título do artigo
 * @param {Array<string>} keywords - Palavras-chave alvo
 * @returns {string} - Meta descrição otimizada
 */
export function generateMetaDescription(content, title, keywords = []) {
  if (!content) return '';
  
  // Extrair texto do primeiro e segundo parágrafos
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const paragraphs = plainText.split(/\n\s*\n/);
  
  // Combinar primeiros parágrafos
  let baseText = (paragraphs[0] || '') + ' ' + (paragraphs[1] || '');
  baseText = baseText.substring(0, 300); // Limitar tamanho
  
  // Verificar se as palavras-chave estão presentes
  const mainKeyword = keywords.length > 0 ? keywords[0].toLowerCase() : '';
  const hasKeyword = mainKeyword && baseText.toLowerCase().includes(mainKeyword);
  
  // Se a palavra-chave não estiver presente, tentar incluí-la
  if (!hasKeyword && mainKeyword) {
    // Encurtar texto para incluir a palavra-chave
    baseText = baseText.substring(0, 250);
    baseText += ` ... Saiba mais sobre ${mainKeyword} neste artigo.`;
  }
  
  // Limitar a 160 caracteres (tamanho recomendado para meta description)
  let metaDescription = baseText.substring(0, 157);
  if (metaDescription.length < baseText.length) {
    metaDescription += '...';
  }
  
  return metaDescription;
}

export default {
  analyzeSeoScore,
  getSeoImprovementSuggestions,
  generateMetaDescription
}; 