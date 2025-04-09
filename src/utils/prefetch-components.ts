/**
 * Utilitário para pré-carregar componentes não críticos após a renderização inicial
 * Isso melhora a performance percebida e reduz o tempo de interação
 */

// Definição do tipo para requestIdleCallback para compatibilidade
type RequestIdleCallbackHandle = any;
interface RequestIdleCallbackOptions {
  timeout: number;
}
interface RequestIdleCallbackDeadline {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
}

// Declaração de requestIdleCallback para TypeScript
declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

// Lista de caminhos de importação para carregar em segundo plano
const COMPONENTS_TO_PREFETCH = [
  () => import('../components/home/ServicesSection'),
  () => import('../components/home/ProjectsSection'),
  () => import('../components/home/TestimonialsSection'),
  () => import('../components/ui/accordion'),
  () => import('../components/ui/dialog'),
  () => import('../components/portfolio/PortfolioGrid')
];

/**
 * Função para realizar o prefetch de componentes
 * Executada após o carregamento principal da página estar completo
 */
export function prefetchComponents() {
  // Verificar se requestIdleCallback está disponível
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        console.log('Iniciando prefetch de componentes não críticos...');
        loadComponents();
      },
      { timeout: 2000 }
    );
  } else {
    // Fallback para setTimeout se requestIdleCallback não estiver disponível
    setTimeout(() => {
      console.log('Iniciando prefetch de componentes não críticos (fallback)...');
      loadComponents();
    }, 2000);
  }
  
  // Pré-conectar a domínios relevantes (APIs, etc)
  preconnectToDomains();
}

/**
 * Carrega os componentes sequencialmente
 */
function loadComponents() {
  // Carregar cada componente sequencialmente para não sobrecarregar
  COMPONENTS_TO_PREFETCH.forEach((importFunc, index) => {
    // Escalonar carregamentos com atraso progressivo para evitar congestionamento
    setTimeout(() => {
      importFunc()
        .then(() => console.debug(`Componente ${index + 1} pré-carregado`))
        .catch(() => {}); // Silenciar erros de pré-carregamento
    }, index * 300); // 300ms de intervalo entre cada carregamento
  });
}

/**
 * Pré-conectar a domínios externos usados pela aplicação
 * Reduz o tempo de inicialização de conexões futuras
 */
function preconnectToDomains() {
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://img.freepik.com',
    'https://lpxwmrmylransbtovyba.supabase.co'
  ];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Pré-carregamento de imagens críticas
 * Melhora a métrica LCP (Largest Contentful Paint)
 * @param urls Lista de URLs de imagens a serem pré-carregadas
 */
export function preloadCriticalImages(urls: string[]) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
} 