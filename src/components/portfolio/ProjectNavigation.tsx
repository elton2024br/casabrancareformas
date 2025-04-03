
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Project } from "@/components/ui/project-card";

interface ProjectNavigationProps {
  prevProject: Project | null;
  nextProject: Project | null;
}

export function ProjectNavigation({ prevProject, nextProject }: ProjectNavigationProps) {
  return (
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
  );
}
