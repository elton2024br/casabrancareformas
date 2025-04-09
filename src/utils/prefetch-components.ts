
// Utilitário para pré-carregar componentes não críticos após o carregamento da página inicial
// Isso melhora a experiência do usuário ao navegar pelo site

/**
 * Tipos para o requestIdleCallback que não está definido nativamente em todos os navegadores
 */
interface RequestIdleCallbackOptions {
  timeout?: number;
}

interface RequestIdleCallbackDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

// TypeScript não possui tipos nativos para requestIdleCallback em alguns ambientes
// Declaramos o tipo globalmente apenas se não existir
declare global {
  interface Window {
    requestIdleCallback?: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  }
}

/**
 * Polyfill para requestIdleCallback para navegadores que não oferecem suporte nativo
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
 * Polyfill para cancelIdleCallback
 */
const cancelIdleCallbackPolyfill = (handle: number): void => {
  window.clearTimeout(handle);
};

// Use o nativo se disponível, caso contrário, use o polyfill
const requestIdleCallback = window.requestIdleCallback || requestIdleCallbackPolyfill;
const cancelIdleCallback = window.cancelIdleCallback || cancelIdleCallbackPolyfill;

/**
 * Componentes a serem pré-carregados
 */
const COMPONENTS_TO_PREFETCH = [
  "./pages/Portfolio.tsx",
  "./pages/About.tsx",
  "./pages/Contato.tsx",
  "./pages/Depoimentos.tsx"
];

/**
 * Pré-carrega os componentes em segundo plano
 */
export const prefetchComponents = (): void => {
  // Se o navegador não suporta ou está desabilitado, não faz nada
  if (!requestIdleCallback) return;

  // Pré-carregamento em segundo plano quando o navegador estiver ocioso
  requestIdleCallback(
    (deadline) => {
      // Se temos pouco tempo disponível, adiamos para o próximo período de inatividade
      if (deadline.timeRemaining() < 10) {
        requestIdleCallback(prefetchHandler);
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
  if (typeof document === "undefined") return;

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
