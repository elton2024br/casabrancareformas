import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Tipos de carregamento que podem ser mostrados durante o carregamento assíncrono
 */
export enum LoadingType {
  SKELETON = 'skeleton',
  SPINNER = 'spinner',
  NONE = 'none'
}

interface AsyncComponentProps {
  // Import dinâmico de componente
  importer: () => Promise<{ default: ComponentType<any> }>;
  // Props para passar para o componente
  componentProps?: Record<string, any>;
  // Tipo de carregamento a mostrar
  loadingType?: LoadingType;
  // Altura do esqueleto/spinner (para SKELETON e SPINNER)
  height?: string | number;
  // ID do componente para métricas de performance
  id?: string;
}

/**
 * Componente AsyncComponent para carregamento assíncrono com divisão de código
 * Melhora a performance inicial da aplicação carregando componentes sob demanda
 * Inclui feedback visual durante o carregamento
 */
export function AsyncComponent({
  importer,
  componentProps = {},
  loadingType = LoadingType.SKELETON,
  height = '300px',
  id
}: AsyncComponentProps) {
  // Usar React.lazy para carregar o componente apenas quando necessário
  const LazyComponent = lazy(importer);

  // ID para métricas de Web Vitals
  const componentId = id || `async-component-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <Suspense fallback={<LoadingFallback type={loadingType} height={height} />}>
      <div id={componentId}>
        <LazyComponent {...componentProps} />
      </div>
    </Suspense>
  );
}

interface LoadingFallbackProps {
  type: LoadingType;
  height: string | number;
}

/**
 * Componente de fallback para mostrar durante o carregamento
 */
function LoadingFallback({ type, height }: LoadingFallbackProps) {
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  switch (type) {
    case LoadingType.SKELETON:
      return (
        <div className="w-full" style={{ height: heightStyle }}>
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      );
    case LoadingType.SPINNER:
      return (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: heightStyle }}
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    case LoadingType.NONE:
    default:
      return null;
  }
} 