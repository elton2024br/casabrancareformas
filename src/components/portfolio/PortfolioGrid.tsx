
import { ProjectCard, type Project } from "@/components/ui/project-card";

interface PortfolioGridProps {
  projects: Project[];
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function PortfolioGrid({ projects, addToRefs }: PortfolioGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          Nenhum projeto encontrado nesta categoria.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          enableModalView={true}
          ref={(el) => addToRefs(el, 2 + index)}
        />
      ))}
    </div>
  );
}
