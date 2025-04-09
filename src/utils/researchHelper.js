/**
 * Módulo auxiliar de pesquisa e processamento de dados
 * 
 * Fornece funções para realizar pesquisas, processar resultados
 * e extrair informações relevantes para a geração de conteúdo.
 */
import { PERPLEXITY_API_KEY, OPENAI_API_KEY, AI_MODELS } from '../config/apiKeys';

/**
 * Realiza uma pesquisa utilizando a API da Perplexity
 * @param {string} query - Consulta de pesquisa
 * @param {string} recencyFilter - Filtro de recência ('hour', 'day', 'week', 'month')
 * @returns {Promise<object>} - Resultados da pesquisa
 */
export async function performSearch(query, recencyFilter = 'month') {
  try {
    console.log(`Realizando pesquisa: "${query}" (filtro: ${recencyFilter})`);
    
    const response = await fetch('https://api.perplexity.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        query,
        search_recency_filter: recencyFilter
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro Perplexity: ${error.error?.message || response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao realizar pesquisa:', error);
    throw new Error(`Falha na pesquisa: ${error.message}`);
  }
}

/**
 * Processa os resultados da pesquisa para extrair informações úteis
 * @param {object} searchResults - Resultados de pesquisa da Perplexity
 * @returns {object} - Dados processados
 */
export function processSearchResults(searchResults) {
  try {
    // Extrair o texto principal (answer)
    const mainText = searchResults.answer || '';
    
    // Processar fontes
    const sources = (searchResults.web_search_results || []).map(result => {
      // Extrair domínio da URL
      let domain = '';
      try {
        const url = new URL(result.url);
        domain = url.hostname.replace(/^www\./, '');
      } catch (e) {
        domain = result.url.split('/')[2] || '';
      }
      
      return {
        title: result.title || '',
        url: result.url,
        domain,
        snippet: result.snippet || '',
        position: result.position
      };
    });
    
    // Identificar tópicos principais
    const topics = extractMainTopics(mainText);
    
    return {
      mainText,
      sources,
      topics,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao processar resultados:', error);
    return {
      mainText: searchResults.answer || '',
      sources: [],
      topics: [],
      error: error.message
    };
  }
}

/**
 * Extrai os principais tópicos de um texto
 * @param {string} text - Texto para análise
 * @returns {Array<string>} - Lista de tópicos identificados
 */
function extractMainTopics(text) {
  // Implementação básica - extração de frases-chave
  // Em um sistema mais avançado poderia usar NLP
  
  // Dividir por parágrafos e sentenças
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  
  // Identificar sentenças que parecem ser tópicos principais
  // (geralmente primeiras sentenças de parágrafos ou com certas palavras-chave)
  const potentialTopics = [];
  
  for (const paragraph of paragraphs) {
    // Dividir em sentenças
    const sentences = paragraph.split(/[.!?]/).filter(s => s.trim().length > 10);
    
    if (sentences.length > 0) {
      // Primeira sentença do parágrafo é frequentemente um tópico importante
      potentialTopics.push(sentences[0].trim());
      
      // Verificar outras sentenças que parecem ser tópicos
      for (let i = 1; i < sentences.length; i++) {
        const sentence = sentences[i].trim();
        
        // Verificar se a sentença contém palavras-chave indicativas de tópicos
        if (
          /importante|principal|essencial|chave|fundamental|crítico|destacar|ressaltar/i.test(sentence) &&
          sentence.length < 150
        ) {
          potentialTopics.push(sentence);
        }
      }
    }
  }
  
  // Limitar e filtrar tópicos repetitivos
  return [...new Set(potentialTopics)].slice(0, 8);
}

/**
 * Extrai fatos importantes do texto de pesquisa
 * @param {string} text - Texto da pesquisa
 * @returns {Array<string>} - Fatos extraídos
 */
export function extractImportantFacts(text) {
  // Dividir por parágrafos
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  
  // Extrair sentenças que contêm informações factuais
  const facts = [];
  
  // Padrões que indicam fatos
  const factPatterns = [
    /de acordo com|segundo|conforme|estudo|pesquisa|dados|estatísticas|análise/i,
    /em \d{4}|\d{4}|recentemente|atualmente|hoje/i,
    /\d+%|\d+ por cento|aumentou|diminuiu|cresceu|reduziu/i,
    /é importante|é essencial|é fundamental|é necessário|deve-se considerar/i
  ];
  
  // Processar cada parágrafo
  for (const paragraph of paragraphs) {
    // Dividir em sentenças
    const sentences = paragraph.split(/[.!?]/).filter(s => s.trim().length > 15 && s.trim().length < 200);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      
      // Verificar se a sentença contém padrões de fatos
      const isFact = factPatterns.some(pattern => pattern.test(trimmed));
      
      if (isFact && !facts.includes(trimmed)) {
        facts.push(trimmed);
      }
    }
  }
  
  // Limitar o número de fatos
  return [...new Set(facts)].slice(0, 12);
}

/**
 * Gera perguntas relacionadas ao tópico usando a OpenAI
 * @param {string} topic - Tópico principal
 * @param {Array<string>} facts - Fatos já conhecidos
 * @returns {Promise<Array<string>>} - Perguntas relacionadas
 */
export async function generateRelatedQuestions(topic, facts) {
  try {
    const factsText = facts.map(f => `- ${f}`).join('\n');
    
    const prompt = `
Com base no tópico "${topic}" e nos seguintes fatos conhecidos, 
gere 3-5 perguntas importantes e específicas para pesquisa 
adicional que ajudariam a criar um artigo mais aprofundado.

FATOS CONHECIDOS:
${factsText}

DIRETRIZES:
- Formule perguntas que explorem aspectos ainda não cobertos pelos fatos
- Foque em perguntas que gerariam informações práticas e úteis
- Evite perguntas genéricas ou muito amplas
- Priorize perguntas relacionadas a estatísticas recentes, estudos, tendências ou exemplos práticos
- As perguntas devem ser específicas e direcionadas para busca

Retorne apenas a lista numerada de perguntas, sem comentários adicionais.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODELS.openai.default,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Erro OpenAI: ${error.error?.message || 'Desconhecido'}`);
    }

    const data = await response.json();
    const questionsRaw = data.choices[0].message.content;
    
    // Processar o texto para extrair as perguntas
    return questionsRaw
      .split('\n')
      .filter(line => /^\d+\./.test(line)) // Filtrar linhas que começam com número e ponto
      .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remover o número do início
      .filter(question => question.length > 10); // Filtrar perguntas muito curtas
      
  } catch (error) {
    console.error('Erro ao gerar perguntas relacionadas:', error);
    return [
      `Quais são as tendências recentes em ${topic}?`,
      `Quais são os principais desafios relacionados a ${topic}?`,
      `Quais são os benefícios de ${topic}?`
    ];
  }
}

/**
 * Analisa a relevância de uma fonte de informação para o tópico
 * @param {string} topic - Tópico principal
 * @param {object} source - Fonte a ser analisada
 * @returns {number} - Pontuação de relevância (0-1)
 */
export function analyzeSourceRelevance(topic, source) {
  const lowerTopic = topic.toLowerCase();
  const lowerTitle = source.title.toLowerCase();
  const lowerSnippet = source.snippet.toLowerCase();
  
  let relevanceScore = 0;
  
  // Verificar se o título contém o tópico
  if (lowerTitle.includes(lowerTopic)) {
    relevanceScore += 0.5;
  }
  
  // Verificar se o snippet contém o tópico
  if (lowerSnippet.includes(lowerTopic)) {
    relevanceScore += 0.3;
  }
  
  // Verificar a posição nos resultados (quanto menor, mais relevante)
  if (source.position <= 3) {
    relevanceScore += 0.2;
  }
  
  // Verificar se é de um domínio confiável
  const trustworthyDomains = [
    'gov', 'edu', 'org', 'forbes', 'harvard', 'mit', 'stanford', 'nytimes',
    'bbc', 'reuters', 'bloomberg', 'wsj', 'economist'
  ];
  
  const hasTrustworthyDomain = trustworthyDomains.some(domain => 
    source.domain.includes(domain)
  );
  
  if (hasTrustworthyDomain) {
    relevanceScore += 0.2;
  }
  
  // Limitar a pontuação a 1
  return Math.min(relevanceScore, 1);
}

/**
 * Analisa a atualidade da informação com base no texto
 * @param {string} text - Texto para análise
 * @returns {object} - Análise de atualidade
 */
export function analyzeDataFreshness(text) {
  // Padrões para busca de datas no texto
  const yearPattern = /\b(20\d{2})\b/g;
  const recentYearPattern = /\b(202[2-4])\b/g;
  const recentTerms = [
    'recentemente', 'atual', 'hoje', 'este ano', 'último ano',
    'este mês', 'mês passado', 'atualmente', 'nova pesquisa',
    'novo estudo', 'últimos dados'
  ];
  
  // Buscar anos mencionados
  const years = [];
  let match;
  while ((match = yearPattern.exec(text)) !== null) {
    years.push(parseInt(match[1]));
  }
  
  // Verificar anos recentes
  const hasRecentYears = (text.match(recentYearPattern) || []).length > 0;
  
  // Verificar termos recentes
  const hasRecentTerms = recentTerms.some(term => text.toLowerCase().includes(term));
  
  // Ordenar anos encontrados
  const sortedYears = [...new Set(years)].sort((a, b) => b - a);
  
  // Calcular pontuação de atualidade
  const currentYear = new Date().getFullYear();
  let freshnessScore = 0;
  
  if (sortedYears.length > 0) {
    const mostRecentYear = sortedYears[0];
    // Diferença para o ano atual (máx 5 anos)
    const yearDiff = Math.min(currentYear - mostRecentYear, 5);
    freshnessScore = 1 - (yearDiff / 5);
  }
  
  // Ajustar com base em termos recentes
  if (hasRecentTerms) {
    freshnessScore = Math.min(freshnessScore + 0.2, 1);
  }
  
  return {
    mentionedYears: sortedYears,
    mostRecentYear: sortedYears[0] || null,
    hasRecentYearMentions: hasRecentYears,
    hasRecentTerms,
    freshnessScore,
    isConsideredRecent: freshnessScore > 0.7
  };
}

export default {
  performSearch,
  processSearchResults,
  extractImportantFacts,
  generateRelatedQuestions,
  analyzeSourceRelevance,
  analyzeDataFreshness
}; 