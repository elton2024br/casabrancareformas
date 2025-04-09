import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  mobileSrc?: string;
  tabletSrc?: string;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente OptimizedImage para melhorar o desempenho e SEO de imagens
 * 
 * Benefícios:
 * - Abordagem mobile-first com <picture> e múltiplas resoluções
 * - Exige dimensões e texto alternativo para melhor SEO
 * - Suporte a lazy loading automático (desativável via priority)
 * - Previne layout shifts (CLS) com dimensões definidas
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  mobileSrc,
  tabletSrc,
  className,
  priority = false,
  objectFit = 'cover',
  ...props
}) => {
  // Garantir que alt nunca esteja vazio para acessibilidade e SEO
  if (!alt || alt.trim() === '') {
    console.warn('OptimizedImage: alt é obrigatório para SEO e acessibilidade');
  }

  // Calcular aspect ratio para evitar layout shifts
  const aspectRatio = width && height ? width / height : undefined;
  
  return (
    <div 
      className={cn("overflow-hidden", className)}
      style={{ 
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        width: width ? `${width}px` : '100%',
        maxWidth: '100%',
        position: 'relative',
      }}
    >
      <picture>
        {/* Versão mobile - priorizada para abordagem mobile-first */}
        {mobileSrc && (
          <source 
            media="(max-width: 640px)" 
            srcSet={mobileSrc}
            width={width > 640 ? Math.min(width, 640) : width}
          />
        )}
        
        {/* Versão tablet (opcional) */}
        {tabletSrc && (
          <source 
            media="(min-width: 641px) and (max-width: 1024px)" 
            srcSet={tabletSrc}
            width={Math.min(width, 1024)}
          />
        )}
        
        {/* Versão desktop/padrão */}
        <source media="(min-width: 1025px)" srcSet={src} />

        {/* Fallback para navegadores que não suportam picture */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
          }}
          {...props}
        />
      </picture>
    </div>
  );
};

// Para uso com next/image em projetos Next.js (comentado, descomente se for migrar para Next.js)
/*
import Image from 'next/image';

export const NextOptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  objectFit = 'cover',
  ...props
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{ objectFit }}
        {...props}
      />
    </div>
  );
};
*/ 