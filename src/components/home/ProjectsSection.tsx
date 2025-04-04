
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard, type Project } from "@/components/ui/project-card";
import { useEffect, useState } from "react";
import { getFreepikImageByCategory } from "@/services/freepikService";

// Mock data for featured projects with improved descriptions and SEO-friendly content
const featuredProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna - Reforma Completa em São Paulo",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista. Projeto executado em 45 dias com materiais sustentáveis e acabamentos de alto padrão.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
    featured: true,
    altText: "Sala de estar moderna com conceito aberto, sofá cinza, decoração minimalista e amplas janelas"
  },
  {
    id: "2",
    title: "Cozinha Escandinava - Design Funcional e Elegante",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade, ergonomia e elegância. Armários planejados, bancada em quartzo e iluminação personalizada.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
    altText: "Cozinha escandinava com armários brancos, bancada em quartzo, ilha central e pendentes modernos"
  },
  {
    id: "3",
    title: "Escritório Corporativo - Ambiente Produtivo",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade, bem-estar e colaboração. Espaços flexíveis, acústica controlada e ergonomia aplicada ao design.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
    altText: "Escritório corporativo moderno com estações de trabalho colaborativas, iluminação natural e divisórias de vidro"
  },
];

interface ProjectsSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function ProjectsSection({ addToRefs }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>(featuredProjects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumImages = async () => {
      setIsLoading(true);
      try {
        const updatedProjects = await Promise.all(
          featuredProjects.map(async (project) => {
            try {
              const premiumImage = await getFreepikImageByCategory(project.category);
              return premiumImage ? { ...project, premiumImage } : project;
            } catch (error) {
              console.error('Error fetching premium image:', error);
              return project;
            }
          })
        );
        
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error updating projects with premium images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPremiumImages();
  }, []);

  return (
    <section className="py-16 md:py-32" id="projetos-destaque">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <div ref={(el) => addToRefs(el, 7)}>
            <SectionHeading
              title="Projetos em Destaque"
              subtitle="Conheça nossas transformações mais impactantes em residências e espaços comerciais"
            />
          </div>
          <div ref={(el) => addToRefs(el, 8)} className="mt-4 md:mt-0 w-full md:w-auto">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/portfolio" aria-label="Navegar para página completa do portfólio">
                Ver Todos os Projetos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className={`animate-pulse bg-gray-200 rounded-lg ${index === 0 ? "md:col-span-2 aspect-[16/10]" : "aspect-square"}`}
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <div key={project.id} ref={(el) => addToRefs(el, 9 + index)}>
                <ProjectCard
                  project={project}
                  featured={index === 0}
                  enableModalView={true}
                  className={index === 0 ? "md:col-span-2" : ""}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Schema.org structured data for projects */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": projects.map((project, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CreativeWork",
                "name": project.title,
                "description": project.description,
                "image": project.premiumImage || project.imageUrl
              }
            }))
          })}
        </script>
      </div>
    </section>
  );
}
