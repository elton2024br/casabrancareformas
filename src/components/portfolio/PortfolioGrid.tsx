
import { ProjectCard, type Project } from "@/components/ui/project-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { searchFreepikImages } from "@/services/freepikService";

interface PortfolioGridProps {
  projects: Project[];
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function PortfolioGrid({ projects, addToRefs }: PortfolioGridProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedProjects, setEnhancedProjects] = useState<Project[]>([]);

  const enhanceProjectImages = async () => {
    if (isEnhancing) return;
    
    setIsEnhancing(true);
    toast.info("Aprimorando imagens do portfólio...");
    
    try {
      const enhanced = [...projects];
      
      // Process projects in batches to avoid rate limiting
      for (let i = 0; i < enhanced.length; i++) {
        const project = enhanced[i];
        
        // Skip already enhanced projects
        if (enhancedProjects.some(p => p.id === project.id)) continue;
        
        // Search for premium images based on project category and title
        const searchQuery = `${project.category} ${project.title.split(' ').slice(0, 3).join(' ')}`;
        const images = await searchFreepikImages(searchQuery, 1);
        
        if (images && images.length > 0) {
          enhanced[i] = {
            ...project,
            imageUrl: images[0].url,
            altText: images[0].description || project.altText || project.title,
            premium: true
          };
          
          toast.success(`Imagem de "${project.title}" aprimorada!`);
        }
        
        // Avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setEnhancedProjects(enhanced);
    } catch (error) {
      console.error("Error enhancing project images:", error);
      toast.error("Erro ao aprimorar imagens. Tente novamente mais tarde.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const displayProjects = enhancedProjects.length > 0 ? enhancedProjects : projects;

  if (displayProjects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          Nenhum projeto encontrado nesta categoria.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={enhanceProjectImages}
          disabled={isEnhancing}
        >
          <RefreshCcw className={`h-4 w-4 ${isEnhancing ? 'animate-spin' : ''}`} />
          {isEnhancing ? 'Aprimorando imagens...' : 'Aprimorar com Freepik Premium'}
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            enableModalView={true}
            ref={(el) => addToRefs(el, 2 + index)}
          />
        ))}
      </div>
    </div>
  );
}
