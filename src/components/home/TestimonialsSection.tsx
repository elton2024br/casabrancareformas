
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard, type Testimonial } from "@/components/ui/testimonial-card";

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

interface TestimonialsSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function TestimonialsSection({ addToRefs }: TestimonialsSectionProps) {
  return (
    <section className="py-16 sm:py-20 bg-secondary">
      <div className="container px-4 md:px-6 mx-auto">
        <div ref={(el) => addToRefs(el, 12)}>
          <SectionHeading
            title="O que Dizem Nossos Clientes"
            subtitle="A satisfação dos nossos clientes é o nosso maior orgulho"
            centered
            className="max-w-2xl mx-auto"
          />
        </div>
        
        <div className="grid gap-6 sm:gap-8 mt-12 sm:mt-16 md:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} ref={(el) => addToRefs(el, 13 + index)}>
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 text-center" ref={(el) => addToRefs(el, 15)}>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/depoimentos">
              Ver Todos os Depoimentos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
