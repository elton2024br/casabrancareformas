
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function HeroSection({ addToRefs }: HeroSectionProps) {
  const isMobile = useIsMobile();
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";
  const instagramUrl = "https://www.instagram.com/casabranca_reformas/";

  // Em um app real, esses dados viriam do backend
  // Aqui estamos apenas simulando para demonstrar a funcionalidade
  const heroContent = {
    title: "Transformamos espaços em <span class='text-primary'>experiências</span>",
    subtitle: "Design minimalista e execução impecável para sua reforma dos sonhos",
    backgroundImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
    useVideo: false,
    videoUrl: ""
  };

  return (
    <section className="relative flex min-h-[80vh] sm:min-h-[90vh] items-center justify-center overflow-hidden bg-black">
      {heroContent.useVideo && heroContent.videoUrl ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            <iframe 
              src={heroContent.videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')} 
              title="Background Video"
              className="absolute w-full h-full top-0 left-0 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">
          <img
            src={heroContent.backgroundImage}
            alt="Interior Moderno"
            className="h-full w-full object-cover opacity-60"
          />
        </div>
      )}
      <div className="relative container px-4 md:px-6 z-10 mx-auto text-center">
        <div
          ref={(el) => addToRefs(el, 0)}
          className="max-w-3xl mx-auto space-y-3 sm:space-y-6"
        >
          <h1 
            className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white"
            dangerouslySetInnerHTML={{ __html: heroContent.title }}
          />
          <p className="text-base sm:text-xl md:text-2xl text-white/80">
            {heroContent.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Button asChild size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                Ver Projetos
              </a>
            </Button>
            <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 mt-3 sm:mt-0">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
