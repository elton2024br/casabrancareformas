
import { Link } from "react-router-dom";

interface ProjectBreadcrumbProps {
  title: string;
}

export function ProjectBreadcrumb({ title }: ProjectBreadcrumbProps) {
  return (
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
        <li className="font-medium text-primary">{title}</li>
      </ol>
    </nav>
  );
}
