
// Utilitário para pré-carregar componentes não críticos após o carregamento da página inicial
// Isso melhora a experiência do usuário ao navegar pelo site

/**
 * Verificamos se estamos em um ambiente com window para evitar erros durante SSR
 */
const isClient = typeof window !== 'undefined';

/**
 * Componentes a serem pré-carregados
 */
const COMPONENTS_TO_PREFETCH = [
  "./pages/Portfolio.tsx",
  "./pages/About.tsx",
  "./pages/Contato.tsx",
  "./pages/Depoimentos.tsx"
];

// Interfaces para o polyfill do requestIdleCallback
interface RequestIdleCallbackDeadline {
  timeRemaining: () => number;
  didTimeout: boolean;
}

interface RequestIdleCallbackOptions {
  timeout?: number;
}

// Declare as funções apenas se não estiverem no tipo global
// Isso evita conflitos com tipos nativos do TypeScript
type RequestIdleCallbackFn = (
  callback: (deadline: RequestIdleCallbackDeadline) => void,
  options?: RequestIdleCallbackOptions
) => number;

type CancelIdleCallbackFn = (handle: number) => void;

/**
 * Implementação de polyfill para requestIdleCallback
 */
const requestIdleCallbackPolyfill = (
  callback: (deadline: RequestIdleCallbackDeadline) => void,
  options?: RequestIdleCallbackOptions
): number => {
  const start = Date.now();
  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, options?.timeout || 1);
};

/**
 * Função segura que usa a API nativa quando disponível ou o polyfill quando necessário
 */
const safeRequestIdleCallback = (
  callback: (deadline: RequestIdleCallbackDeadline) => void,
  options?: RequestIdleCallbackOptions
): number => {
  if (!isClient) return 0;
  
  // Use a definição nativa se disponível, caso contrário use o polyfill
  const rIC = (window as any).requestIdleCallback || requestIdleCallbackPolyfill;
  return rIC(callback, options);
};

/**
 * Função segura para cancelamento que usa a API nativa quando disponível
 */
const safeCancelIdleCallback = (handle: number): void => {
  if (!isClient) return;
  
  const cIC = (window as any).cancelIdleCallback || window.clearTimeout;
  cIC(handle);
};

/**
 * Pré-carrega os componentes em segundo plano
 */
export const prefetchComponents = (): void => {
  // Se não estamos no cliente, saímos imediatamente
  if (!isClient) return;

  // Pré-carregamento em segundo plano quando o navegador estiver ocioso
  safeRequestIdleCallback(
    (deadline) => {
      // Se temos pouco tempo disponível, adiamos para o próximo período de inatividade
      if (deadline.timeRemaining() < 10) {
        safeRequestIdleCallback(prefetchHandler);
        return;
      }

      prefetchHandler();
    },
    { timeout: 1000 }
  );
};

/**
 * Manipulador para pré-carregar os componentes
 */
const prefetchHandler = (): void => {
  // Não funciona no SSR
  if (!isClient) return;

  // Cria um link para cada componente
  COMPONENTS_TO_PREFETCH.forEach((componentPath) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = "script";
    link.href = componentPath;
    link.crossOrigin = "anonymous"; // Importante para alguns CDNs

    // Adiciona o link ao cabeçalho
    document.head.appendChild(link);
    
    console.debug(`Prefetched component: ${componentPath}`);
  });
};
