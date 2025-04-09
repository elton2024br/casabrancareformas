import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getLatestInfo, factCheck } from './perplexityService.js';
import slugify from 'slugify';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o cliente da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Função principal para gerar um artigo completo sobre um tópico
 * @param {string} topic - Tópico para o artigo
 * @param {Object} options - Opções para customizar a geração
 * @returns {Promise<Object>} Artigo gerado com metadados
 */
export async function generateArticle(topic, options = {}) {
  try {
    const defaultOptions = {
      toneStyle: 'informativo_técnico', // informativo_técnico, tutorial_prático, opinião_especialista
      targetAudience: 'proprietários', // proprietários, profissionais, ambos
      wordCount: 1000,
      includeFAQ: true,
      includeFactCheck: true,
      enhanceSEO: true,
      includeTechnicalDetails: true,
      includeCostEstimates: true,
      includeLocalContext: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    console.log(`Iniciando geração de artigo sobre "${topic}"...`);
    
    // 1. Obter informações atualizadas sobre o tópico usando a Perplexity
    console.log('Buscando informações atualizadas...');
    const latestInfo = await getLatestInfo(topic, {
      includeTechnicalData: mergedOptions.includeTechnicalDetails,
      includeCostEstimates: mergedOptions.includeCostEstimates,
      includeLocalContext: mergedOptions.includeLocalContext,
      maxSources: 5
    });
    
    // 2. Formatar as informações coletadas para o prompt
    const sourceText = latestInfo.sources.map(source => 
      `- ${source.title} (${source.date})${source.summary ? `: ${source.summary}` : ''}`
    ).join('\n');
    
    const faqText = latestInfo.faqs.map(faq => 
      `Q: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');
    
    // 3. Configurar o estilo e tom do artigo
    let toneInstructions = '';
    
    switch (mergedOptions.toneStyle) {
      case 'informativo_técnico':
        toneInstructions = 'Use um tom profissional e técnico, focando em fatos precisos e explicações detalhadas. Evite linguagem excessivamente informal ou coloquial. Mantenha uma abordagem educativa e objetiva. Inclua dados técnicos e especificações quando relevante.';
        break;
      case 'tutorial_prático':
        toneInstructions = 'Use um tom instrutivo e prático, com foco em passos claros e orientações aplicáveis. Direcione-se diretamente ao leitor usando a segunda pessoa. Inclua dicas práticas, recomendações específicas e exemplos concretos. Mantenha uma linguagem acessível.';
        break;
      case 'opinião_especialista':
        toneInstructions = 'Use um tom consultivo e analítico, oferecendo insights baseados em expertise do setor. Equilibre informações técnicas com considerações práticas. Inclua recomendações personalizadas e análises comparativas. Mantenha autoridade, mas seja conversacional.';
        break;
      default:
        toneInstructions = 'Use um tom profissional e informativo, balanceando dados técnicos com explicações claras. Mantenha uma linguagem acessível mas precisa.';
    }
    
    // 4. Configurar instruções para o público-alvo
    let audienceInstructions = '';
    
    switch (mergedOptions.targetAudience) {
      case 'proprietários':
        audienceInstructions = 'Direcione o conteúdo para proprietários de imóveis sem conhecimento técnico avançado. Explique termos técnicos, foque em implicações práticas, custos e benefícios para o proprietário. Evite jargão especializado sem explicação.';
        break;
      case 'profissionais':
        audienceInstructions = 'Direcione o conteúdo para profissionais da construção civil (arquitetos, engenheiros, construtores). Use terminologia técnica adequada, referencie normas relevantes, e foque em detalhes de implementação e especificações técnicas.';
        break;
      case 'ambos':
        audienceInstructions = 'Equilibre o conteúdo para ser útil tanto para proprietários quanto para profissionais. Explique termos técnicos quando necessário, mas inclua especificações detalhadas em seções claramente demarcadas para profissionais.';
        break;
      default:
        audienceInstructions = 'Crie um conteúdo acessível para um público geral interessado em reformas e construção, explicando conceitos técnicos quando necessário.';
    }
    
    // 5. Construir o prompt completo para a OpenAI
    const prompt = `
    # INSTRUÇÕES PARA GERAÇÃO DE ARTIGO TÉCNICO SOBRE REFORMAS E CONSTRUÇÃO

    ## TÓPICO DO ARTIGO
    ${topic}

    ## ESTILO E TOM
    ${toneInstructions}

    ## PÚBLICO-ALVO
    ${audienceInstructions}

    ## EXTENSÃO E ESTRUTURA
    - Crie um artigo completo com aproximadamente ${mergedOptions.wordCount} palavras
    - Utilize títulos e subtítulos estruturados com heading tags HTML (h1, h2, h3) para melhor SEO
    - Inclua uma introdução que contextualize o tema e sua relevância
    - Desenvolva o corpo do artigo com seções lógicas e bem organizadas
    - Finalize com uma conclusão que resuma os principais pontos
    ${mergedOptions.includeFAQ ? '- Inclua uma seção de Perguntas Frequentes (FAQ) no final do artigo' : ''}

    ## INFORMAÇÕES TÉCNICAS A INCORPORAR
    
    ### VISÃO GERAL DO TEMA
    ${latestInfo.overview.general}
    
    ${mergedOptions.includeTechnicalDetails ? `### ESPECIFICAÇÕES TÉCNICAS
    ${latestInfo.overview.technical}` : ''}
    
    ${mergedOptions.includeCostEstimates ? `### ANÁLISE DE CUSTOS
    ${latestInfo.overview.costs}` : ''}
    
    ${mergedOptions.includeLocalContext ? `### CONTEXTO REGIONAL (BRASIL)
    ${latestInfo.overview.regional}` : ''}
    
    ### TENDÊNCIAS DE MERCADO
    ${latestInfo.trends.market}
    
    ### INOVAÇÕES TÉCNICAS
    ${latestInfo.trends.innovations}
    
    ### PREVISÕES DO SETOR
    ${latestInfo.trends.predictions}
    
    ## FONTES DE REFERÊNCIA
    Incorpore informações das seguintes fontes confiáveis e atuais:
    ${sourceText}
    
    ${mergedOptions.includeFAQ ? `## PERGUNTAS FREQUENTES PARA INCLUIR
    Incorpore as seguintes perguntas e respostas na seção de FAQ, reescrevendo para manter o tom e estilo do artigo:
    ${faqText}` : ''}
    
    ## DIRETRIZES DE SEO E LEGIBILIDADE
    - Utilize palavras-chave relevantes naturalmente ao longo do texto
    - Crie parágrafos curtos e use listas para melhorar a legibilidade
    - Adicione alt-text descritivo para imagens sugeridas
    - Inclua internal linking sugerindo outros tópicos relacionados
    - Utilize meta description otimizada para SEO
    
    ## ELEMENTOS ADICIONAIS
    - Sugira 3-5 imagens descritivas que poderiam ser incluídas (com descrição do que deveria aparecer e sugestão de alt-text)
    - Sugira 2-3 links internos para outros tópicos relacionados
    - Indique oportunidades para call-to-action (CTA) relevantes ao tema

    ## FORMATO DE SAÍDA
    Forneça o artigo completo em formato HTML básico, com tags para:
    - Título principal (h1)
    - Subtítulos (h2, h3)
    - Parágrafos (p)
    - Listas ordenadas e não ordenadas (ol, ul, li)
    - Ênfase onde apropriado (strong, em)
    - Blocos de destaque (blockquote)

    Após o artigo HTML, adicione uma seção de metadados em formato JSON com as seguintes informações:
    - Título sugerido para o artigo (title)
    - Meta descrição otimizada para SEO (metaDescription)
    - Palavras-chave principais (keywords)
    - Tempo estimado de leitura (readingTime)
    - Nível de dificuldade do conteúdo (1-5, onde 1 é básico e 5 é avançado) (difficultyLevel)
    - Categorias sugeridas para o artigo (categories)
    - Tags sugeridas (tags)
    - Sugestões de imagens com descrições e alt-text (suggestedImages)
    - Links internos sugeridos (suggestedLinks)
    - Ideias de CTA (suggestedCTAs)
    
    Use formato JSON estruturado para estes metadados, seguindo exatamente esta estrutura:
    
    \`\`\`json
    {
      "title": "Título Sugerido",
      "metaDescription": "Meta descrição otimizada para SEO, aproximadamente 150-160 caracteres",
      "keywords": ["palavra-chave1", "palavra-chave2", ...],
      "readingTime": "X minutos",
      "difficultyLevel": X,
      "categories": ["categoria1", "categoria2", ...],
      "tags": ["tag1", "tag2", ...],
      "suggestedImages": [
        {
          "description": "Descrição da imagem 1",
          "altText": "Texto alternativo para SEO"
        },
        ...
      ],
      "suggestedLinks": [
        {
          "text": "Texto âncora sugerido",
          "topic": "Tópico relacionado"
        },
        ...
      ],
      "suggestedCTAs": [
        "Sugestão de CTA 1",
        ...
      ]
    }
    \`\`\`
    `;
    
    // 6. Gerar o artigo usando a OpenAI
    console.log('Gerando artigo com a OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em conteúdo técnico sobre construção civil e reformas residenciais. Seu objetivo é criar artigos de alta qualidade, tecnicamente precisos e otimizados para SEO, baseados em informações verificáveis e atualizadas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    const generatedContent = completion.choices[0].message.content;
    
    // 7. Extrair o HTML e o JSON de metadados
    const htmlMatch = generatedContent.match(/<h1>[\s\S]*?(?=```json|$)/);
    const jsonMatch = generatedContent.match(/```json\s*([\s\S]*?)\s*```/);
    
    const articleHtml = htmlMatch ? htmlMatch[0].trim() : generatedContent;
    let metadata = {};
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        metadata = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Erro ao parsear os metadados JSON:', e);
      }
    }
    
    // 8. Processar o título e gerar slug
    const title = metadata.title || extrairTitulo(articleHtml);
    const slug = createSlug(title);
    
    // 9. Realizar verificação factual se solicitado
    let factCheckResult = null;
    if (mergedOptions.includeFactCheck) {
      console.log('Realizando verificação factual...');
      factCheckResult = await factCheck(articleHtml, {
        thoroughness: 'high',
        focusAreas: ['technical_accuracy', 'regulatory_compliance', 'market_data'],
        formatOutput: 'json'
      });
    }
    
    // 10. Aprimorar SEO se solicitado
    let seoSuggestions = null;
    if (mergedOptions.enhanceSEO) {
      console.log('Gerando sugestões de SEO...');
      seoSuggestions = await enhanceArticleSEO(articleHtml, topic);
    }
    
    // 11. Estimar contagem de palavras
    const wordCount = estimateWordCount(articleHtml);
    
    // 12. Montar o objeto final
    const result = {
      title: title,
      slug: slug,
      html: articleHtml,
      metadata: {
        ...metadata,
        wordCount: wordCount,
        generatedAt: new Date().toISOString(),
        topic: topic,
        options: mergedOptions
      },
      factCheck: factCheckResult,
      seoSuggestions: seoSuggestions,
      sourceInfo: {
        searchedAt: latestInfo.searchedAt,
        sourcesCount: latestInfo.sources.length,
        sourcesUsed: latestInfo.sources.map(source => ({
          title: source.title,
          date: source.date,
          relevance: source.relevance
        }))
      }
    };
    
    console.log(`Artigo sobre "${topic}" gerado com sucesso!`);
    return result;
  } catch (error) {
    console.error('Erro ao gerar artigo:', error);
    throw error;
  }
}

/**
 * Extrai o título de um HTML de artigo
 * @param {string} html - HTML do artigo
 * @returns {string} Título extraído
 */
function extrairTitulo(html) {
  const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (match && match[1]) {
    // Remove qualquer tag HTML dentro do h1
    return match[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
  }
  return 'Artigo Sem Título';
}

/**
 * Cria um slug a partir de um título
 * @param {string} title - Título para converter em slug
 * @returns {string} Slug gerado
 */
export function createSlug(title) {
  return slugify(title, {
    lower: true,
    strict: true,
    locale: 'pt'
  });
}

/**
 * Estima a contagem de palavras em um texto
 * @param {string} text - Texto para estimar contagem
 * @returns {number} Número estimado de palavras
 */
export function estimateWordCount(text) {
  // Remove tags HTML e caracteres especiais
  const cleanText = text.replace(/<\/?[^>]+(>|$)/g, " ").replace(/[^\w\s]/g, "");
  
  // Divide por espaços e filtra strings vazias
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  return words.length;
}

/**
 * Sugere categorias para um artigo com base no conteúdo
 * @param {string} content - Conteúdo do artigo
 * @returns {Promise<Array>} Categorias sugeridas
 */
export async function categorizeArticle(content) {
  try {
    const prompt = `
    Analise o seguinte artigo sobre construção civil e reformas e sugira as categorias mais apropriadas.

    ARTIGO:
    ${content.substring(0, 5000)}${content.length > 5000 ? '...' : ''}

    Com base no conteúdo acima, identifique as 2-4 categorias principais que melhor classificam este artigo.
    
    Escolha apenas entre as seguintes categorias padronizadas:
    - Reformas
    - Construção
    - Decoração
    - Materiais
    - Design de Interiores
    - Arquitetura
    - Sustentabilidade
    - Tendências
    - Dicas Práticas
    - Guias e Tutoriais
    - Projetos
    - Normas Técnicas
    - Manutenção
    - Tecnologia na Construção
    - Custos e Orçamentos

    Retorne apenas um array com as categorias selecionadas, sem texto adicional.
    Exemplo: ["Reformas", "Materiais", "Dicas Práticas"]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em categorização de conteúdo sobre construção civil e reformas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    // Tenta extrair o array de categorias da resposta
    const response = completion.choices[0].message.content.trim();
    try {
      return JSON.parse(response);
    } catch (e) {
      // Se a resposta não for um JSON válido, tenta extrair manualmente
      const matches = response.match(/\[(.*?)\]/);
      if (matches && matches[1]) {
        const categories = matches[1].split(',').map(cat => {
          return cat.trim().replace(/["\[\]]/g, '');
        }).filter(cat => cat.length > 0);
        
        return categories;
      }
      
      // Último recurso - dividir por vírgulas ou linhas
      return response.split(/[,\n]/).map(cat => cat.trim()).filter(cat => 
        cat.length > 0 && !cat.includes(':') && !cat.includes('.')
      );
    }
  } catch (error) {
    console.error('Erro ao categorizar artigo:', error);
    return ['Reformas', 'Construção'];
  }
}

/**
 * Melhora o SEO de um artigo existente
 * @param {string} article - Conteúdo do artigo
 * @param {string} topic - Tópico do artigo
 * @returns {Promise<Object>} Sugestões de SEO
 */
export async function enhanceArticleSEO(article, topic) {
  try {
    const prompt = `
    # ANÁLISE SEO DE ARTIGO SOBRE CONSTRUÇÃO CIVIL E REFORMAS
    
    ## ARTIGO A SER ANALISADO
    Tópico principal: ${topic}
    
    Conteúdo:
    ${article.substring(0, 6000)}${article.length > 6000 ? '...' : ''}
    
    ## SOLICITAÇÃO
    Analise o artigo acima sobre "${topic}" e forneça recomendações detalhadas para otimização de SEO em formato JSON estruturado.
    
    Inclua:
    
    1. Análise da estrutura de headings (H1, H2, H3)
    2. Palavras-chave primárias e secundárias identificadas e sugestões de melhoria
    3. Meta description otimizada (150-160 caracteres)
    4. Sugestões para melhorar densidade de palavras-chave
    5. Recomendações para internal linking
    6. Sugestões de external linking para autoridade
    7. Recomendações para melhorar readability score
    8. Oportunidades para featured snippets
    9. Sugestões de FAQs adicionais estruturadas para schema.org
    10. Título SEO otimizado (55-60 caracteres)
    
    Formate sua resposta como um objeto JSON com a seguinte estrutura exata:
    
    \`\`\`json
    {
      "titleSEO": "Título otimizado para SEO (55-60 caracteres)",
      "metaDescription": "Meta description otimizada (150-160 caracteres)",
      "primaryKeywords": ["palavra-chave1", "palavra-chave2", ...],
      "secondaryKeywords": ["palavra-chave-sec1", "palavra-chave-sec2", ...],
      "headingStructure": {
        "analysis": "Análise da estrutura atual de headings",
        "suggestions": ["Sugestão 1", "Sugestão 2", ...]
      },
      "keywordDensity": {
        "analysis": "Análise da densidade atual de palavras-chave",
        "suggestions": ["Sugestão 1", "Sugestão 2", ...]
      },
      "internalLinking": {
        "suggestions": [
          {
            "anchorText": "Texto âncora sugerido",
            "targetPage": "Página de destino sugerida",
            "context": "Onde inserir este link no artigo"
          },
          ...
        ]
      },
      "externalLinking": {
        "suggestions": [
          {
            "anchorText": "Texto âncora sugerido",
            "targetSite": "Site externo sugerido (ex: ABNT, sites técnicos, etc)",
            "purpose": "Propósito deste link externo"
          },
          ...
        ]
      },
      "readability": {
        "analysis": "Análise da legibilidade atual",
        "suggestions": ["Sugestão 1", "Sugestão 2", ...]
      },
      "featuredSnippets": {
        "opportunities": [
          {
            "type": "Tipo de snippet (lista, tabela, parágrafo, etc)",
            "content": "Conteúdo sugerido para o snippet",
            "targetQuery": "Query de pesquisa que este snippet almeja"
          },
          ...
        ]
      },
      "schemaFAQs": [
        {
          "question": "Pergunta adicional sugerida",
          "answer": "Resposta otimizada para a pergunta"
        },
        ...
      ]
    }
    \`\`\`
    
    Forneça apenas o JSON sem texto adicional antes ou depois.
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em SEO técnico para sites sobre construção civil e reformas. Sua expertise inclui otimização on-page, estrutura de conteúdo, schema.org e técnicas avançadas de SEO específicas para este nicho."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 3000
    });
    
    const response = completion.choices[0].message.content;
    
    // Extrair o JSON da resposta
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/(\{[\s\S]*\})/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error('Erro ao parsear JSON de sugestões SEO:', e);
        return { error: 'Erro ao processar sugestões de SEO', raw: response };
      }
    }
    
    return { error: 'Formato inesperado de resposta', raw: response };
  } catch (error) {
    console.error('Erro ao melhorar SEO do artigo:', error);
    return { error: error.message };
  }
}

/**
 * Revisa e melhora um artigo existente
 * @param {string} article - Conteúdo do artigo
 * @param {Object} options - Opções de revisão
 * @returns {Promise<Object>} Artigo revisado
 */
export async function reviseArticle(article, options = {}) {
  try {
    const defaultOptions = {
      focus: 'readability', // readability, technical_accuracy, seo, completeness
      intensity: 'medium', // light, medium, thorough
      preserveStructure: true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Configura instruções específicas com base no foco da revisão
    let focusInstructions = '';
    switch (mergedOptions.focus) {
      case 'readability':
        focusInstructions = `
        Concentre-se em melhorar a legibilidade e clareza do texto:
        - Simplifique frases complexas
        - Melhore a organização dos parágrafos (máximo 4-5 linhas por parágrafo)
        - Substitua termos técnicos excessivos por linguagem mais acessível (explicando-os quando necessário)
        - Adicione transições mais claras entre seções
        - Converta blocos densos de texto em listas ou estruturas mais digeríveis
        - Melhore os exemplos para mais clareza
        `;
        break;
        
      case 'technical_accuracy':
        focusInstructions = `
        Concentre-se em melhorar a precisão técnica do conteúdo:
        - Verifique e corrija quaisquer dados técnicos imprecisos
        - Adicione detalhes técnicos importantes que estejam faltando
        - Atualize informações desatualizadas com dados mais recentes
        - Inclua referências a normas técnicas relevantes (ABNT, etc.)
        - Refine explicações de processos técnicos para maior precisão
        - Adicione notas técnicas ou avisos importantes quando apropriado
        `;
        break;
        
      case 'seo':
        focusInstructions = `
        Concentre-se em melhorar a otimização para SEO:
        - Refine o uso de palavras-chave primárias e secundárias (sem keyword stuffing)
        - Melhore a estrutura de headings (H1, H2, H3) para clareza e SEO
        - Adicione variações semânticas de palavras-chave principais
        - Melhore os primeiros parágrafos para maior engajamento
        - Otimize os alt-texts sugeridos para imagens
        - Adicione oportunidades para featured snippets (listas, tabelas, definições)
        - Inclua mais perguntas e respostas em formato que pode ser usado para FAQ schema
        `;
        break;
        
      case 'completeness':
        focusInstructions = `
        Concentre-se em melhorar a completude do conteúdo:
        - Identifique e preencha lacunas de informação importantes
        - Adicione mais exemplos práticos ou casos de uso
        - Expanda seções que estão superficiais ou incompletas
        - Adicione considerações importantes que estejam faltando
        - Inclua perspectivas diferentes ou abordagens alternativas
        - Adicione informações sobre custos, tempo ou recursos necessários
        - Complemente com mais dados de contexto brasileiro quando relevante
        `;
        break;
    }
    
    // Configura instruções com base na intensidade da revisão
    let intensityInstructions = '';
    switch (mergedOptions.intensity) {
      case 'light':
        intensityInstructions = 'Faça apenas ajustes sutis mantendo fortemente a estrutura e conteúdo original. Limite-se a correções pontuais e melhorias essenciais.';
        break;
        
      case 'medium':
        intensityInstructions = 'Faça melhorias moderadas, mantendo a estrutura básica mas aprimorando significativamente seções problemáticas. Pode adicionar ou modificar conteúdo quando necessário para melhorar a qualidade.';
        break;
        
      case 'thorough':
        intensityInstructions = 'Faça uma revisão profunda e abrangente. Reestruture, reescreva ou adicione conteúdo conforme necessário para atingir a melhor qualidade possível. Mantenha apenas as informações essenciais do original.';
        break;
    }
    
    const structureInstructions = mergedOptions.preserveStructure 
      ? 'Preserve a estrutura geral do artigo, incluindo a divisão de seções e hierarquia de headings.'
      : 'Você pode reorganizar a estrutura do artigo se isso melhorar significativamente sua qualidade e coerência.';
    
    const prompt = `
    # INSTRUÇÕES PARA REVISÃO DE ARTIGO TÉCNICO

    ## ARTIGO ORIGINAL
    ${article}

    ## TIPO DE REVISÃO
    ${focusInstructions}

    ## INTENSIDADE DA REVISÃO
    ${intensityInstructions}

    ## ESTRUTURA
    ${structureInstructions}

    ## DIRETRIZES GERAIS
    - Mantenha o tom e estilo compatíveis com o público-alvo (proprietários de imóveis e/ou profissionais da construção)
    - Preserve as informações técnicas corretas e valiosas do texto original
    - Não adicione informações factuais incorretas ou não verificáveis
    - Mantenha o formato HTML básico com tags adequadas
    - Não modifique os fatos essenciais ou a mensagem principal do artigo
    - Garanta que o conteúdo seja específico para o contexto brasileiro

    ## FORMATO DE SAÍDA
    Forneça o artigo revisado completo em formato HTML, mantendo as tags HTML básicas (h1, h2, h3, p, ul, ol, li, strong, em, blockquote, etc).
    
    Após o artigo HTML, adicione uma lista das principais alterações realizadas, em formato de marcadores.
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um editor especialista em conteúdo técnico sobre construção civil e reformas residenciais. Sua expertise inclui revisão de artigos para melhorar clareza, precisão técnica, otimização para SEO e completude de informações."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4000
    });
    
    const revisedContent = completion.choices[0].message.content;
    
    // Dividir o conteúdo entre o HTML e a lista de alterações
    const htmlMatch = revisedContent.match(/(<h1>[\s\S]*?)(?=\n## Principais alterações|\n\*\*Principais alterações|\n\* |$)/i);
    const changesMatch = revisedContent.match(/(?:## Principais alterações|\*\*Principais alterações|\* )([\s\S]*?)$/i);
    
    const revisedArticleHtml = htmlMatch ? htmlMatch[1].trim() : revisedContent;
    const changes = changesMatch ? changesMatch[1].trim() : 'Alterações não especificadas.';
    
    // Extrair título do HTML
    const title = extrairTitulo(revisedArticleHtml);
    
    return {
      originalLength: estimateWordCount(article),
      revisedLength: estimateWordCount(revisedArticleHtml),
      title: title,
      html: revisedArticleHtml,
      changes: changes,
      focus: mergedOptions.focus,
      intensity: mergedOptions.intensity,
      revisedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao revisar artigo:', error);
    throw error;
  }
} 