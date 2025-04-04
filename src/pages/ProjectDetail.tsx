
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { type Project } from "@/components/ui/project-card";
import { getFreepikImageByCategory } from "@/services/freepikService";

// Import the new components
import { ProjectBreadcrumb } from "@/components/portfolio/ProjectBreadcrumb";
import { ProjectHeader } from "@/components/portfolio/ProjectHeader";
import { ProjectMainImage } from "@/components/portfolio/ProjectMainImage";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectDescription } from "@/components/portfolio/ProjectDescription";
import { RelatedProjects } from "@/components/portfolio/RelatedProjects";
import { ProjectNavigation } from "@/components/portfolio/ProjectNavigation";
import { ProjectSeo } from "@/components/portfolio/ProjectSeo";
import { NotFoundProject } from "@/components/portfolio/NotFoundProject";

// Mock data for portfolio projects
const portfolioProjects: Project[] = [
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
  },
];

// Mock data for project details with premium images
const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [projectImages, setProjectImages] = useState<string[]>([]);

  useEffect(() => {
    // Find the current project
    const currentIndex = portfolioProjects.findIndex(project => project.id === id);
    
    if (currentIndex !== -1) {
      const currentProject = portfolioProjects[currentIndex];
      
      // Fetch premium image for the current project
      const fetchPremiumImage = async () => {
        try {
          const premiumImage = await getFreepikImageByCategory(currentProject.category);
          
          if (premiumImage) {
            // Set the project with premium image
            setProject({ 
              ...currentProject, 
              premiumImage 
            });
            
            // Fetch more premium images for the gallery
            const moreImages = await Promise.all([
              getFreepikImageByCategory(currentProject.category),
              getFreepikImageByCategory(currentProject.category),
              getFreepikImageByCategory(currentProject.category)
            ]);
            
            // Filter out any empty image URLs
            const validImages = [premiumImage, ...moreImages.filter(img => img)];
            setProjectImages(validImages);
          } else {
            setProject(currentProject);
            setProjectImages([
              currentProject.imageUrl,
              "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1170&auto=format&fit=crop"
            ]);
          }
        } catch (error) {
          console.error('Error fetching premium images:', error);
          setProject(currentProject);
          setProjectImages([
            currentProject.imageUrl,
            "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1170&auto=format&fit=crop"
          ]);
        }
      };
      
      fetchPremiumImage();
      
      // Find previous project
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioProjects.length - 1;
      setPrevProject(portfolioProjects[prevIndex]);
      
      // Find next project
      const nextIndex = currentIndex < portfolioProjects.length - 1 ? currentIndex + 1 : 0;
      setNextProject(portfolioProjects[nextIndex]);
    }
  }, [id]);

  if (!project) {
    return <NotFoundProject />;
  }

  // Use premium image if available, otherwise fallback to original
  const displayImage = project.premiumImage || project.imageUrl;

  return (
    <>
      <ProjectSeo project={project} />
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6 mx-auto">
          <ProjectBreadcrumb title={project.title} />
          <ProjectHeader 
            title={project.title} 
            category={project.category} 
            description={project.description} 
          />
          <ProjectMainImage 
            imageUrl={displayImage} 
            title={project.title}
            altText={project.altText}
            onImageSelect={setSelectedImage}
            galleryImages={projectImages.slice(1)}
          />
          <ProjectGallery images={projectImages} title={project.title} />
          <ProjectDescription />
          <RelatedProjects 
            projects={portfolioProjects} 
            currentProjectId={project.id} 
          />
          <ProjectNavigation 
            prevProject={prevProject} 
            nextProject={nextProject} 
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;
