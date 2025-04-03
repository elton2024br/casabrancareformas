
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard, type Project } from "@/components/ui/project-card";
import { Button } from "@/components/ui/button";
import { SeoMeta } from "@/components/ui/seo-meta";

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
  const observedElementsRef = useRef<(HTMLElement | null)[]>([]);
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento%20para%20meu%20projeto.";

  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredProjects(portfolioProjects);
    } else {
      setFilteredProjects(
        portfolioProjects.filter((project) => project.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    const observedElements = observedElementsRef.current.filter(Boolean) as HTMLElement[];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observedElements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });

    return () => {
      observedElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [filteredProjects]);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el && !observedElementsRef.current.includes(el)) {
      observedElementsRef.current[index] = el;
    }
  };

  return (
    <>
      <SeoMeta 
        title="Portfólio de Projetos | Casa Branca Reformas e Design de Interiores"
        description="Conheça nosso portfólio de reformas residenciais e comerciais. Projetos de design de interiores para apartamentos, cozinhas, banheiros e espaços comerciais em São Paulo."
        keywords="portfólio de reformas, projetos de design de interiores, reforma apartamento, reforma comercial, reforma residencial"
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <div
            className="max-w-3xl mx-auto text-center space-y-4"
            ref={(el) => addToRefs(el, 0)}
          >
            <SectionHeading
              title="Portfólio de Projetos e Reformas"
              subtitle="Confira nossas transformações em residências e espaços comerciais em São Paulo e região"
              centered
            />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada projeto é único e desenvolvido para atender às necessidades específicas de nossos clientes,
              com o máximo de qualidade, funcionalidade e estética.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div
            className="flex flex-wrap gap-2 justify-center"
            ref={(el) => addToRefs(el, 1)}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
                aria-pressed={selectedCategory === category}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  enableModalView={true}
                  ref={(el) => addToRefs(el, 2 + index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Nenhum projeto encontrado nesta categoria.
              </p>
            </div>
          )}
          
          {/* Schema.org structured data for portfolio */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Portfólio de Projetos | Casa Branca Reformas",
              "description": "Conheça nosso portfólio de reformas residenciais e comerciais.",
              "provider": {
                "@type": "Organization",
                "name": "Casa Branca Reformas",
                "url": window.location.origin
              }
            })}
          </script>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <div
            className="text-center max-w-3xl mx-auto space-y-6"
            ref={(el) => addToRefs(el, portfolioProjects.length + 2)}
          >
            <h2 className="text-2xl font-medium md:text-3xl">
              Transforme seu espaço com a Casa Branca Reformas
            </h2>
            <p className="text-muted-foreground">
              Entre em contato para discutir seu projeto e receber um orçamento personalizado para transformar seu ambiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Solicitar Orçamento
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contato">
                  Fale Conosco
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Portfolio;
