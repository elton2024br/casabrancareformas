
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PortfolioCTAProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
  refIndex: number;
}

export function PortfolioCTA({ addToRefs, refIndex }: PortfolioCTAProps) {
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento%20para%20meu%20projeto.";
  
  return (
    <section className="py-16 bg-secondary">
      <div className="container px-4 md:px-6 mx-auto">
        <div
          className="text-center max-w-3xl mx-auto space-y-6"
          ref={(el) => addToRefs(el, refIndex)}
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
  );
}
