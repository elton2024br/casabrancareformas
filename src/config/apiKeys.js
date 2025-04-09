/**
 * Configuração centralizada de chaves de API
 * 
 * Este arquivo contém as chaves de acesso para serviços de IA
 * e modelos utilizados pela aplicação. Em ambiente de produção,
 * recomenda-se utilizar variáveis de ambiente para estas chaves.
 */

// Constantes para APIs
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'sk-seu-token-openai';
export const PERPLEXITY_API_KEY = process.env.REACT_APP_PERPLEXITY_API_KEY || 'pplx-seu-token-perplexity';

// Configurações e modelos disponíveis
export const AI_MODELS = {
  openai: {
    default: 'gpt-4o', // Modelo principal para geração de conteúdo
    fallback: 'gpt-3.5-turbo', // Modelo alternativo para tarefas menos complexas
    analysis: 'gpt-4o-mini', // Modelo para análises e metadados
    temperature: {
      creative: 0.9, // Mais criatividade, maior variação
      balanced: 0.7, // Equilíbrio entre criatividade e precisão
      precise: 0.3, // Mais consistente e focado em fatos
      factual: 0.1, // Para verificações de fatos e análises
    },
    maxTokens: {
      small: 1000, // Para respostas curtas, análises
      medium: 2500, // Para artigos pequenos ou médios
      large: 4000, // Para artigos longos
      extraLarge: 7000, // Para documentos extensos
    }
  },
  perplexity: {
    default: 'pplx-70b-online', // Modelo para pesquisa em tempo real
    recencyFilters: {
      hour: 'hour',
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
      all: null
    }
  }
};

// Lista de domínios confiáveis para avaliação de fontes
export const TRUSTED_DOMAINS = [
  'gov.br', // Sites governamentais brasileiros
  'edu.br', // Instituições educacionais brasileiras
  'org.br', // Organizações sem fins lucrativos brasileiras
  'wikipedia.org', // Wikipedia
  'who.int', // Organização Mundial da Saúde
  'scielo.br', // Scientific Electronic Library Online
  'g1.globo.com', // Portal de notícias G1
  'bbc.com', // BBC News
  'uol.com.br', // Portal UOL
  'cnnbrasil.com.br', // CNN Brasil
  'folha.uol.com.br', // Folha de São Paulo
  'estadao.com.br', // Estadão
  'exame.com', // Revista Exame
  'veja.abril.com.br', // Revista Veja
  'reuters.com', // Reuters
  'agenciabrasil.ebc.com.br', // Agência Brasil
  'acervo.bn.gov.br', // Biblioteca Nacional
  'ipea.gov.br', // Instituto de Pesquisa Econômica Aplicada
  'ibge.gov.br', // Instituto Brasileiro de Geografia e Estatística
  'scholar.google.com', // Google Acadêmico
  'researchgate.net', // ResearchGate
  'sciencedirect.com', // Science Direct
  'nature.com', // Nature
  'pubmed.ncbi.nlm.nih.gov', // PubMed
];

export default {
  OPENAI_API_KEY,
  PERPLEXITY_API_KEY,
  AI_MODELS,
  TRUSTED_DOMAINS
}; 