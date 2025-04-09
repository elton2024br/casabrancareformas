import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// Função para extrair o ID do Instagram de um URL
export function extractInstagramId(url: string): string | null {
  // Suporta URLs de posts e reels do Instagram
  const patterns = [
    /instagram\.com\/p\/([^/?]+)/,     // Post padrão
    /instagram\.com\/reel\/([^/?]+)/,  // Reel
    /instagram\.com\/tv\/([^/?]+)/     // IGTV
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

interface InstagramEmbedProps {
  url: string;
  className?: string;
  showCaption?: boolean;
  aspectRatio?: "square" | "portrait" | "landscape" | "auto";
}

export function InstagramEmbed({
  url,
  className,
  showCaption = false,
  aspectRatio = "square",
}: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postId = extractInstagramId(url);

  useEffect(() => {
    // Reset states when URL changes
    setIsLoaded(false);
    setError(null);
    
    if (!postId) {
      setError("URL do Instagram inválida");
      return;
    }

    const loadInstagramEmbed = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
        setIsLoaded(true);
      } else {
        // Se o script do Instagram não estiver carregado, adicione-o
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
            setIsLoaded(true);
          }
        };
        
        script.onerror = () => {
          setError("Não foi possível carregar o embed do Instagram");
        };
        
        document.body.appendChild(script);
      }
    };

    loadInstagramEmbed();

    return () => {
      // Cleanup if needed
    };
  }, [postId]);

  // Mapear valores de aspectRatio para classes CSS
  const aspectRatioClasses = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-video",
    auto: ""
  };

  if (error) {
    return (
      <div className={cn("bg-muted rounded-lg p-4 text-center", className)}>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("instagram-embed", className)}>
      <div className={cn(
        "bg-background rounded-lg overflow-hidden",
        !isLoaded && "animate-pulse min-h-[400px]",
        aspectRatio !== "auto" && aspectRatioClasses[aspectRatio]
      )}>
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          data-instgrm-captioned={showCaption}
          style={{
            background: "#FFF",
            border: "0",
            borderRadius: "3px",
            boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
            margin: "0",
            maxWidth: "100%",
            padding: "0",
            width: "100%"
          }}
        >
          <div style={{ padding: "16px" }}>
            {!isLoaded && (
              <div className="flex items-center justify-center h-full w-full">
                <div className="w-10 h-10 rounded-full bg-muted/50"></div>
              </div>
            )}
          </div>
        </blockquote>
      </div>
    </div>
  );
}

// Adicione este tipo ao window global
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
} 