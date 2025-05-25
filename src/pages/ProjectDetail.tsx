import { useParams, useNavigate } from "react-router-dom";
import { useProjectData } from "@/hooks/useProjectData";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

// Import the components
import { ProjectBreadcrumb } from "@/components/portfolio/ProjectBreadcrumb";
import { ProjectHeader } from "@/components/portfolio/ProjectHeader";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectDescription } from "@/components/portfolio/ProjectDescription";
import { RelatedProjects } from "@/components/portfolio/RelatedProjects";
import { ProjectNavigation } from "@/components/portfolio/ProjectNavigation";
import { ProjectSeo } from "@/components/portfolio/ProjectSeo";
import { NotFoundProject } from "@/components/portfolio/NotFoundProject";
import { ProjectMeta } from "@/components/portfolio/ProjectMeta";
import { ProjectMediaViewer } from "@/components/portfolio/ProjectMediaViewer";

// Mock data for portfolio projects - keeping for RelatedProjects component
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

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, prevProject, nextProject, galleryItems, loading, error } = useProjectData(id);

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
    return <NotFoundProject />;
  }

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
            
            <ProjectMeta 
              category={project.category} 
              isVideo={project.isVideo} 
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          
          <ProjectMediaViewer project={project} />
          
          <div className="max-w-prose mb-12">
            <p className="text-lg text-muted-foreground whitespace-pre-line">
              {project.description}
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <ProjectGallery
            items={galleryItems}
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
