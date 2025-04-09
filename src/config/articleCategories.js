/**
 * Configuração de Categorias de Artigos
 * 
 * Este módulo define as categorias disponíveis para o blog, com IDs, nomes, 
 * descrições e palavras-chave relacionadas a cada categoria.
 */

export const ARTICLE_CATEGORIES = [
  {
    id: 'reformas-gerais',
    name: 'Reformas Gerais',
    description: 'Informações gerais sobre reformas residenciais e comerciais',
    slug: 'reformas-gerais',
    keywords: ['reforma', 'construção', 'renovação', 'casa', 'apartamento', 'projeto'],
    color: '#4A6FA5',
    icon: 'construction'
  },
  {
    id: 'cozinhas',
    name: 'Cozinhas',
    description: 'Dicas e inspirações para reformas de cozinhas',
    slug: 'cozinhas',
    keywords: ['cozinha', 'armários', 'bancada', 'eletrodomésticos', 'decoração'],
    color: '#E09F3E',
    icon: 'kitchen'
  },
  {
    id: 'banheiros',
    name: 'Banheiros',
    description: 'Tudo sobre reformas de banheiros e lavabos',
    slug: 'banheiros',
    keywords: ['banheiro', 'lavabo', 'pia', 'revestimentos', 'louças', 'metais'],
    color: '#335C67',
    icon: 'bathroom'
  },
  {
    id: 'areas-externas',
    name: 'Áreas Externas',
    description: 'Reformas e decoração de jardins, varandas e áreas externas',
    slug: 'areas-externas',
    keywords: ['jardim', 'varanda', 'quintal', 'terraço', 'área externa', 'paisagismo'],
    color: '#55A630',
    icon: 'outdoor'
  },
  {
    id: 'decoracao',
    name: 'Decoração',
    description: 'Ideias e tendências para decorar ambientes',
    slug: 'decoracao',
    keywords: ['decoração', 'design de interiores', 'estilo', 'tendências', 'móveis', 'iluminação'],
    color: '#9E2A2B',
    icon: 'decor'
  },
  {
    id: 'dicas-praticas',
    name: 'Dicas Práticas',
    description: 'Sugestões práticas e tutoriais para pequenas reformas e manutenção',
    slug: 'dicas-praticas',
    keywords: ['dicas', 'manutenção', 'conservação', 'faça você mesmo', 'DIY', 'economia'],
    color: '#540B0E',
    icon: 'tips'
  },
  {
    id: 'sustentabilidade',
    name: 'Sustentabilidade',
    description: 'Práticas e materiais sustentáveis para reformas e construção',
    slug: 'sustentabilidade',
    keywords: ['sustentabilidade', 'ecológico', 'reciclagem', 'reúso', 'eficiência energética'],
    color: '#2B9348',
    icon: 'eco'
  },
  {
    id: 'custo-beneficio',
    name: 'Custo-Benefício',
    description: 'Informações sobre orçamentos, custos e economias em reformas',
    slug: 'custo-beneficio',
    keywords: ['orçamento', 'custo', 'economia', 'investimento', 'financiamento', 'planejamento'],
    color: '#6A4C93',
    icon: 'budget'
  },
  {
    id: 'tendencias',
    name: 'Tendências',
    description: 'Novidades e tendências em design, materiais e reformas',
    slug: 'tendencias',
    keywords: ['tendências', 'inovação', 'novidades', 'design', 'estilo', 'modernidade'],
    color: '#F94144',
    icon: 'trend'
  },
  {
    id: 'antes-depois',
    name: 'Antes e Depois',
    description: 'Casos reais de reformas com comparações do antes e depois',
    slug: 'antes-depois',
    keywords: ['antes e depois', 'transformação', 'renovação', 'mudança', 'resultados'],
    color: '#F8961E',
    icon: 'compare'
  }
];

/**
 * Encontra uma categoria pelo ID
 * 
 * @param {string} categoryId - ID da categoria a ser buscada
 * @returns {Object|null} - Objeto da categoria ou null se não encontrada
 */
export function getCategoryById(categoryId) {
  return ARTICLE_CATEGORIES.find(cat => cat.id === categoryId) || null;
}

/**
 * Encontra uma categoria pela slug
 * 
 * @param {string} slug - Slug da categoria a ser buscada
 * @returns {Object|null} - Objeto da categoria ou null se não encontrada
 */
export function getCategoryBySlug(slug) {
  return ARTICLE_CATEGORIES.find(cat => cat.slug === slug) || null;
}

/**
 * Filtra categorias por palavras-chave
 * 
 * @param {Array<string>} keywords - Array de palavras-chave para filtrar
 * @returns {Array<Object>} - Categorias ordenadas por relevância
 */
export function getCategoriesByKeywords(keywords) {
  if (!keywords || keywords.length === 0) return [];
  
  const keywordsLower = keywords.map(k => k.toLowerCase());
  
  // Calcular pontuação de relevância para cada categoria
  const categoriesWithScores = ARTICLE_CATEGORIES.map(category => {
    const catKeywordsLower = category.keywords.map(k => k.toLowerCase());
    
    // Calcular quantas palavras-chave correspondem
    const matchCount = keywordsLower.reduce((count, keyword) => {
      return count + (catKeywordsLower.some(catKeyword => catKeyword.includes(keyword)) ? 1 : 0);
    }, 0);
    
    return {
      ...category,
      relevanceScore: matchCount / keywordsLower.length
    };
  });
  
  // Filtrar apenas categorias com alguma correspondência e ordenar por pontuação
  return categoriesWithScores
    .filter(cat => cat.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export default ARTICLE_CATEGORIES; 