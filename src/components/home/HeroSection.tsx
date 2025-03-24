
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phone } from "lucide-react";

interface HeroSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function HeroSection({ addToRefs }: HeroSectionProps) {
  const isMobile = useIsMobile();
  const whatsappNumber = "5512997767048";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Olá! Gostaria de solicitar um orçamento.`;

  return (
    <section className="relative flex min-h-[80vh] sm:min-h-[90vh] items-center justify-center overflow-hidden bg-black">
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
          className="max-w-3xl mx-auto space-y-3 sm:space-y-6"
        >
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white">
            Transformamos espaços em <span className="text-primary">experiências</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white/80">
            Design minimalista e execução impecável para sua reforma dos sonhos
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Button asChild size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              <Link to="/portfolio">Ver Projetos</Link>
            </Button>
            <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 mt-3 sm:mt-0 flex items-center gap-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Phone size={isMobile ? 16 : 18} />
                <span>12 99776-7048</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
