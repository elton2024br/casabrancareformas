import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  url: string;
  isVideo: boolean;
  thumbUrl?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface MobileGalleryProps {
  items: GalleryItem[];
  title: string;
  containerClassName?: string;
  autoplay?: boolean;
}

/**
 * Componente de galeria otimizado para dispositivos móveis
 * Suporta gestos de swipe, precarregamento inteligente e layout responsivo
 */
export function MobileGallery({ 
  items, 
  title,
  containerClassName,
  autoplay = false
}: MobileGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Configuração de autoplay
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay, items.length]);
  
  // Precarregamento inteligente: apenas carrega as imagens próximas do atual
  useEffect(() => {
    // Sempre carrega a imagem atual
    const imagesToLoad = new Set(loadedImages);
    imagesToLoad.add(currentIndex);
    
    // Precarregar a próxima e a anterior
    const nextIndex = (currentIndex + 1) % items.length;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    imagesToLoad.add(nextIndex);
    imagesToLoad.add(prevIndex);
    
    setLoadedImages(imagesToLoad);
  }, [currentIndex, items.length, loadedImages]);
  
  // Gerenciamento de gestos de swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    }
    
    if (isRightSwipe) {
      handlePrevious();
    }
    
    // Reset touch values
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
    setIsLoading(true);
  };
  
  const handlePrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
    setIsLoading(true);
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const currentItem = items[currentIndex];
  const showNavigation = items.length > 1;
  
  // Determinar aspectRatio do container baseado nas dimensões do item atual
  const getAspectRatio = () => {
    const item = items[currentIndex];
    if (item.width && item.height) {
      return `${item.width} / ${item.height}`;
    }
    return "16 / 9"; // Proporção padrão
  };
  
  return (
    <div 
      className={cn("mb-8 relative overflow-hidden rounded-lg", containerClassName)}
      style={{ aspectRatio: getAspectRatio() }}
      ref={galleryRef}
    >
      <div 
        className="w-full h-full relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Indicador de carregamento */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {/* Renderização condicional baseada no tipo de mídia */}
        {currentItem.isVideo ? (
          <video
            src={currentItem.url}
            poster={currentItem.thumbUrl}
            controls
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-60" : "opacity-100"
            )}
            onLoadedData={handleImageLoad}
            playsInline // Melhor para iOS
            preload="metadata"
          />
        ) : (
          <img
            src={currentItem.url}
            alt={currentItem.alt || `${title} - Imagem ${currentIndex + 1}`}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-60" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
        
        {/* Controles de navegação */}
        {showNavigation && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {items.map((_, index) => (
              <button
                key={index}
                aria-label={`Ir para imagem ${index + 1}`}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all touch-manipulation",
                  currentIndex === index
                    ? "bg-primary scale-110" 
                    : "bg-muted-foreground/30"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
        
        {/* Botões de navegação */}
        {showNavigation && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full opacity-70 hover:opacity-100 touch-manipulation"
              onClick={handlePrevious}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full opacity-70 hover:opacity-100 touch-manipulation"
              onClick={handleNext}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Contador de imagens */}
        <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-md">
          {currentIndex + 1} / {items.length}
        </div>
      </div>
      
      {/* Preload de imagens próximas (técnica para melhorar a performance) */}
      <div className="hidden">
        {Array.from(loadedImages).map(index => {
          if (index === currentIndex) return null; // Já está carregada
          const item = items[index];
          return item.isVideo ? null : (
            <img 
              key={index} 
              src={item.url} 
              alt="" 
              aria-hidden="true"
              onLoad={() => {
                // Preload completo, mas não mostra nada
              }}
            />
          );
        })}
      </div>
    </div>
  );
} 