import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Maximize, Play, AlertCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isInstagramVideoUrl } from "@/lib/utils";
import { InstagramEmbed } from "./instagram-embed";

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  featured?: boolean;
  altText?: string;
  keywords?: string[];
  premiumImage?: string; // Added premiumImage field for Freepik images
  videoUrl?: string; // URL do vídeo
  isVideo?: boolean; // Flag para indicar se é um projeto com vídeo destacado
}

interface ProjectCardProps {
  project: Project;
  className?: string;
  featured?: boolean;
  enableModalView?: boolean;
}

export const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ project, className, featured = false, enableModalView = false }, ref) => {
    // Use premium image if available, otherwise fallback to original
    const displayImage = project.premiumImage || project.imageUrl;
    const [videoError, setVideoError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Garantir que as propriedades isVideo e videoUrl estejam definidas
    const normalizedProject = {
      ...project,
      isVideo: project.isVideo === undefined ? false : project.isVideo,
      videoUrl: project.videoUrl || ""
    };
    
    console.log("Renderizando projeto:", normalizedProject.title, "isVideo:", normalizedProject.isVideo, "videoUrl:", normalizedProject.videoUrl);
    
    // Tratar erros de carregamento de vídeo
    const handleVideoError = () => {
      console.error(`Erro ao carregar vídeo para o projeto: ${normalizedProject.title}`);
      setVideoError(true);
    };
    
    // Tratar erros de carregamento de imagem
    const handleImageError = () => {
      console.error(`Erro ao carregar imagem para o projeto: ${normalizedProject.title}`);
      setImageError(true);
    };
    
    const isInstagramVideo = normalizedProject.videoUrl && isInstagramVideoUrl(normalizedProject.videoUrl);

    return (
      <div 
        ref={ref}
        className={cn(
          "group relative overflow-hidden flex flex-col rounded-lg transition-all",
          featured ? "aspect-[16/10]" : "aspect-square",
          className
        )}
      >
        <Link to={`/portfolio/${normalizedProject.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">Ver detalhes do projeto {normalizedProject.title}</span>
        </Link>
        
        <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
          {normalizedProject.isVideo && normalizedProject.videoUrl ? (
            isInstagramVideo ? (
              <InstagramEmbed 
                url={normalizedProject.videoUrl} 
                className="w-full h-full" 
                aspectRatio="landscape" 
              />
            ) : (
              <>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                      <p className="text-sm text-muted-foreground">Erro ao carregar o vídeo</p>
                    </div>
                  </div>
                )}
                
                <video
                  src={normalizedProject.videoUrl}
                  className={cn("object-cover w-full h-full", "group-hover:scale-105")}
                  onLoadStart={() => setLoading(true)}
                  onLoadedData={() => setLoading(false)}
                  onError={handleVideoError}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </>
            )
          ) : (
            <>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                    <p className="text-sm text-muted-foreground">Erro ao carregar a imagem</p>
                  </div>
                </div>
              )}
              
              <img
                src={displayImage || "/placeholder.svg"}
                alt={normalizedProject.altText || normalizedProject.title}
                className={cn("object-cover w-full h-full", "group-hover:scale-105")}
                onLoad={() => setLoading(false)}
                onError={handleImageError}
                loading="lazy"
              />
            </>
          )}
        </div>
        
        <div className="flex flex-col p-4 bg-white dark:bg-zinc-900 flex-grow">
          <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {normalizedProject.category}
              </span>
              {normalizedProject.isVideo && (
                <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  Vídeo
                </span>
              )}
            </div>
            <h3 className="text-xl font-medium text-white">{normalizedProject.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-white/80">{normalizedProject.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <Link
                to={`/portfolio/${normalizedProject.id}`}
                className="inline-flex items-center text-sm font-medium text-white hover:text-primary"
              >
                Ver Projeto
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>

              {enableModalView && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      className="text-white hover:text-primary rounded-full p-1 bg-black/30 flex items-center justify-center"
                      aria-label={normalizedProject.isVideo ? "Assistir vídeo" : "Ampliar imagem"}
                    >
                      {normalizedProject.isVideo && normalizedProject.videoUrl ? 
                        <Play className="h-4 w-4" /> : 
                        <Maximize className="h-4 w-4" />
                      }
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
                    {normalizedProject.isVideo && normalizedProject.videoUrl && !videoError ? (
                      isInstagramVideo ? (
                        <InstagramEmbed 
                          url={normalizedProject.videoUrl} 
                          className="w-full" 
                          aspectRatio="landscape"
                          showCaption={true}
                        />
                      ) : (
                        <video 
                          src={normalizedProject.videoUrl} 
                          controls
                          autoPlay
                          className="w-full h-auto"
                          onError={handleVideoError}
                        />
                      )
                    ) : (
                      <img 
                        src={displayImage || "/placeholder.svg"} 
                        alt={normalizedProject.altText || normalizedProject.title} 
                        className="w-full h-auto"
                        onError={handleImageError}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";
