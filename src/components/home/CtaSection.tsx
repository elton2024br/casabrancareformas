
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

interface CtaSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function CtaSection({ addToRefs }: CtaSectionProps) {
  const isMobile = useIsMobile();
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";
  
  return (
    <section className="py-12 md:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl bg-primary px-4 sm:px-6 py-10 sm:py-16 text-center text-primary-foreground md:px-16 md:py-24"
          ref={(el) => addToRefs(el, 16)}
        >
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-xl sm:text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
              Transforme seu espaço com a Casa Branca
            </h2>
            <p className="mt-3 sm:mt-6 text-sm sm:text-lg leading-relaxed text-primary-foreground/90">
              Entre em contato para um orçamento personalizado e dê o primeiro passo para a reforma dos seus sonhos.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
              <Button asChild size={isMobile ? "default" : "lg"} variant="secondary" className="w-full sm:w-auto">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Solicitar Orçamento
                </a>
              </Button>
              <Button asChild size={isMobile ? "default" : "lg"} variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 mt-3 sm:mt-0">
                <Link to="/portfolio">Ver Projetos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
