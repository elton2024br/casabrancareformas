
import { useState, useEffect } from "react";
import { type Project } from "@/components/ui/project-card";
import { getFreepikImageByCategory, getMultipleFreepikImagesByCategory } from "@/services/freepikService";
import { toast } from "sonner";

interface GalleryItem {
  url: string;
  isVideo: boolean;
}

interface UseProjectDataReturn {
  project: Project | null;
  prevProject: Project | null;
  nextProject: Project | null;
  galleryItems: GalleryItem[];
  loading: boolean;
  error: string | null;
}

export const useProjectData = (id: string | undefined): UseProjectDataReturn => {
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!id) {
        setLoading(false);
        setError("ID do projeto não fornecido");
        return;
      }

      setLoading(true);
      
      try {
        // Buscar projetos do localStorage
        const storedProjects = localStorage.getItem('portfolioProjects');
        const portfolioProjects: Project[] = storedProjects ? JSON.parse(storedProjects) : [];
        
        if (portfolioProjects.length === 0) {
          setLoading(false);
          setError("Nenhum projeto encontrado no portfólio");
          return;
        }
        
        const currentIndex = portfolioProjects.findIndex(project => project.id === id);
        
        if (currentIndex !== -1) {
          const currentProject = portfolioProjects[currentIndex];
          
          try {
            // For video projects
            if (currentProject.isVideo && currentProject.videoUrl) {
              setProject(currentProject);
              
              const galleryImages = await getMultipleFreepikImagesByCategory(currentProject.category, 3);
              
              const items: GalleryItem[] = [
                { url: currentProject.videoUrl, isVideo: true }
              ];
              
              galleryImages.forEach(img => {
                if (img) {
                  items.push({ url: img, isVideo: false });
                }
              });
              
              setGalleryItems(items);
              toast.success("Projeto de vídeo carregado com sucesso!");
            } else {
              const premiumImage = await getFreepikImageByCategory(currentProject.category);
              
              if (premiumImage) {
                setProject({ 
                  ...currentProject, 
                  premiumImage 
                });
                
                const galleryImages = await getMultipleFreepikImagesByCategory(currentProject.category, 4);
                const allImages = [premiumImage, ...galleryImages].filter(img => img);
                
                const items: GalleryItem[] = allImages.map(url => ({
                  url,
                  isVideo: false
                }));
                
                setGalleryItems(items);
                toast.success("Imagens premium carregadas com sucesso!");
              } else {
                setProject(currentProject);
                
                const defaultItems: GalleryItem[] = [
                  { url: currentProject.imageUrl, isVideo: false },
                  { url: "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop", isVideo: false },
                  { url: "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop", isVideo: false },
                  { url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1170&auto=format&fit=crop", isVideo: false }
                ];
                
                setGalleryItems(defaultItems);
              }
            }
          } catch (error) {
            console.error('Error fetching premium images:', error);
            toast.error("Erro ao carregar mídias. Usando imagens padrão.");
            setProject(currentProject);
            
            const defaultItems: GalleryItem[] = currentProject.isVideo && currentProject.videoUrl 
              ? [{ url: currentProject.videoUrl, isVideo: true }]
              : [{ url: currentProject.imageUrl, isVideo: false }];
              
            defaultItems.push(
              { url: "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop", isVideo: false },
              { url: "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop", isVideo: false }
            );
            
            setGalleryItems(defaultItems);
          } finally {
            setLoading(false);
          }
          
          // Find previous project
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioProjects.length - 1;
          setPrevProject(portfolioProjects[prevIndex]);
          
          // Find next project
          const nextIndex = currentIndex < portfolioProjects.length - 1 ? currentIndex + 1 : 0;
          setNextProject(portfolioProjects[nextIndex]);
        } else {
          setLoading(false);
          setError("Projeto não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do projeto:", error);
        setLoading(false);
        setError("Erro ao carregar projeto");
      }
    };

    fetchProjectData();
  }, [id]);

  return {
    project,
    prevProject,
    nextProject,
    galleryItems,
    loading,
    error
  };
};
