
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SeoMeta } from "@/components/ui/seo-meta";
import { type Project } from "@/components/ui/project-card";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioSchemaData } from "@/components/portfolio/PortfolioSchemaData";
import { usePortfolioAnimation } from "@/components/portfolio/usePortfolioAnimation";

// Mock data for portfolio projects with improved SEO content
const portfolioProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna em São Paulo",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista. Integração de ambientes, iluminação planejada e materiais sustentáveis.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
    altText: "Interior moderno de apartamento reformado com sala integrada à cozinha, móveis contemporâneos e iluminação natural",
    keywords: ["reforma apartamento", "design minimalista", "integração de ambientes", "apartamento moderno"]
  },
  {
    id: "2",
    title: "Cozinha Escandinava Planejada",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade e elegância. Armários planejados, bancadas em quartzo e iluminação estratégica.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
    altText: "Cozinha em estilo escandinavo com armários brancos, bancada em quartzo, ilha central e pendentes decorativos",
    keywords: ["reforma de cozinha", "cozinha escandinava", "cozinha planejada", "design de interiores"]
  },
  {
    id: "3",
    title: "Escritório Corporativo Moderno",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade e bem-estar. Divisórias acústicas, estações de trabalho ergonômicas e espaços colaborativos.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
    altText: "Escritório corporativo com design moderno, estações de trabalho colaborativas e amplas janelas",
    keywords: ["reforma escritório", "espaço comercial", "design corporativo", "ergonomia no trabalho"]
  },
  {
    id: "4",
    title: "Banheiro Luxuoso com Mármore",
    description: "Reforma de banheiro com acabamentos premium e iluminação planejada. Revestimentos em mármore, metais dourados e box de vidro temperado do piso ao teto.",
    imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1287&auto=format&fit=crop",
    category: "Banheiro",
    altText: "Banheiro luxuoso com revestimentos em mármore, banheira e metais dourados",
    keywords: ["reforma de banheiro", "banheiro de luxo", "revestimento em mármore", "iluminação de banheiro"]
  },
  {
    id: "5",
    title: "Sala de Estar Contemporânea",
    description: "Reforma de sala de estar com design contemporâneo e mobiliário personalizado. Painéis ripados, iluminação indireta e automação residencial integrada.",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop",
    category: "Sala",
    altText: "Sala de estar contemporânea com sofá modular, painel de TV ripado e iluminação indireta",
    keywords: ["reforma de sala", "design de interiores", "sala contemporânea", "automação residencial"]
  },
  {
    id: "6",
    title: "Café Artesanal em São Paulo",
    description: "Projeto comercial para café artesanal com atmosfera acolhedora e funcional. Balcão em madeira maciça, iluminação pendente e mobiliário sob medida.",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1170&auto=format&fit=crop",
    category: "Comercial",
    altText: "Interior de café artesanal com balcão de madeira, banquetas e iluminação pendente",
    keywords: ["projeto comercial", "reforma de café", "design de interiores comercial", "mobiliário sob medida"]
  },
];

// Categories for filter
const categories = ["Todos", ...Array.from(new Set(portfolioProjects.map(project => project.category)))];

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredProjects, setFilteredProjects] = useState(portfolioProjects);
  const { addToRefs } = usePortfolioAnimation(filteredProjects);

  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredProjects(portfolioProjects);
    } else {
      setFilteredProjects(
        portfolioProjects.filter((project) => project.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  return (
    <>
      <SeoMeta 
        title="Portfólio de Projetos | Casa Branca Reformas e Design de Interiores"
        description="Conheça nosso portfólio de reformas residenciais e comerciais. Projetos de design de interiores para apartamentos, cozinhas, banheiros e espaços comerciais em São Paulo."
        keywords="portfólio de reformas, projetos de design de interiores, reforma apartamento, reforma comercial, reforma residencial"
      />
      
      <Header />
      
      {/* Hero Section */}
      <div ref={(el) => addToRefs(el, 0)}>
        <PortfolioHero />
      </div>

      {/* Categories Filter */}
      <div ref={(el) => addToRefs(el, 1)}>
        <PortfolioFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <PortfolioGrid 
            projects={filteredProjects} 
            addToRefs={addToRefs}
          />
          
          <PortfolioSchemaData />
        </div>
      </section>

      {/* CTA Section */}
      <PortfolioCTA 
        addToRefs={addToRefs}
        refIndex={portfolioProjects.length + 2}
      />
      
      <Footer />
    </>
  );
};

export default Portfolio;
