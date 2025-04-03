
import { SectionHeading } from "@/components/ui/section-heading";

export function PortfolioHero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4">
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
  );
}
