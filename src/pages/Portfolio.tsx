
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { type Project } from "@/components/ui/project-card";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";
import { PortfolioSchemaData } from "@/components/portfolio/PortfolioSchemaData";
import { usePortfolioAnimation } from "@/components/portfolio/usePortfolioAnimation";
import { getFreepikImageByCategory } from "@/services/freepikService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(["Todos"]);
  const { addToRefs } = usePortfolioAnimation(filteredProjects);
  const [isLoading, setIsLoading] = useState(true);

  // Buscar projetos do localStorage
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Buscar projetos do localStorage
        const storedProjects = localStorage.getItem('portfolioProjects');
        const portfolioProjects: Project[] = storedProjects ? JSON.parse(storedProjects) : [];
        
        console.log("Projetos carregados do localStorage:", portfolioProjects);
        
        setAllProjects(portfolioProjects);
        setIsLoading(false);
        
        // Extrair categorias únicas
        if (portfolioProjects.length > 0) {
          const uniqueCategories = Array.from(
            new Set(portfolioProjects.map(project => project.category))
          );
          setCategories(["Todos", ...uniqueCategories]);
        } else {
          setCategories(["Todos"]);
        }
        
        // Filtrar projetos com base na categoria selecionada
        if (selectedCategory === "Todos") {
          setFilteredProjects(portfolioProjects);
        } else {
          setFilteredProjects(
            portfolioProjects.filter(project => project.category === selectedCategory)
          );
        }
        
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        toast.error("Não foi possível carregar os projetos.");
        
        setAllProjects([]);
        setFilteredProjects([]);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filtrar projetos quando a categoria for alterada
  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(
        allProjects.filter(project => project.category === selectedCategory)
      );
    }
  }, [selectedCategory, allProjects]);

  return (
    <>
      <SeoMeta 
        title="Portfólio de Projetos | Casa Branca Reformas e Design de Interiores"
        description="Conheça nosso portfólio de reformas residenciais e comerciais. Projetos de design de interiores para apartamentos, cozinhas, banheiros e espaços comerciais em São Paulo."
        keywords="portfólio de reformas, projetos de design de interiores, reforma apartamento, reforma comercial, reforma residencial"
      />
      
      <MainLayout>
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : allProjects.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  Nenhum projeto encontrado no portfólio.
                </p>
                <p className="text-sm text-muted-foreground">
                  Os projetos serão exibidos aqui quando forem adicionados pela área administrativa.
                </p>
              </div>
            ) : (
              <PortfolioGrid 
                projects={filteredProjects} 
                addToRefs={addToRefs}
              />
            )}
            
            <PortfolioSchemaData />
          </div>
        </section>

        {/* CTA Section */}
        <PortfolioCTA 
          addToRefs={addToRefs}
          refIndex={allProjects.length + 2}
        />
      </MainLayout>
    </>
  );
};

export default Portfolio;
