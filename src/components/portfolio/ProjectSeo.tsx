
import { SeoMeta } from "@/components/ui/seo-meta";
import { type Project } from "@/components/ui/project-card";

interface ProjectSeoProps {
  project: Project | null;
}

export function ProjectSeo({ project }: ProjectSeoProps) {
  // Não renderizar se o projeto não estiver carregado
  if (!project) {
    return null;
  }

  const title = `${project.title} | Casa Branca Reformas`;
  const description = project.description;
  const keywords = project.keywords?.join(", ") || `${project.category}, reforma, design de interiores, casa branca`;
  const ogImage = project.premiumImage || project.imageUrl;
  
  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": project.title,
    "description": project.description,
    "image": project.premiumImage || project.imageUrl,
    "category": project.category,
    "brand": {
      "@type": "Brand",
      "name": "Casa Branca Reformas"
    }
  };

  return (
    <>
      <SeoMeta
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
