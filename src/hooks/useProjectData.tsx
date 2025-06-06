
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

const portfolioProjects = [
  {
    id: "1",
    title: "Residência Moderna",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
  },
  {
    id: "2",
    title: "Cozinha Escandinava",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade e elegância.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
  },
  {
    id: "3",
    title: "Escritório Corporativo",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade e bem-estar.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
  },
  {
    id: "4",
    title: "Banheiro Luxuoso",
    description: "Reforma de banheiro com acabamentos premium e iluminação planejada.",
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1287&auto=format&fit=crop",
    category: "Banheiro",
  },
  {
    id: "5",
    title: "Sala de Estar Contemporânea",
    description: "Reforma de sala de estar com design contemporâneo e mobiliário personalizado.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop",
    category: "Sala",
  },
  {
    id: "6",
    title: "Café Artesanal",
    description: "Projeto comercial para café artesanal com atmosfera acolhedora e funcional.",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1170&auto=format&fit=crop",
    category: "Comercial",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    isVideo: true,
  },
];

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

      const currentIndex = portfolioProjects.findIndex(project => project.id === id);
      setLoading(true);
      
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
