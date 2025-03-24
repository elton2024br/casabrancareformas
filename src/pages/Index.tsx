
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Clock, Tool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard, type Project } from "@/components/ui/project-card";
import { TestimonialCard, type Testimonial } from "@/components/ui/testimonial-card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Mock data for featured projects
const featuredProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
    featured: true,
  },
  {
    id: "2",
    title: "Cozinha Escandinava",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade e elegância.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
  },
  {
    id: "3",
    title: "Escritório Corporativo",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade e bem-estar.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
  },
];

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
];

// Services data
const services = [
  {
    icon: <Tool className="h-10 w-10 text-primary" />,
    title: "Reformas Completas",
    description: "Transformamos completamente seu espaço com projetos personalizados e execução impecável.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Pontualidade",
    description: "Comprometimento com prazos definidos, respeitando seu tempo e planejamento.",
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Qualidade Premium",
    description: "Materiais selecionados e mão de obra especializada para resultados excepcionais.",
  },
];

const Index = () => {
  const observedElementsRef = useRef<(HTMLElement | null)[]>([]);

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
      <Header />
      
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop"
            alt="Interior Moderno"
            className="h-full w-full object-cover opacity-60"
          />
        </div>
        <div className="relative container px-4 md:px-6 z-10 mx-auto text-center">
          <div
            ref={(el) => addToRefs(el, 0)}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="font-serif text-4xl font-medium tracking-tight text-white md:text-5xl lg:text-6xl">
              Transformamos espaços em <span className="text-primary">experiências</span>
            </h1>
            <p className="text-xl text-white/80 md:text-2xl">
              Design minimalista e execução impecável para sua reforma dos sonhos
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link to="/portfolio">Ver Projetos</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                <Link to="/contato">Solicitar Orçamento</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div
              ref={(el) => addToRefs(el, 1)}
              className="space-y-6"
            >
              <SectionHeading
                title="Sobre a Casa Branca Reformas"
                subtitle="Nossa missão é criar espaços funcionais e esteticamente agradáveis que reflitam a personalidade e as necessidades de nossos clientes."
              />
              <p className="text-muted-foreground">
                Com mais de 10 anos de experiência no mercado, a Casa Branca se estabeleceu como referência em reformas residenciais e comerciais. Nossa equipe é formada por profissionais qualificados e apaixonados por transformar ambientes.
              </p>
              <p className="text-muted-foreground">
                Cada projeto é tratado com exclusividade, desde a concepção até a execução, sempre com foco na qualidade, inovação e satisfação do cliente.
              </p>
              <div className="pt-2">
                <Button asChild>
                  <Link to="/contato">
                    Fale Conosco <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div
              ref={(el) => addToRefs(el, 2)}
              className="relative lg:order-first"
            >
              <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1593696140826-c58b021acf8b?q=80&w=1170&auto=format&fit=crop"
                  alt="Nossa Equipe"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 aspect-square w-48 rounded-lg border-8 border-background bg-primary p-4 text-primary-foreground md:-bottom-8 md:-right-8 md:w-60">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold md:text-5xl">10+</span>
                  <span className="text-sm font-medium md:text-base">
                    Anos de Experiência
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <SectionHeading
            title="Nossos Serviços"
            subtitle="Oferecemos soluções completas para transformar seu espaço"
            centered
            className="max-w-2xl mx-auto"
            ref={(el) => addToRefs(el, 3)}
          />
          <div className="grid gap-8 mt-16 md:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={service.title}
                ref={(el) => addToRefs(el, 4 + index)}
                className="flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-sm"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <SectionHeading
              title="Projetos em Destaque"
              subtitle="Conheça algumas de nossas transformações mais recentes"
              ref={(el) => addToRefs(el, 7)}
            />
            <Button asChild variant="outline" className="mt-4 md:mt-0" ref={(el) => addToRefs(el, 8)}>
              <Link to="/portfolio">
                Ver Todos os Projetos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured={index === 0}
                className={index === 0 ? "md:col-span-2" : ""}
                ref={(el) => addToRefs(el, 9 + index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <SectionHeading
            title="O que Dizem Nossos Clientes"
            subtitle="A satisfação dos nossos clientes é o nosso maior orgulho"
            centered
            className="max-w-2xl mx-auto"
            ref={(el) => addToRefs(el, 12)}
          />
          
          <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                ref={(el) => addToRefs(el, 13 + index)}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center" ref={(el) => addToRefs(el, 15)}>
            <Button asChild variant="outline">
              <Link to="/depoimentos">
                Ver Todos os Depoimentos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-16 md:py-24"
            ref={(el) => addToRefs(el, 16)}
          >
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
                Transforme seu espaço com a Casa Branca
              </h2>
              <p className="mt-6 text-lg leading-8 text-primary-foreground/90">
                Entre em contato para um orçamento personalizado e dê o primeiro passo para a reforma dos seus sonhos.
              </p>
              <div className="mt-10 flex justify-center gap-6">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/contato">Solicitar Orçamento</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/portfolio">Ver Projetos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
