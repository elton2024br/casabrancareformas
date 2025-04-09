import { Link } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "lucide-react";

interface ProjectBreadcrumbProps {
  title: string;
  category?: string;
}

export function ProjectBreadcrumb({ title, category }: ProjectBreadcrumbProps) {
  // URL atual para o breadcrumb atual
  const currentUrl = window.location.href;
  
  // Base URL para links relativos
  const baseUrl = window.location.origin;
  
  // Dados para Schema.org BreadcrumbList
  const breadcrumbSchemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Início",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Portfólio",
        "item": `${baseUrl}/portfolio`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": category || "Projetos",
        "item": category ? `${baseUrl}/portfolio?categoria=${encodeURIComponent(category)}` : `${baseUrl}/portfolio`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center text-sm space-x-1">
          <li>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <HomeIcon className="h-4 w-4" />
              <span className="sr-only">Início</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          </li>
          <li>
            <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
              Portfólio
            </Link>
          </li>
          {category && (
            <>
              <li className="flex items-center">
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </li>
              <li>
                <Link 
                  to={`/portfolio?categoria=${encodeURIComponent(category)}`} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category}
                </Link>
              </li>
            </>
          )}
          <li className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          </li>
          <li className="text-foreground font-medium truncate max-w-[200px]">
            {title}
          </li>
        </ol>
      </nav>
      
      {/* Schema.org BreadcrumbList markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchemaData) }}
      />
    </>
  );
}
