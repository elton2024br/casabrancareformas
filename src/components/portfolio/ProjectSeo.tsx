
import { SeoMeta } from "@/components/ui/seo-meta";
import { type Project } from "@/components/ui/project-card";

interface ProjectSeoProps {
  project: Project;
  baseUrl?: string;
}

export function ProjectSeo({ project, baseUrl = window.location.origin }: ProjectSeoProps) {
  const keywords = project.keywords 
    ? project.keywords.join(", ") 
    : `reforma ${project.category}, design de interiores, projeto personalizado, Casa Branca, reforma São Paulo`;
  
  // Enrich structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": project.imageUrl,
    "author": {
      "@type": "Organization",
      "name": "Casa Branca Reformas e Design de Interiores"
    },
    "datePublished": "2023-03-01",
    "creator": {
      "@type": "Organization",
      "name": "Casa Branca Reformas e Design de Interiores",
      "url": baseUrl
    },
    "keywords": keywords
  };
  
  return (
    <SeoMeta 
      title={`${project.title} | Casa Branca Reformas e Design de Interiores`}
      description={project.description}
      keywords={keywords}
      ogImage={project.imageUrl}
      structuredData={JSON.stringify(structuredData)}
    />
  );
}
