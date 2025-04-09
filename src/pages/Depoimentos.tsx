import { useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard, type Testimonial } from "@/components/ui/testimonial-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for testimonials
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ana Oliveira",
    role: "Proprietária",
    content: "A Casa Branca transformou completamente meu apartamento. O processo foi transparente e o resultado superou minhas expectativas. Recomendo sem hesitar!",
    rating: 5,
  },
  {
    id: "2",
    name: "Carlos Silva",
    company: "Empresa XYZ",
    content: "Contratamos a Casa Branca para a reforma do nosso escritório e ficamos impressionados com a atenção aos detalhes e a qualidade do trabalho entregue dentro do prazo.",
    rating: 5,
  },
  {
    id: "3",
    name: "Fernanda Santos",
    role: "Designer de Interiores",
    content: "Como profissional da área, fico sempre atenta à qualidade das reformas. A Casa Branca executa com primor, respeita o projeto e sugere melhorias que fazem toda a diferença.",
    rating: 5,
  },
  {
    id: "4",
    name: "Roberto Almeida",
    role: "Proprietário",
    content: "Minha cozinha ficou exatamente como eu imaginava. Equipe profissional, pontual e que resolveu todos os imprevistos com muita habilidade.",
    rating: 4,
  },
  {
    id: "5",
    name: "Juliana Costa",
    company: "Restaurante Sabores",
    content: "A reforma do nosso restaurante foi concluída antes do prazo previsto e a qualidade do trabalho permitiu que abríssemos as portas mais cedo. Excelente atendimento!",
    rating: 5,
  },
  {
    id: "6",
    name: "Marcelo Ribeiro",
    role: "Médico",
    content: "Reforma do meu consultório executada com perfeição. A equipe foi extremamente cuidadosa com as especificidades do ambiente médico. Muito satisfeito!",
    rating: 5,
  },
];

const Depoimentos = () => {
  const observedElementsRef = useRef<(HTMLElement | null)[]>([]);
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";

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
  }, []);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el && !observedElementsRef.current.includes(el)) {
      observedElementsRef.current[index] = el;
    }
  };

  return (
    <>
      <SeoMeta 
        title="Depoimentos de Clientes | Casa Branca Reformas"
        description="Conheça o que nossos clientes têm a dizer sobre nossas reformas residenciais e comerciais. Histórias reais de transformação e satisfação."
        keywords="depoimentos casa branca, avaliações de reforma, testemunhos clientes, feedback reformas"
      />
      
      <MainLayout>
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary">
          <div className="container px-4 md:px-6 mx-auto">
            <div
              className="max-w-3xl mx-auto text-center space-y-4"
              ref={(el) => addToRefs(el, 0)}
            >
              <SectionHeading
                title="Depoimentos"
                subtitle="Veja o que nossos clientes dizem sobre os nossos serviços"
                centered
              />
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  ref={(el) => addToRefs(el, 1 + index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary">
          <div className="container px-4 md:px-6 mx-auto">
            <div
              className="max-w-3xl mx-auto text-center space-y-6"
              ref={(el) => addToRefs(el, testimonials.length + 1)}
            >
              <h2 className="text-2xl font-medium md:text-3xl">
                Pronto para transformar seu espaço?
              </h2>
              <p className="text-muted-foreground">
                Entre em contato conosco para discutir seu projeto e fazer parte da nossa lista de clientes satisfeitos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Button asChild size="lg">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Solicitar Orçamento
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/portfolio">Ver Projetos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
};

export default Depoimentos;
