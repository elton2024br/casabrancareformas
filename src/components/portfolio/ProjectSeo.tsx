
import { SeoMeta } from "@/components/ui/seo-meta";
import { type Project } from "@/components/ui/project-card";

interface ProjectSeoProps {
  project: Project;
}

export function ProjectSeo({ project }: ProjectSeoProps) {
  const keywords = project.keywords ? project.keywords.join(", ") : `reforma ${project.category}, design de interiores, projeto personalizado`;
  
  return (
    <SeoMeta 
      title={`${project.title} | Casa Branca Reformas e Design de Interiores`}
      description={project.description}
      keywords={keywords}
      ogImage={project.imageUrl}
    />
  );
}
