import axios from 'axios';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

// Endpoint da API da Perplexity
const PERPLEXITY_API_ENDPOINT = 'https://api.perplexity.ai/chat/completions';

/**
 * Função para fazer uma consulta à API da Perplexity
 * @param {string} query - Consulta a ser enviada
 * @param {Object} options - Opções adicionais
 * @returns {Promise<string>} Resposta da API
 */
export async function searchWithPerplexity(query, options = {}) {
  try {
    const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
    
    if (!perplexityApiKey) {
      throw new Error('PERPLEXITY_API_KEY não encontrada nas variáveis de ambiente');
    }
    
    const defaultOptions = {
      temperature: 0.1,
      max_tokens: 1000,
      systemPrompt: 'Você é um assistente de pesquisa especialista em construção civil e reformas residenciais. Forneça informações precisas e atualizadas, com foco em dados verificáveis e técnicos.'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    const response = await axios.post(
      PERPLEXITY_API_ENDPOINT,
      {
        model: 'llama-3-sonar-small-32k-online',
        messages: [
          {
            role: 'system',
            content: mergedOptions.systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        options: {
          temperature: mergedOptions.temperature,
          max_tokens: mergedOptions.max_tokens
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${perplexityApiKey}`
        }
      }
    );
    
    return {
      text: response.data.choices[0].message.content,
      searchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao consultar a API da Perplexity:', error);
    throw error;
  }
}

/**
 * Busca informações atuais sobre um tópico com dados estruturados de múltiplas fontes
 * @param {string} topic - Tópico para buscar informações
 * @param {Object} options - Opções para customizar a busca
 * @returns {Promise<Object>} Dados estruturados sobre o tópico
 */
export async function getLatestInfo(topic, options = {}) {
  try {
    const defaultOptions = {
      includeTechnicalData: true,
      includeCostEstimates: true,
      includeLocalContext: true, // Contexto brasileiro
      maxSources: 5
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Primeira busca: visão geral com contexto técnico atualizado
    const overviewQuery = `
    Forneça uma análise abrangente e atualizada sobre "${topic}" no contexto de reformas e construção civil no Brasil.
    
    Por favor, estruture sua resposta com as seguintes seções claramente delimitadas:
    
    ## VISÃO GERAL
    Uma introdução completa ao tema que explique o contexto atual, importância e aplicações principais. (300-400 palavras)
    
    ## ESPECIFICAÇÕES TÉCNICAS
    Dados técnicos específicos, considerações normativas (ABNT/normas brasileiras aplicáveis) e parâmetros mensuráveis. Inclua números precisos quando disponíveis. (200-250 palavras)
    ${mergedOptions.includeTechnicalData ? '' : '(Pule esta seção)'}
    
    ## ANÁLISE DE CUSTOS
    Faixas de preço atuais no mercado brasileiro, fatores que influenciam os custos e considerações de custo-benefício. Use dados de 2023-2024 sempre que possível. (150-200 palavras)
    ${mergedOptions.includeCostEstimates ? '' : '(Pule esta seção)'}
    
    ## CONTEXTO REGIONAL
    Considerações específicas para o mercado brasileiro, incluindo disponibilidade de materiais, práticas comuns e adaptações climáticas regionais. (150-200 palavras)
    ${mergedOptions.includeLocalContext ? '' : '(Pule esta seção)'}
    
    Mantenha uma abordagem estritamente factual, priorizando informações verificáveis e atuais. Cite fontes específicas quando mencionar estatísticas ou dados específicos.
    `;
    
    const overviewResponse = await searchWithPerplexity(overviewQuery, {
      temperature: 0.1,
      max_tokens: 2000,
      systemPrompt: 'Você é um especialista técnico em construção civil e reformas com conhecimento profundo do mercado brasileiro. Forneça apenas informações verificáveis, baseadas em dados atuais (2023-2024) e de alta qualidade técnica.'
    });
    
    // Segunda busca: tendências e inovações recentes
    const trendsQuery = `
    Identifique as tendências mais recentes e inovações emergentes relacionadas a "${topic}" no contexto de reformas e construção civil.
    
    Estruture sua resposta nos seguintes tópicos:
    
    ## TENDÊNCIAS DE MERCADO
    Principais tendências observadas nos últimos 12 meses, com dados estatísticos quando disponíveis. (150-200 palavras)
    
    ## INOVAÇÕES TÉCNICAS
    Avanços recentes em materiais, métodos ou tecnologias relevantes para ${topic}. Foque em inovações com aplicação prática. (150-200 palavras)
    
    ## PREVISÕES
    Expectativas do mercado para os próximos 12-24 meses, baseadas em análises de especialistas do setor. (100-150 palavras)
    
    Forneça informações concretas e específicas, evitando generalidades. Mencione sempre o período/data da informação (mês/ano) para contextualização temporal.
    `;
    
    const trendsResponse = await searchWithPerplexity(trendsQuery, {
      temperature: 0.2,
      max_tokens: 1500,
      systemPrompt: 'Você é um analista de tendências do mercado de construção civil especializado em identificar e avaliar tendências emergentes e inovações técnicas. Seu foco é fornecer insights atualizados (2023-2024) com base em fontes confiáveis do setor.'
    });
    
    // Terceira busca: fontes confiáveis com estrutura de dados aprimorada
    const sourcesQuery = `
    Identifique ${mergedOptions.maxSources} fontes confiáveis, específicas e recentes (2022-2024) com informações técnicas sobre "${topic}" no contexto de reformas e construção civil no Brasil.
    
    Para cada fonte, forneça os seguintes dados em formato claramente estruturado:
    
    1. Título completo da publicação/artigo
    2. Autor ou organização responsável
    3. Data exata de publicação (mês/ano, ou dia/mês/ano se disponível)
    4. URL completa e funcional (quando disponível online)
    5. Tipo de fonte (artigo técnico, norma ABNT, publicação acadêmica, site especializado, etc.)
    6. Resumo conciso dos principais pontos relevantes (2-3 frases)
    7. Relevância (alta, média ou baixa) para o tema específico
    
    Inclua apenas fontes que contenham dados técnicos verificáveis e de qualidade. Priorize fontes brasileiras, mas inclua referências internacionais relevantes quando apropriado.
    
    Para facilitar o processamento posterior, formate cada fonte usando exatamente este padrão estruturado:
    
    [FONTE]
    Título: (título completo)
    Autor: (nome do autor/organização)
    Data: (data de publicação)
    URL: (url completa se disponível, ou "Não disponível online")
    Tipo: (tipo de fonte)
    Resumo: (resumo conciso)
    Relevância: (alta/média/baixa)
    [/FONTE]
    `;
    
    const sourcesResponse = await searchWithPerplexity(sourcesQuery, {
      temperature: 0.1,
      max_tokens: 2000,
      systemPrompt: 'Você é um bibliotecário de referências técnicas especializado em construção civil e reformas. Seu objetivo é identificar e catalogar fontes de alta qualidade, recentes e relevantes, priorizando conteúdo técnico verificável e especializado. Formate rigorosamente cada fonte conforme solicitado.'
    });
    
    // Processa as fontes com um parser mais robusto
    const sources = processSourceData(sourcesResponse.text);
    
    // Quarta busca: perguntas frequentes com respostas técnicas precisas
    const faqQuery = `
    Crie uma seção de FAQ (Perguntas Frequentes) técnicas sobre "${topic}" no contexto de reformas e construção civil.
    
    Identifique 5-7 perguntas genuinamente frequentes e relevantes, baseadas em dúvidas comuns de:
    - Proprietários de imóveis planejando reformas
    - Profissionais da construção civil
    - Questões técnicas específicas sobre materiais, métodos ou regulamentações
    
    Para cada pergunta:
    1. Formule uma questão clara e direta
    2. Forneça uma resposta técnica precisa, baseada em fatos verificáveis
    3. Mantenha cada resposta concisa (3-5 frases)
    4. Inclua referências específicas a normas técnicas ou fontes quando relevante
    
    Evite perguntas genéricas ou óbvias. Foque em dúvidas específicas e técnicas que realmente agregam valor.
    
    Formato:
    
    [PERGUNTA]
    Questão: (texto da pergunta)
    Resposta: (resposta técnica precisa)
    [/PERGUNTA]
    `;
    
    const faqResponse = await searchWithPerplexity(faqQuery, {
      temperature: 0.2,
      max_tokens: 1500,
      systemPrompt: 'Você é um especialista técnico que responde perguntas sobre construção civil e reformas. Seu objetivo é identificar dúvidas genuinamente relevantes e fornecer respostas técnicas precisas, baseadas em fatos verificáveis e conhecimento especializado. Mantenha suas respostas objetivas e tecnicamente corretas.'
    });
    
    // Processa as perguntas frequentes
    const faqs = processFAQData(faqResponse.text);
    
    // Processa seções do conteúdo principal
    const processedOverview = processContentSections(overviewResponse.text);
    
    // Processa tendências em seções estruturadas
    const processedTrends = processContentSections(trendsResponse.text);
    
    return {
      overview: {
        general: processedOverview.VISÃO_GERAL || processedOverview.VISAO_GERAL || '',
        technical: processedOverview.ESPECIFICAÇÕES_TÉCNICAS || processedOverview.ESPECIFICACOES_TECNICAS || '',
        costs: processedOverview.ANÁLISE_DE_CUSTOS || processedOverview.ANALISE_DE_CUSTOS || '',
        regional: processedOverview.CONTEXTO_REGIONAL || '',
      },
      trends: {
        market: processedTrends.TENDÊNCIAS_DE_MERCADO || processedTrends.TENDENCIAS_DE_MERCADO || '',
        innovations: processedTrends.INOVAÇÕES_TÉCNICAS || processedTrends.INOVACOES_TECNICAS || '',
        predictions: processedTrends.PREVISÕES || processedTrends.PREVISOES || '',
      },
      sources: sources,
      faqs: faqs,
      searchedAt: new Date().toISOString(),
      metadata: {
        topic: topic,
        sourcesCount: sources.length,
        faqsCount: faqs.length,
        options: mergedOptions
      }
    };
  } catch (error) {
    console.error(`Erro ao obter informações atuais sobre ${topic}:`, error);
    return {
      overview: {
        general: `Não foi possível obter informações detalhadas sobre ${topic}.`,
        technical: '',
        costs: '',
        regional: '',
      },
      trends: {
        market: '',
        innovations: '',
        predictions: '',
      },
      sources: [],
      faqs: [],
      searchedAt: new Date().toISOString(),
      error: error.message,
      metadata: {
        topic: topic,
        sourcesCount: 0,
        faqsCount: 0
      }
    };
  }
}

/**
 * Processa o texto de fontes em uma estrutura mais utilizável
 * @param {string} sourcesText - Texto com as fontes
 * @returns {Array} Array de objetos com informações das fontes
 */
function processSourceData(sourcesText) {
  try {
    // Expressão regular aprimorada para extrair blocos de fontes delimitados
    const sourceBlocksRegex = /\[FONTE\]([\s\S]*?)\[\/FONTE\]/g;
    const sourceMatches = [...sourcesText.matchAll(sourceBlocksRegex)];
    
    if (sourceMatches.length === 0) {
      // Fallback para o formato anterior, caso necessário
      return processLegacySourceFormat(sourcesText);
    }
    
    return sourceMatches.map(match => {
      const sourceBlock = match[1].trim();
      
      // Extrai cada campo com regex mais robustas
      const titleMatch = sourceBlock.match(/Título:\s*(.*?)(?=\n|$)/);
      const authorMatch = sourceBlock.match(/Autor:\s*(.*?)(?=\n|$)/);
      const dateMatch = sourceBlock.match(/Data:\s*(.*?)(?=\n|$)/);
      const urlMatch = sourceBlock.match(/URL:\s*(.*?)(?=\n|$)/);
      const typeMatch = sourceBlock.match(/Tipo:\s*(.*?)(?=\n|$)/);
      const summaryMatch = sourceBlock.match(/Resumo:\s*(.*?)(?=\n|$)/);
      const relevanceMatch = sourceBlock.match(/Relevância:\s*(.*?)(?=\n|$)/);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : 'Título não especificado',
        author: authorMatch ? authorMatch[1].trim() : 'Autor não especificado',
        date: dateMatch ? dateMatch[1].trim() : 'Data não especificada',
        url: urlMatch ? (urlMatch[1].trim() === 'Não disponível online' ? null : urlMatch[1].trim()) : null,
        type: typeMatch ? typeMatch[1].trim() : 'Tipo não especificado',
        summary: summaryMatch ? summaryMatch[1].trim() : 'Resumo não disponível',
        relevance: relevanceMatch ? relevanceMatch[1].trim().toLowerCase() : 'não especificada'
      };
    });
  } catch (error) {
    console.error('Erro ao processar dados de fontes:', error);
    return [];
  }
}

/**
 * Processa formato de fontes legado (para compatibilidade)
 * @param {string} sourcesText - Texto com as fontes no formato antigo
 * @returns {Array} Array de objetos com informações das fontes
 */
function processLegacySourceFormat(sourcesText) {
  try {
    // Expressão regular para extrair blocos de fontes
    const sourceBlocks = sourcesText.split(/\[Fonte\]/).filter(block => block.trim().length > 0);
    
    return sourceBlocks.map(block => {
      const nameMatch = block.match(/Nome:\s*([^\n]+)/);
      const dateMatch = block.match(/Data:\s*([^\n]+)/);
      const infoMatch = block.match(/Info:\s*([^\n]+(?:\n[^\n]+)*?)(?=\nURL:|$)/);
      const urlMatch = block.match(/URL:\s*([^\n]+)/);
      
      return {
        title: nameMatch ? nameMatch[1].trim() : 'Fonte não especificada',
        author: 'Não especificado',
        date: dateMatch ? dateMatch[1].trim() : 'Data não especificada',
        url: urlMatch ? urlMatch[1].trim() : null,
        type: 'Não especificado',
        summary: infoMatch ? infoMatch[1].trim() : 'Informação não disponível',
        relevance: 'não especificada'
      };
    });
  } catch (error) {
    console.error('Erro ao processar dados de fontes legadas:', error);
    return [];
  }
}

/**
 * Processa dados de FAQ em uma estrutura utilizável
 * @param {string} faqText - Texto com as perguntas e respostas
 * @returns {Array} Array de objetos com perguntas e respostas
 */
function processFAQData(faqText) {
  try {
    const faqBlocksRegex = /\[PERGUNTA\]([\s\S]*?)\[\/PERGUNTA\]/g;
    const faqMatches = [...faqText.matchAll(faqBlocksRegex)];
    
    if (faqMatches.length === 0) {
      // Fallback para processamento de texto livre
      return processPlainTextFAQs(faqText);
    }
    
    return faqMatches.map(match => {
      const faqBlock = match[1].trim();
      
      const questionMatch = faqBlock.match(/Questão:\s*(.*?)(?=\n|$)/);
      const answerMatch = faqBlock.match(/Resposta:\s*([\s\S]*?)(?=$)/);
      
      return {
        question: questionMatch ? questionMatch[1].trim() : 'Pergunta não especificada',
        answer: answerMatch ? answerMatch[1].trim() : 'Resposta não disponível'
      };
    });
  } catch (error) {
    console.error('Erro ao processar dados de FAQ:', error);
    return [];
  }
}

/**
 * Processa texto livre de FAQs
 * @param {string} faqText - Texto com FAQs em formato livre
 * @returns {Array} Array de objetos com perguntas e respostas
 */
function processPlainTextFAQs(faqText) {
  try {
    // Tenta identificar padrões de perguntas/respostas
    const faqPairs = faqText.split(/\d+\.\s+/g).filter(item => item.trim().length > 0);
    
    return faqPairs.map(pair => {
      const parts = pair.split(/\?|\:/);
      
      if (parts.length >= 2) {
        return {
          question: (parts[0] + '?').trim(),
          answer: parts.slice(1).join(':').trim()
        };
      }
      
      return null;
    }).filter(item => item !== null);
  } catch (error) {
    console.error('Erro ao processar FAQs em texto livre:', error);
    return [];
  }
}

/**
 * Processa seções de conteúdo em um objeto estruturado
 * @param {string} contentText - Texto com seções delimitadas por títulos
 * @returns {Object} Objeto com as seções processadas
 */
function processContentSections(contentText) {
  try {
    const sections = {};
    
    // Identifica títulos de seção (## TÍTULO)
    const sectionMatches = [...contentText.matchAll(/##\s+([^#\n]+)(?:\n|\r\n)([\s\S]*?)(?=##\s+|$)/g)];
    
    sectionMatches.forEach(match => {
      const sectionTitle = match[1].trim().toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/\s+/g, '_'); // Substitui espaços por underscores
      
      const sectionContent = match[2].trim();
      
      sections[sectionTitle] = sectionContent;
    });
    
    return sections;
  } catch (error) {
    console.error('Erro ao processar seções de conteúdo:', error);
    return {};
  }
}

/**
 * Verifica fatos de um artigo usando a Perplexity com análise estruturada
 * @param {string} content - Conteúdo do artigo
 * @param {Object} options - Opções para customizar a verificação
 * @returns {Promise<Object>} Resultado da verificação de fatos
 */
export async function factCheck(content, options = {}) {
  try {
    const defaultOptions = {
      thoroughness: 'high', // high, medium, low
      focusAreas: ['technical_accuracy', 'regulatory_compliance', 'market_data', 'methodology'],
      formatOutput: 'json'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Ajusta as instruções com base no nível de minuciosidade
    let thoroughnessInstructions = '';
    switch (mergedOptions.thoroughness) {
      case 'high':
        thoroughnessInstructions = 'Realize uma verificação factual extremamente detalhada e rigorosa, analisando cada afirmação técnica, estatística e recomendação. Verifique a precisão de cada dado numérico e termo técnico.';
        break;
      case 'medium':
        thoroughnessInstructions = 'Realize uma verificação factual detalhada, focando nas principais afirmações técnicas, estatísticas importantes e recomendações centrais do artigo.';
        break;
      case 'low':
        thoroughnessInstructions = 'Realize uma verificação factual básica, identificando apenas problemas factuais significativos ou erros técnicos graves.';
        break;
    }
    
    // Cria a lista de áreas de foco
    const focusAreasText = mergedOptions.focusAreas.map(area => {
      switch (area) {
        case 'technical_accuracy':
          return '- Precisão técnica: Verifique se os termos técnicos, processos e especificações estão corretos.';
        case 'regulatory_compliance':
          return '- Conformidade regulatória: Verifique se as informações sobre normas, códigos e regulamentações brasileiras (ABNT, etc.) estão corretas e atualizadas.';
        case 'market_data':
          return '- Dados de mercado: Verifique se os preços, estatísticas e tendências de mercado mencionados são precisos e atuais (2023-2024).';
        case 'methodology':
          return '- Metodologia: Verifique se as técnicas, processos e métodos de construção/reforma descritos são válidos e representam as práticas atuais.';
        case 'product_claims':
          return '- Afirmações sobre produtos: Verifique se as afirmações sobre desempenho, durabilidade ou características de produtos e materiais são precisas.';
        default:
          return '';
      }
    }).filter(text => text.length > 0).join('\n');
    
    const query = `
    # INSTRUÇÕES DE VERIFICAÇÃO FACTUAL
    
    ${thoroughnessInstructions}
    
    ## ÁREAS DE FOCO
    ${focusAreasText}
    
    ## CONTEÚDO PARA VERIFICAÇÃO
    
    ${content.substring(0, 12000)}
    
    ## FORMATO DE RESPOSTA
    
    Forneça um relatório de verificação factual estruturado com as seguintes seções:
    
    1. PONTUAÇÃO DE PRECISÃO
    - Atribua uma pontuação de precisão geral de 0.0 a 1.0, onde 1.0 é 100% preciso.
    - Explique brevemente a justificativa para a pontuação atribuída.
    
    2. PROBLEMAS IDENTIFICADOS
    - Liste cada afirmação problemática identificada.
    - Para cada problema, forneça:
      * O trecho exato ou paráfrase da afirmação problemática
      * A natureza do problema (imprecisão técnica, dado desatualizado, estatística incorreta, etc.)
      * A informação correta, citando uma fonte confiável quando possível
      * Nível de gravidade do erro (Crítico, Significativo, Menor)
    
    3. FONTES RECOMENDADAS
    - Liste 3-5 fontes técnicas confiáveis e recentes (2022-2024) que poderiam melhorar a precisão do conteúdo.
    - Para cada fonte, inclua título, autor/organização, ano e URL (quando disponível).
    
    4. RECOMENDAÇÕES DE MELHORIA
    - Forneça 3-5 recomendações específicas para melhorar a precisão factual do conteúdo.
    
    5. RESUMO
    - Ofereça um resumo objetivo e sucinto (100-150 palavras) sobre a qualidade factual geral do conteúdo, destacando pontos fortes e fracos.
    
    ${mergedOptions.formatOutput === 'json' ? 'Formate sua resposta como um objeto JSON válido com as seções acima como propriedades. Use arrays para listas e objetos aninhados para estruturar os dados.' : 'Formate sua resposta em texto com títulos claros para cada seção.'}
    `;
    
    const factCheckResult = await searchWithPerplexity(query, {
      systemPrompt: `Você é um verificador de fatos especializado em conteúdo técnico sobre construção civil e reformas residenciais. Sua expertise abrange normas técnicas brasileiras (ABNT), materiais e técnicas de construção, aspectos regulatórios, e dados de mercado. Sua análise deve ser rigorosa, objetiva e baseada apenas em fatos verificáveis. Seja minucioso na identificação de imprecisões e cite sempre fontes confiáveis para correções.`,
      temperature: 0.0,
      max_tokens: 3000
    });
    
    // Processar o resultado conforme o formato solicitado
    if (mergedOptions.formatOutput === 'json') {
      try {
        // Tenta extrair e analisar o JSON da resposta
        const jsonMatch = factCheckResult.text.match(/```json\n([\s\S]*?)\n```/) || 
                         factCheckResult.text.match(/\{[\s\S]*\}/);
                         
        if (jsonMatch) {
          const jsonText = jsonMatch[1] || jsonMatch[0];
          const parsedResult = JSON.parse(jsonText);
          
          return {
            ...parsedResult,
            checkedAt: new Date().toISOString(),
            rawResponse: factCheckResult.text
          };
        }
      } catch (jsonError) {
        console.warn('Erro ao analisar resposta JSON da verificação factual:', jsonError);
      }
    }
    
    // Se não conseguiu processar como JSON ou o formato não era JSON
    // Vamos processar como texto estruturado
    const result = {
      precision: extractPrecisionScore(factCheckResult.text),
      problems: extractProblems(factCheckResult.text),
      recommendedSources: extractSources(factCheckResult.text),
      improvements: extractImprovements(factCheckResult.text),
      summary: extractSummary(factCheckResult.text),
      checkedAt: new Date().toISOString(),
      rawResponse: factCheckResult.text
    };
    
    return result;
  } catch (error) {
    console.error('Erro ao verificar fatos:', error);
    return {
      precision: 0,
      problems: [{
        statement: 'Não foi possível processar o artigo',
        issue: 'Erro técnico durante a verificação',
        correction: 'Revise manualmente o conteúdo',
        severity: 'Crítico'
      }],
      recommendedSources: [],
      improvements: ['Realize uma verificação manual do conteúdo'],
      summary: 'Não foi possível realizar a verificação factual automatizada devido a um erro técnico.',
      checkedAt: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Extrai a pontuação de precisão do texto de verificação
 * @param {string} text - Texto de verificação factual
 * @returns {number} Pontuação de precisão (0-1)
 */
function extractPrecisionScore(text) {
  try {
    // Busca por padrões como "Pontuação: 0.85" ou "Precisão: 0.85"
    const precisionMatch = text.match(/(?:Pontua[çc][ãa]o|Precis[ãa]o)[^:]*:\s*(\d+(?:\.\d+)?)/i) ||
                         text.match(/precision[^:]*:\s*(\d+(?:\.\d+)?)/i);
    
    if (precisionMatch) {
      const score = parseFloat(precisionMatch[1]);
      if (!isNaN(score) && score >= 0 && score <= 1) {
        return score;
      }
    }
    
    // Busca outras possíveis menções de porcentagem ou valores numéricos de precisão
    const percentMatch = text.match(/(\d+(?:\.\d+)?)%\s*(?:de\s*)?precis[ãa]o/i);
    if (percentMatch) {
      const percent = parseFloat(percentMatch[1]);
      if (!isNaN(percent) && percent >= 0 && percent <= 100) {
        return percent / 100;
      }
    }
    
    return 0.5; // Valor padrão intermediário caso não encontre
  } catch (error) {
    console.error('Erro ao extrair pontuação de precisão:', error);
    return 0.5;
  }
}

/**
 * Extrai problemas do texto de verificação
 * @param {string} text - Texto de verificação factual
 * @returns {Array} Lista de problemas identificados
 */
function extractProblems(text) {
  try {
    // Busca pela seção de problemas
    const problemsSection = text.match(/(?:PROBLEMAS\s*IDENTIFICADOS|PROBLEMS)(?:[\s\S]*?)(?=(?:FONTES\s*RECOMENDADAS|RECOMMENDED\s*SOURCES|RECOMENDA[ÇC][ÕO]ES|[0-9]\.))/i);
    
    if (!problemsSection) {
      return [];
    }
    
    // Divide em itens separados (espera que cada problema comece com um número ou marcador)
    const problemItems = problemsSection[0].split(/\n\s*[\-\*•]|\n\s*[0-9]+\./).slice(1);
    
    return problemItems.map(item => {
      const trimmedItem = item.trim();
      
      // Tenta extrair partes estruturadas
      const statementMatch = trimmedItem.match(/(?:trecho|afirma[çc][ãa]o|statement)(?:[^:]*?):\s*(.*?)(?:\n|$)/i);
      const issueMatch = trimmedItem.match(/(?:problema|natureza|issue)(?:[^:]*?):\s*(.*?)(?:\n|$)/i);
      const correctionMatch = trimmedItem.match(/(?:corre[çc][ãa]o|informa[çc][ãa]o correta|correction)(?:[^:]*?):\s*(.*?)(?:\n|$)/i);
      const severityMatch = trimmedItem.match(/(?:gravidade|severidade|severity)(?:[^:]*?):\s*(.*?)(?:\n|$)/i);
      
      return {
        statement: statementMatch ? statementMatch[1].trim() : trimmedItem.split('\n')[0].trim(),
        issue: issueMatch ? issueMatch[1].trim() : 'Problema não especificado',
        correction: correctionMatch ? correctionMatch[1].trim() : 'Correção não fornecida',
        severity: severityMatch ? severityMatch[1].trim() : 'Não especificada'
      };
    }).filter(problem => problem.statement.length > 0);
  } catch (error) {
    console.error('Erro ao extrair problemas:', error);
    return [];
  }
}

/**
 * Extrai fontes recomendadas do texto de verificação
 * @param {string} text - Texto de verificação factual
 * @returns {Array} Lista de fontes recomendadas
 */
function extractSources(text) {
  try {
    // Busca pela seção de fontes
    const sourcesSection = text.match(/(?:FONTES\s*RECOMENDADAS|RECOMMENDED\s*SOURCES)(?:[\s\S]*?)(?=(?:RECOMENDA[ÇC][ÕO]ES|IMPROVEMENTS|RESUMO|SUMMARY|[0-9]\.))/i);
    
    if (!sourcesSection) {
      return [];
    }
    
    // Divide em itens separados
    const sourceItems = sourcesSection[0].split(/\n\s*[\-\*•]|\n\s*[0-9]+\./).slice(1);
    
    return sourceItems.map(item => {
      // Limpa e retorna o texto da fonte
      return item.trim();
    }).filter(source => source.length > 0);
  } catch (error) {
    console.error('Erro ao extrair fontes:', error);
    return [];
  }
}

/**
 * Extrai recomendações de melhoria do texto de verificação
 * @param {string} text - Texto de verificação factual
 * @returns {Array} Lista de recomendações
 */
function extractImprovements(text) {
  try {
    // Busca pela seção de recomendações
    const improvementsSection = text.match(/(?:RECOMENDA[ÇC][ÕO]ES|RECOMMENDATIONS|IMPROVEMENTS)(?:[\s\S]*?)(?=(?:RESUMO|SUMMARY|[0-9]\.))/i);
    
    if (!improvementsSection) {
      return [];
    }
    
    // Divide em itens separados
    const improvementItems = improvementsSection[0].split(/\n\s*[\-\*•]|\n\s*[0-9]+\./).slice(1);
    
    return improvementItems.map(item => {
      // Limpa e retorna o texto da recomendação
      return item.trim();
    }).filter(recommendation => recommendation.length > 0);
  } catch (error) {
    console.error('Erro ao extrair recomendações:', error);
    return [];
  }
}

/**
 * Extrai o resumo do texto de verificação
 * @param {string} text - Texto de verificação factual
 * @returns {string} Resumo da verificação
 */
function extractSummary(text) {
  try {
    // Busca pela seção de resumo
    const summarySection = text.match(/(?:RESUMO|SUMMARY)(?:[^:]*?):?\s*([\s\S]*?)(?=$)/i);
    
    if (summarySection && summarySection[1]) {
      return summarySection[1].trim();
    }
    
    return '';
  } catch (error) {
    console.error('Erro ao extrair resumo:', error);
    return '';
  }
} 