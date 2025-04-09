/**
 * Sistema de Geração de Conteúdo Avançado
 * 
 * Integração com OpenAI e Perplexity para produção de conteúdo otimizado,
 * fact-checking, enriquecimento automático e estruturação SEO-friendly.
 */

import axios from 'axios';
import { 
  OPENAI_API_KEY, 
  PERPLEXITY_API_KEY, 
  AI_MODELS, 
  TRUSTED_DOMAINS 
} from '../config/apiKeys';

/**
 * Consulta a API OpenAI com controle avançado de parâmetros
 * 
 * @param {Object} options - Opções para a chamada da API
 * @param {String} options.model - Modelo a ser utilizado (default: configuração padrão)
 * @param {Array} options.messages - Array de mensagens no formato ChatGPT
 * @param {Number} options.temperature - Temperatura para geração (0.0 a 1.0)
 * @param {Number} options.maxTokens - Máximo de tokens na resposta
 * @param {Boolean} options.stream - Se a resposta deve ser streaming
 * @param {Function} options.onChunk - Callback para cada chunk (se stream=true)
 * @returns {Promise<String>} - Texto da resposta ou null em caso de erro
 */
export async function queryOpenAI({ 
  model = AI_MODELS.openai.default,
  messages,
  temperature = AI_MODELS.openai.temperature.balanced,
  maxTokens = AI_MODELS.openai.maxTokens.medium,
  stream = false,
  onChunk = null
}) {
  try {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      data: {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream
      }
    };

    if (stream && typeof onChunk === 'function') {
      requestOptions.responseType = 'stream';
      const response = await axios(endpoint, requestOptions);
      
      let accumulatedText = '';
      for await (const chunk of response.data) {
        const chunkText = extractTextFromChunk(chunk.toString());
        if (chunkText) {
          accumulatedText += chunkText;
          onChunk(chunkText, accumulatedText);
        }
      }
      return accumulatedText;
    } else {
      const response = await axios(endpoint, requestOptions);
      return response.data.choices[0].message.content;
    }
  } catch (error) {
    console.error('Erro ao consultar OpenAI:', error);
    return null;
  }
}

/**
 * Extrai texto de um chunk de streaming da OpenAI
 */
function extractTextFromChunk(chunk) {
  try {
    if (!chunk.includes('data: ')) return '';
    const data = chunk.replace('data: ', '');
    if (data === '[DONE]') return '';
    
    const parsed = JSON.parse(data);
    return parsed.choices[0].delta.content || '';
  } catch {
    return '';
  }
}

/**
 * Consulta Perplexity API para pesquisa em tempo real
 * 
 * @param {String} query - Consulta para pesquisa
 * @param {String} recencyFilter - Filtro de tempo (hour, day, week, month ou null)
 * @returns {Promise<Object>} - Resultado da pesquisa ou null em caso de erro
 */
export async function queryPerplexity(query, recencyFilter = null) {
  try {
    const endpoint = 'https://api.perplexity.ai/search';
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      data: {
        query,
        search_recency_filter: recencyFilter
      }
    };

    const response = await axios(endpoint, requestOptions);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar Perplexity:', error);
    return null;
  }
}

/**
 * Gera um artigo completo com pesquisa integrada e otimizado para SEO
 * 
 * @param {String} topic - Tópico principal do artigo
 * @param {Object} options - Opções para geração do artigo
 * @param {String} options.tone - Tom do artigo (informativo, persuasivo, conversacional)
 * @param {String} options.audience - Público-alvo (iniciante, intermediário, especialista)
 * @param {Number} options.minWords - Número mínimo de palavras (default: 800)
 * @param {Number} options.maxWords - Número máximo de palavras (default: 1500)
 * @param {Boolean} options.includeSources - Se deve incluir fontes confiáveis
 * @param {Boolean} options.includeFAQs - Se deve incluir perguntas frequentes
 * @param {Boolean} options.includeMetadata - Se deve gerar metadados para SEO
 * @param {Function} options.onProgress - Callback para acompanhar progresso
 * @returns {Promise<Object>} - Artigo e metadados relacionados
 */
export async function generateArticle(topic, {
  tone = 'informativo',
  audience = 'intermediário',
  minWords = 800,
  maxWords = 1500,
  includeSources = true,
  includeFAQs = true,
  includeMetadata = true,
  onProgress = null
} = {}) {
  // Função de progresso
  const reportProgress = (stage, message, percentage) => {
    if (typeof onProgress === 'function') {
      onProgress({ stage, message, percentage });
    }
  };
  
  // 1. Pesquisa inicial com Perplexity
  reportProgress('research', 'Realizando pesquisa inicial...', 10);
  const initialResearch = await queryPerplexity(
    `Pesquise dados atualizados e relevantes sobre: ${topic}`,
    AI_MODELS.perplexity.recencyFilters.month
  );
  
  if (!initialResearch || !initialResearch.text) {
    throw new Error('Falha na pesquisa inicial do tópico');
  }
  
  // 2. Extrair fatos importantes e perguntas para pesquisa secundária
  reportProgress('analysis', 'Analisando dados e extraindo fatos relevantes...', 25);
  const keyInsights = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.factual,
    messages: [
      { role: 'system', content: 'Você é um especialista em análise de conteúdo. Extraia os 5 fatos mais importantes e 3 perguntas que precisam de mais pesquisa.' },
      { role: 'user', content: `Analise esta pesquisa sobre "${topic}" e extraia: 1) 5 fatos principais e dados, 2) 3 perguntas específicas que precisam de mais pesquisa para enriquecer o conteúdo.\n\nPesquisa:\n${initialResearch.text}` }
    ]
  });

  // 3. Pesquisa secundária para responder às perguntas encontradas
  reportProgress('secondary_research', 'Realizando pesquisa complementar...', 40);
  let secondaryResearch = '';
  
  try {
    // Extrair perguntas do resultado da análise
    const questionsMatch = keyInsights.match(/(?:Perguntas|Questões)(?:\s+para\s+pesquisa)?:\s*((?:.+\?\s*)+)/i);
    if (questionsMatch && questionsMatch[1]) {
      const questions = questionsMatch[1].match(/[^.!?]+[.!?]+/g) || [];
      
      // Pesquisar cada pergunta
      for (const question of questions) {
        const research = await queryPerplexity(
          question.trim(),
          AI_MODELS.perplexity.recencyFilters.month
        );
        
        if (research && research.text) {
          secondaryResearch += `\n\nPesquisa sobre: ${question.trim()}\n${research.text}`;
        }
      }
    }
  } catch (error) {
    console.error('Erro na pesquisa secundária:', error);
    // Continuar mesmo com falha na pesquisa secundária
  }
  
  // 4. Organizar o conteúdo e criar o esboço do artigo
  reportProgress('outlining', 'Organizando estrutura do artigo...', 55);
  const outline = await queryOpenAI({
    model: AI_MODELS.openai.default,
    temperature: AI_MODELS.openai.temperature.precise,
    messages: [
      { role: 'system', content: 'Você é um editor profissional especializado em criar estruturas eficazes para artigos.' },
      { role: 'user', content: `Com base nas pesquisas a seguir, crie uma estrutura detalhada para um artigo sobre "${topic}" com tom ${tone} para um público ${audience}. Inclua título, subtítulos principais e pontos-chave para cada seção.\n\nPesquisa principal:\n${initialResearch.text}\n\nInsights adicionais:\n${keyInsights}\n\nPesquisa secundária:\n${secondaryResearch}` }
    ]
  });
  
  // 5. Gerar o artigo completo
  reportProgress('writing', 'Gerando conteúdo principal...', 70);
  
  // Construir prompt para article
  const articlePrompt = `
Escreva um artigo completo e otimizado para SEO sobre "${topic}" seguindo esta estrutura:

${outline}

Diretrizes específicas:
- Tom: ${tone}
- Público-alvo: ${audience} 
- Extensão: entre ${minWords} e ${maxWords} palavras
- Estrutura: introdução envolvente, desenvolvimento com subtítulos H2 e H3, conclusão com call-to-action
- Estilo: parágrafos curtos, linguagem clara, exemplos práticos
${includeSources ? '- Inclua 3-5 referências a fontes confiáveis integradas naturalmente no texto' : ''}
${includeFAQs ? '- Inclua uma seção de Perguntas Frequentes (FAQ) com 3-5 perguntas/respostas relevantes ao final' : ''}
- Use listas, destaques e quebras de texto para melhorar a legibilidade
- Inclua sugestões naturais de palavras-chave relacionadas
- Estruture o texto para otimização SEO mas mantendo qualidade editorial

Use os dados destas pesquisas como base:

PESQUISA PRINCIPAL:
${initialResearch.text}

PESQUISA SECUNDÁRIA:
${secondaryResearch}
`;

  const article = await queryOpenAI({
    model: AI_MODELS.openai.default,
    temperature: AI_MODELS.openai.temperature.balanced,
    maxTokens: AI_MODELS.openai.maxTokens.large,
    messages: [
      { role: 'system', content: 'Você é um redator especializado em conteúdo digital otimizado para SEO com alta qualidade editorial.' },
      { role: 'user', content: articlePrompt }
    ]
  });
  
  // 6. Gerar metadados SEO se solicitado
  let metadata = null;
  if (includeMetadata) {
    reportProgress('metadata', 'Gerando metadados para SEO...', 90);
    metadata = await generateSEOMetadata(article, topic);
  }
  
  // 7. Finalizar e retornar resultado
  reportProgress('complete', 'Artigo completo gerado com sucesso!', 100);
  
  return {
    title: extractTitle(article) || `Artigo sobre ${topic}`,
    content: article,
    metadata,
    outline,
    wordCount: countWords(article),
    generatedAt: new Date().toISOString()
  };
}

/**
 * Extrai o título de um artigo gerado
 */
function extractTitle(article) {
  const titleMatch = article.match(/^\s*#\s+(.+?)(?:\n|$)/) || article.match(/^\s*<h1>(.+?)<\/h1>/) || article.match(/^(.+?)(?:\n|$)/);
  return titleMatch ? titleMatch[1].trim() : null;
}

/**
 * Conta palavras em um texto
 */
function countWords(text) {
  return text.trim().split(/\s+/).length;
}

/**
 * Realiza fact-checking em um artigo usando a Perplexity API
 * 
 * @param {String} article - Texto do artigo para verificar
 * @param {Number} maxClaims - Número máximo de afirmações para verificar
 * @param {Function} onProgress - Callback para acompanhar progresso
 * @returns {Promise<Object>} - Resultado da verificação de fatos
 */
export async function factCheckArticle(article, maxClaims = 8, onProgress = null) {
  // Função de progresso
  const reportProgress = (stage, message, percentage) => {
    if (typeof onProgress === 'function') {
      onProgress({ stage, message, percentage });
    }
  };

  // 1. Extrair afirmações verificáveis do artigo
  reportProgress('extraction', 'Extraindo afirmações verificáveis...', 10);
  const claimsExtraction = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.factual,
    messages: [
      { role: 'system', content: 'Você é um especialista em fact-checking e análise de conteúdo.' },
      { role: 'user', content: `Identifique as ${maxClaims} afirmações mais importantes e verificáveis deste artigo. Foque em dados, estatísticas, fatos históricos e declarações definitivas. Retorne apenas a lista numerada das afirmações, sem comentários adicionais.\n\n${article}` }
    ]
  });

  // Processar as afirmações extraídas
  const claims = claimsExtraction
    .split(/\d+\.\s+/)
    .filter(claim => claim.trim().length > 10)
    .slice(0, maxClaims);
    
  if (claims.length === 0) {
    return {
      verified: true,
      summary: 'Não foram identificadas afirmações verificáveis no texto.',
      claimsChecked: 0,
      verificationResults: []
    };
  }

  // 2. Verificar cada afirmação
  reportProgress('verification', 'Verificando afirmações...', 30);
  const verificationResults = [];
  let claimsChecked = 0;
  
  for (const claim of claims) {
    claimsChecked++;
    reportProgress(
      'verification', 
      `Verificando afirmação ${claimsChecked} de ${claims.length}...`, 
      30 + (60 * claimsChecked / claims.length)
    );
    
    // Realizar verificação com Perplexity
    const verification = await queryPerplexity(
      `Verifique a veracidade desta afirmação e cite fontes confiáveis: "${claim}"`,
      AI_MODELS.perplexity.recencyFilters.month
    );
    
    if (!verification || !verification.text) {
      verificationResults.push({
        claim,
        verified: false,
        result: 'Não foi possível verificar esta afirmação.',
        confidence: 0,
        sources: []
      });
      continue;
    }
    
    // Analisar resultado da verificação
    const analysis = await queryOpenAI({
      model: AI_MODELS.openai.analysis,
      temperature: AI_MODELS.openai.temperature.factual,
      messages: [
        { role: 'system', content: 'Você é um especialista imparcial em fact-checking. Analise a verificação e determine a veracidade da afirmação original.' },
        { role: 'user', content: `Afirmação: "${claim}"\n\nResultado da verificação:\n${verification.text}\n\nFornece uma análise em formato JSON com as seguintes propriedades: verified (boolean), result (string com conclusão), confidence (0-1), sources (array de URLs mencionados), explanation (explicação da análise)` }
      ]
    });
    
    // Extrair resultado em JSON
    try {
      const jsonMatch = analysis.match(/```json\n([\s\S]*)\n```/) || 
                        analysis.match(/({[\s\S]*})/);
      
      const resultJson = jsonMatch 
        ? JSON.parse(jsonMatch[1]) 
        : { 
            verified: false, 
            result: 'Formato de resposta inválido', 
            confidence: 0,
            sources: [],
            explanation: 'Não foi possível analisar o resultado da verificação'
          };
          
      verificationResults.push({
        claim,
        ...resultJson
      });
    } catch (error) {
      console.error('Erro ao processar resultado da verificação:', error);
      verificationResults.push({
        claim,
        verified: false,
        result: 'Erro ao processar verificação',
        confidence: 0,
        sources: [],
        explanation: 'Ocorreu um erro ao tentar analisar o resultado da verificação'
      });
    }
  }
  
  // 3. Gerar resumo da verificação
  reportProgress('summary', 'Analisando resultados e gerando resumo...', 90);
  
  const verifiedCount = verificationResults.filter(r => r.verified).length;
  const unverifiedCount = verificationResults.length - verifiedCount;
  const avgConfidence = verificationResults.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / verificationResults.length;
  
  const summary = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.factual,
    messages: [
      { role: 'system', content: 'Você é um editor especializado em revisão de conteúdo.' },
      { role: 'user', content: `Analise estes resultados de fact-checking e forneça um resumo conciso sobre a precisão factual do artigo. Destaque padrões, principais problemas e uma avaliação geral da confiabilidade.\n\nResultados:\n${JSON.stringify(verificationResults, null, 2)}` }
    ]
  });
  
  // 4. Finalizar e retornar resultado
  reportProgress('complete', 'Verificação de fatos concluída!', 100);
  
  return {
    verified: verifiedCount > unverifiedCount,
    summary,
    claimsChecked: claims.length,
    verificationResults,
    stats: {
      verifiedCount,
      unverifiedCount,
      averageConfidence: avgConfidence
    }
  };
}

/**
 * Enriquece um artigo existente com pesquisa adicional, exemplos e contexto
 * 
 * @param {String} article - Texto do artigo para enriquecer
 * @param {Object} options - Opções para enriquecimento
 * @param {String} options.focus - Foco do enriquecimento (exemplos, dados, contexto, todos)
 * @param {Boolean} options.preserveStructure - Se deve preservar a estrutura original
 * @param {Function} options.onProgress - Callback para acompanhar progresso
 * @returns {Promise<Object>} - Artigo enriquecido e metadados
 */
export async function enrichArticle(article, {
  focus = 'todos',
  preserveStructure = true,
  onProgress = null
} = {}) {
  // Função de progresso
  const reportProgress = (stage, message, percentage) => {
    if (typeof onProgress === 'function') {
      onProgress({ stage, message, percentage });
    }
  };

  // 1. Analisar o artigo para identificar oportunidades de melhoria
  reportProgress('analysis', 'Analisando conteúdo para oportunidades de melhoria...', 10);
  const analysisPrompt = `
Analise este artigo e identifique oportunidades específicas de melhoria nas seguintes áreas:

1. Dados e estatísticas: Onde faltam dados concretos ou estatísticas atualizadas
2. Exemplos práticos: Onde exemplos reais melhorariam a compreensão
3. Contexto: Onde contexto adicional enriqueceria o conteúdo
4. Explicações: Conceitos que poderiam ser explicados com mais clareza
5. Estrutura: Sugestões para melhorar organização e fluidez (se aplicável)

Foco principal: ${focus}
${preserveStructure ? 'Mantenha a estrutura original do artigo (títulos, subtítulos e organização geral).' : 'Você pode sugerir alterações na estrutura do artigo.'}

Artigo:
${article}
`;

  const analysis = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.factual,
    messages: [
      { role: 'system', content: 'Você é um editor sênior especializado em melhorar conteúdo digital.' },
      { role: 'user', content: analysisPrompt }
    ]
  });

  // 2. Identificar tópicos para pesquisa complementar
  reportProgress('research_planning', 'Identificando tópicos para pesquisa complementar...', 25);
  const researchTopicsPrompt = `
Com base na análise anterior das oportunidades de melhoria, identifique 3-5 tópicos específicos
para pesquisa complementar que mais enriqueceriam este artigo.

Para cada tópico, forneça:
1. O tópico específico para pesquisa
2. Uma consulta de pesquisa bem formulada para encontrar informações atualizadas
3. Como essa informação enriqueceria o artigo

Análise de oportunidades:
${analysis}

Artigo original:
${article}
`;

  const researchTopics = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.precise,
    messages: [
      { role: 'system', content: 'Você é um pesquisador especializado em conteúdo digital.' },
      { role: 'user', content: researchTopicsPrompt }
    ]
  });

  // 3. Realizar pesquisas complementares
  reportProgress('research', 'Realizando pesquisas complementares...', 40);
  let complementaryResearch = '';
  
  try {
    // Extrair tópicos/consultas do resultado
    const topicsMatches = researchTopics.match(/(?:Tópico|Consulta)[^:]*:\s*([^\n]+)/g) || [];
    const queries = topicsMatches
      .map(match => match.split(':')[1].trim())
      .filter(query => query.length > 10)
      .slice(0, 5);
    
    // Pesquisar cada tópico
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      reportProgress(
        'research', 
        `Pesquisando tópico ${i+1} de ${queries.length}...`, 
        40 + (20 * i / queries.length)
      );
      
      const research = await queryPerplexity(
        query,
        AI_MODELS.perplexity.recencyFilters.month
      );
      
      if (research && research.text) {
        complementaryResearch += `\n\nPesquisa sobre: ${query}\n${research.text}`;
      }
    }
  } catch (error) {
    console.error('Erro nas pesquisas complementares:', error);
    // Continuar mesmo se houver falha na pesquisa
  }

  // 4. Enriquecer o artigo com base nas pesquisas
  reportProgress('enrichment', 'Enriquecendo o conteúdo do artigo...', 70);
  const enrichmentPrompt = `
Melhore este artigo incorporando as pesquisas complementares e seguindo as oportunidades
de melhoria identificadas. ${preserveStructure ? 'Mantenha a estrutura original.' : 'Melhore a estrutura conforme necessário.'}

Foco principal para enriquecimento: ${focus}

Diretrizes:
- Adicione dados atualizados, exemplos relevantes e contexto onde apropriado
- Melhore explicações de conceitos complexos
- Mantenha o tom e estilo original
- Destaque novas informações importantes
- Integre as novas informações naturalmente no texto
- Mantenha a otimização para SEO

Artigo original:
${article}

Análise de oportunidades:
${analysis}

Pesquisas complementares:
${complementaryResearch}
`;

  const enrichedArticle = await queryOpenAI({
    model: AI_MODELS.openai.default,
    temperature: AI_MODELS.openai.temperature.balanced,
    maxTokens: AI_MODELS.openai.maxTokens.large,
    messages: [
      { role: 'system', content: 'Você é um redator especializado em melhorar conteúdo mantendo estilo original e otimizando para SEO.' },
      { role: 'user', content: enrichmentPrompt }
    ]
  });

  // 5. Gerar resumo das melhorias
  reportProgress('summary', 'Gerando resumo das melhorias realizadas...', 90);
  const improvementsSummary = await queryOpenAI({
    model: AI_MODELS.openai.analysis,
    temperature: AI_MODELS.openai.temperature.precise,
    messages: [
      { role: 'system', content: 'Você é um editor especializado em revisão e melhoria de conteúdo.' },
      { role: 'user', content: `Compare o artigo original e a versão enriquecida. Liste as principais melhorias e adições realizadas, destacando como o conteúdo foi aprimorado.\n\nArtigo original:\n${article}\n\nArtigo enriquecido:\n${enrichedArticle}` }
    ]
  });

  // 6. Finalizar e retornar resultado
  reportProgress('complete', 'Artigo enriquecido com sucesso!', 100);
  
  return {
    originalContent: article,
    enrichedContent: enrichedArticle,
    improvementsSummary,
    wordCountOriginal: countWords(article),
    wordCountEnriched: countWords(enrichedArticle),
    enrichedAt: new Date().toISOString()
  };
}

/**
 * Gera metadados SEO otimizados para um artigo
 * 
 * @param {String} article - Texto do artigo
 * @param {String} topic - Tópico principal do artigo (opcional)
 * @returns {Promise<Object>} - Metadados para SEO
 */
export async function generateSEOMetadata(article, topic = '') {
  try {
    const prompt = `
Analise este artigo e gere metadados completos otimizados para SEO.
${topic ? `O tópico principal é "${topic}".` : ''}

Forneça como resposta um objeto JSON com as seguintes propriedades:
- title: Título SEO otimizado (55-60 caracteres)
- description: Meta descrição envolvente (145-155 caracteres)
- keywords: Array com 5-10 palavras-chave relevantes (principais e long-tail)
- canonicalUrl: Sugestão de URL canônica baseada no título
- h1: Tag H1 principal recomendada
- structuredData: Objeto com Schema.org markup recomendado
- openGraph: Objeto com tags para Open Graph
- twitterCard: Objeto com configurações para Twitter Card
- suggestedImagesAlt: Array com 3 sugestões de textos alt para imagens
- estimatedReadTime: Tempo estimado de leitura em minutos
- suggestedCategories: Array com categorias recomendadas para o artigo
- suggestedInternalLinks: Array com 3-5 sugestões de tópicos relacionados para links internos
- faq: Array com 3-5 perguntas e respostas frequentes sugeridas para FAQ Schema

Artigo:
${article.length > 8000 ? article.substring(0, 8000) + '...' : article}
`;

    const result = await queryOpenAI({
      model: AI_MODELS.openai.analysis,
      temperature: AI_MODELS.openai.temperature.precise,
      messages: [
        { role: 'system', content: 'Você é um especialista em SEO técnico e otimização de conteúdo.' },
        { role: 'user', content: prompt }
      ]
    });

    // Extrair e processar o JSON
    try {
      const jsonMatch = result.match(/```json\n([\s\S]*)\n```/) || 
                        result.match(/({[\s\S]*})/);
                        
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }
      
      const metadata = JSON.parse(jsonMatch[1]);
      
      // Garantir propriedades essenciais
      return {
        title: metadata.title || extractTitle(article) || `Artigo sobre ${topic}`,
        description: metadata.description || '',
        keywords: Array.isArray(metadata.keywords) ? metadata.keywords : [],
        canonicalUrl: metadata.canonicalUrl || '',
        h1: metadata.h1 || metadata.title || '',
        structuredData: metadata.structuredData || {},
        openGraph: metadata.openGraph || {},
        twitterCard: metadata.twitterCard || {},
        suggestedImagesAlt: Array.isArray(metadata.suggestedImagesAlt) ? metadata.suggestedImagesAlt : [],
        estimatedReadTime: metadata.estimatedReadTime || Math.ceil(countWords(article) / 200),
        suggestedCategories: Array.isArray(metadata.suggestedCategories) ? metadata.suggestedCategories : [],
        suggestedInternalLinks: Array.isArray(metadata.suggestedInternalLinks) ? metadata.suggestedInternalLinks : [],
        faq: Array.isArray(metadata.faq) ? metadata.faq : []
      };
    } catch (error) {
      console.error('Erro ao processar metadados:', error);
      
      // Fallback para metadados básicos
      return {
        title: extractTitle(article) || `Artigo sobre ${topic}`,
        description: article.substring(0, 150) + '...',
        keywords: topic.split(/\s+/).filter(word => word.length > 3),
        estimatedReadTime: Math.ceil(countWords(article) / 200),
        generatedAt: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Erro ao gerar metadados SEO:', error);
    return null;
  }
}

export default {
  queryOpenAI,
  queryPerplexity,
  generateArticle,
  factCheckArticle,
  enrichArticle,
  generateSEOMetadata
}; 