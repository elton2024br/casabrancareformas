
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { type Project } from "@/components/ui/project-card";

interface RelatedProjectsProps {
  projects: Project[];
  currentProjectId: string;
}

export function RelatedProjects({ projects, currentProjectId }: RelatedProjectsProps) {
  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Outros Projetos</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {projects
            .filter(p => p.id !== currentProjectId)
            .map((project) => (
              <CarouselItem key={project.id} className="md:basis-1/3">
                <Link to={`/portfolio/${project.id}`}>
                  <div className="group relative overflow-hidden rounded-lg aspect-square">
                    <img 
                      src={project.imageUrl} 
                      alt={project.altText || project.title} 
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
    </>
  );
}
