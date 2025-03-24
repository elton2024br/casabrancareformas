
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

interface AboutSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function AboutSection({ addToRefs }: AboutSectionProps) {
  return (
    <section className="py-16 md:py-32">
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
              <Button asChild className="w-full sm:w-auto">
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
            <div className="absolute -bottom-6 -right-6 aspect-square w-28 sm:w-48 rounded-lg border-8 border-background bg-primary p-4 text-primary-foreground md:-bottom-8 md:-right-8 md:w-60">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-4xl font-bold md:text-5xl">10+</span>
                <span className="text-xs sm:text-sm font-medium md:text-base">
                  Anos de Experiência
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
