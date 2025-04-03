
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ChevronLeft, ChevronRight, Maximize, ArrowLeft } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Project } from "@/components/ui/project-card";

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

// Mock data for project details
const projectImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-a59deb058d98?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab8e438f?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1170&auto=format&fit=crop"
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [prevProject, setPrevProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    // Find the current project
    const currentIndex = portfolioProjects.findIndex(project => project.id === id);
    if (currentIndex !== -1) {
      setProject(portfolioProjects[currentIndex]);
      
      // Find previous project
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : portfolioProjects.length - 1;
      setPrevProject(portfolioProjects[prevIndex]);
      
      // Find next project
      const nextIndex = currentIndex < portfolioProjects.length - 1 ? currentIndex + 1 : 0;
      setNextProject(portfolioProjects[nextIndex]);
    }
  }, [id]);

  if (!project) {
    return (
      <>
        <Header />
        <div className="container px-4 md:px-6 py-32 mx-auto text-center">
          <h1 className="text-3xl font-bold">Projeto não encontrado</h1>
          <Link to="/portfolio" className="mt-4 inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Portfólio
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6 mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Início
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link to="/portfolio" className="text-muted-foreground hover:text-primary">
                  Portfólio
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="font-medium text-primary">{project.title}</li>
            </ol>
          </nav>

          {/* Project Header */}
          <div className="mb-12">
            <SectionHeading
              title={project.title}
              subtitle={`Categoria: ${project.category}`}
            />
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              {project.description}
            </p>
            
            <div className="border-t border-b border-border py-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">LOCALIZAÇÃO</h3>
                <p className="mt-1">São José dos Campos, SP</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ÁREA</h3>
                <p className="mt-1">120 m²</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">CONCLUSÃO</h3>
                <p className="mt-1">Março de 2023</p>
              </div>
            </div>
          </div>

          {/* Main Project Image */}
          <div className="mb-8 relative overflow-hidden rounded-lg">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full aspect-video object-cover"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="absolute bottom-4 right-4"
                  onClick={() => setSelectedImage(project.imageUrl)}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
                <img 
                  src={selectedImage} 
                  alt="Imagem ampliada" 
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Project Gallery */}
          <h2 className="text-2xl font-medium mb-6">Galeria de Imagens</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {projectImages.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group">
                    <img 
                      src={image} 
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Maximize className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
                  <img 
                    src={image} 
                    alt={`Imagem ${index + 1} ampliada`}
                    className="w-full h-auto" 
                  />
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Project Description */}
          <div className="mb-16 max-w-4xl">
            <h2 className="text-2xl font-medium mb-6">Sobre o Projeto</h2>
            <div className="prose prose-stone max-w-none">
              <p>
                Este projeto foi concebido para transformar um apartamento convencional em um espaço moderno e funcional, 
                atendendo às necessidades específicas dos moradores. O conceito aberto foi adotado para criar uma sensação 
                de amplitude, integrando os ambientes sociais.
              </p>
              <p>
                Utilizamos uma paleta de cores neutras como base, complementada por toques de cores em elementos decorativos 
                estratégicos. A iluminação foi cuidadosamente planejada para criar diferentes atmosferas, dependendo da 
                ocasião e do horário.
              </p>
              <p>
                Os materiais foram selecionados priorizando durabilidade, sustentabilidade e estética contemporânea. 
                O mobiliário foi escolhido e, em alguns casos, desenhado especificamente para o projeto, garantindo 
                aproveitamento máximo do espaço e harmonia com o conceito geral.
              </p>
            </div>
          </div>

          {/* Project Navigation */}
          <h2 className="text-2xl font-medium mb-6">Outros Projetos</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {portfolioProjects
                .filter(p => p.id !== project.id)
                .map((project) => (
                  <CarouselItem key={project.id} className="md:basis-1/3">
                    <Link to={`/portfolio/${project.id}`}>
                      <div className="group relative overflow-hidden rounded-lg aspect-square">
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-medium">{project.title}</h3>
                            <span className="text-xs text-white/80">{project.category}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Previous/Next Navigation */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t">
            <div>
              {prevProject && (
                <Link to={`/portfolio/${prevProject.id}`} className="group flex items-center">
                  <ChevronLeft className="h-5 w-5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <div>
                    <div className="text-sm text-muted-foreground">Projeto Anterior</div>
                    <div className="font-medium group-hover:text-primary transition-colors">{prevProject.title}</div>
                  </div>
                </Link>
              )}
            </div>
            <Link to="/portfolio" className="text-primary hover:underline">
              Todos os Projetos
            </Link>
            <div>
              {nextProject && (
                <Link to={`/portfolio/${nextProject.id}`} className="group flex items-center text-right">
                  <div>
                    <div className="text-sm text-muted-foreground">Próximo Projeto</div>
                    <div className="font-medium group-hover:text-primary transition-colors">{nextProject.title}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-2 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetail;
