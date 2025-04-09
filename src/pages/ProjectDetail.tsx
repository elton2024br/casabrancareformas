import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { type Project } from "@/components/ui/project-card";
import { getFreepikImageByCategory, getMultipleFreepikImagesByCategory } from "@/services/freepikService";

// Import the components
import { ProjectBreadcrumb } from "@/components/portfolio/ProjectBreadcrumb";
import { ProjectHeader } from "@/components/portfolio/ProjectHeader";
import { ProjectMainImage } from "@/components/portfolio/ProjectMainImage";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectDescription } from "@/components/portfolio/ProjectDescription";
import { RelatedProjects } from "@/components/portfolio/RelatedProjects";
import { ProjectNavigation } from "@/components/portfolio/ProjectNavigation";
import { ProjectSeo } from "@/components/portfolio/ProjectSeo";
import { NotFoundProject } from "@/components/portfolio/NotFoundProject";
import { toast } from "sonner";
import { ArrowLeft, Play, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InstagramEmbed } from "@/components/ui/instagram-embed";
import { isInstagramVideoUrl } from "@/lib/utils";

// Mock data for portfolio projects
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

// Interface para os itens da galeria
interface GalleryItem {
  url: string;
  isVideo: boolean;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Find the current project
    const currentIndex = portfolioProjects.findIndex(project => project.id === id);
    setLoading(true);
    
    if (currentIndex !== -1) {
      const currentProject = portfolioProjects[currentIndex];
      
      // Fetch premium images for the current project
      const fetchPremiumImages = async () => {
        try {
          // For video projects
          if (currentProject.isVideo && currentProject.videoUrl) {
            setProject(currentProject);
            
            // Criar a galeria com o vídeo principal e algumas imagens
            const galleryImages = await getMultipleFreepikImagesByCategory(currentProject.category, 3);
            
            // Montar os itens da galeria
            const items: GalleryItem[] = [
              { url: currentProject.videoUrl, isVideo: true }
            ];
            
            // Adicionar as imagens
            galleryImages.forEach(img => {
              if (img) {
                items.push({ url: img, isVideo: false });
              }
            });
            
            setGalleryItems(items);
            toast.success("Projeto de vídeo carregado com sucesso!");
          } else {
            // Get the main premium image for non-video projects
            const premiumImage = await getFreepikImageByCategory(currentProject.category);
            
            // Update the project with the premium image
            if (premiumImage) {
              setProject({ 
                ...currentProject, 
                premiumImage 
              });
              
              // Fetch additional premium images for the gallery
              const galleryImages = await getMultipleFreepikImagesByCategory(currentProject.category, 4);
              
              // Combine main image with gallery images, filter out empty strings
              const allImages = [premiumImage, ...galleryImages].filter(img => img);
              
              // Convert to gallery items format
              const items: GalleryItem[] = allImages.map(url => ({
                url,
                isVideo: false
              }));
              
              setGalleryItems(items);
              toast.success("Imagens premium carregadas com sucesso!");
            } else {
              setProject(currentProject);
              
              // Use default images
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
          
          // Default gallery items if there's an error
          const defaultItems: GalleryItem[] = currentProject.isVideo && currentProject.videoUrl 
            ? [{ url: currentProject.videoUrl, isVideo: true }]
            : [{ url: currentProject.imageUrl, isVideo: false }];
            
          // Add some default images
          defaultItems.push(
            { url: "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop", isVideo: false },
            { url: "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop", isVideo: false }
          );
          
          setGalleryItems(defaultItems);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPremiumImages();
      
      // Find previous project
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioProjects.length - 1;
      setPrevProject(portfolioProjects[prevIndex]);
      
      // Find next project
      const nextIndex = currentIndex < portfolioProjects.length - 1 ? currentIndex + 1 : 0;
      setNextProject(portfolioProjects[nextIndex]);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <ProjectSeo project={project} />
        <MainLayout>
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </MainLayout>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <NotFoundProject />
      </>
    );
  }

  const isMainContentVideo = project.isVideo && project.videoUrl;
  const isInstagramVideo = isMainContentVideo && isInstagramVideoUrl(project.videoUrl!);

  // Use premium image if available, otherwise fallback to original
  const displayImage = project.premiumImage || project.imageUrl;

  return (
    <>
      <ProjectSeo project={project} />
      <MainLayout>
        <ProjectBreadcrumb title={project.title} />
        <ProjectHeader 
          title={project.title} 
          category={project.category} 
          description={project.description} 
        />
        
        <div className="container px-4 mx-auto pt-24 md:pt-32 pb-16 md:pb-24">
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {project.category}
              </Badge>
              {project.isVideo && (
                <Badge variant="outline" className="flex items-center gap-1 text-primary">
                  <Play className="h-3 w-3" />
                  Vídeo
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          
          {isMainContentVideo ? (
            <div className="mb-8">
              {isInstagramVideo ? (
                <InstagramEmbed 
                  url={project.videoUrl!} 
                  className="w-full max-w-3xl mx-auto" 
                  aspectRatio="auto"
                  showCaption={true}
                />
              ) : (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <video 
                    src={project.videoUrl} 
                    controls 
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <div className="mb-8 aspect-video relative rounded-lg overflow-hidden cursor-pointer group">
                  <img 
                    src={project.imageUrl}
                    alt={project.altText || project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="bg-primary/80 rounded-full p-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
                <img 
                  src={project.imageUrl}
                  alt={project.altText || project.title}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          )}
          
          <div className="max-w-prose mb-12">
            <p className="text-lg text-muted-foreground whitespace-pre-line">
              {project.description}
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <ProjectGallery
            items={[
              {
                url: project.imageUrl,
                isVideo: false
              },
              ...(project.videoUrl ? [{
                url: project.videoUrl,
                isVideo: true
              }] : []),
              {
                url: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?q=80&w=1887",
                isVideo: false
              },
              {
                url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
                isVideo: false
              }
            ]}
            title={project.title}
          />
        </div>
        
        <ProjectDescription />
        <RelatedProjects 
          projects={portfolioProjects} 
          currentProjectId={project.id} 
        />
        <ProjectNavigation 
          prevProject={prevProject} 
          nextProject={nextProject} 
        />
      </MainLayout>
    </>
  );
};

export default ProjectDetail;
