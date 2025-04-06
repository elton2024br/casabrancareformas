
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Project } from "@/components/ui/project-card";
import { Edit, Trash2, Video, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Tratamento de fallback para vídeos
  const handleVideoError = () => {
    console.log(`Erro ao carregar vídeo para o projeto: ${project.title}`);
    setVideoError(true);
  };

  // Tratamento de fallback para imagens
  const handleImageError = () => {
    console.log(`Erro ao carregar imagem para o projeto: ${project.title}`);
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        {project.isVideo && project.videoUrl && !videoError ? (
          <div className="relative h-full w-full bg-muted/80">
            {/* Vídeo com fallback aprimorado */}
            <video
              src={project.videoUrl}
              className="h-full w-full object-cover"
              controls={false}
              muted
              onError={handleVideoError}
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-12 w-12 text-white opacity-70" />
            </div>
          </div>
        ) : (
          <>
            {/* Imagem com fallback aprimorado */}
            {imageError ? (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Imagem indisponível</span>
              </div>
            ) : (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            )}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{project.title}</h3>
            <div className="flex items-center gap-2">
              <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {project.category}
              </span>
              {project.isVideo && (
                <span className="inline-block text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  Vídeo
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive border-destructive/50 hover:border-destructive"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardContent>
    </Card>
  );
}
