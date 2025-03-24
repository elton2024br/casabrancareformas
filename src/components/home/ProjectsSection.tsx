
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard, type Project } from "@/components/ui/project-card";

// Mock data for featured projects
const featuredProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
    featured: true,
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
];

interface ProjectsSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function ProjectsSection({ addToRefs }: ProjectsSectionProps) {
  return (
    <section className="py-16 md:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
          <div ref={(el) => addToRefs(el, 7)}>
            <SectionHeading
              title="Projetos em Destaque"
              subtitle="Conheça algumas de nossas transformações mais recentes"
            />
          </div>
          <div ref={(el) => addToRefs(el, 8)} className="mt-4 md:mt-0 w-full md:w-auto">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/portfolio">
                Ver Todos os Projetos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <div key={project.id} ref={(el) => addToRefs(el, 9 + index)}>
              <ProjectCard
                project={project}
                featured={index === 0}
                className={index === 0 ? "md:col-span-2" : ""}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
