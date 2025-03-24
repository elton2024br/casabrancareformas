
import { Wrench, Clock, Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

interface ServiceItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ServiceItem({ icon, title, description }: ServiceItemProps) {
  return (
    <div className="flex flex-col items-center text-center bg-white p-6 sm:p-8 rounded-lg shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface ServicesSectionProps {
  addToRefs: (el: HTMLElement | null, index: number) => void;
}

export function ServicesSection({ addToRefs }: ServicesSectionProps) {
  const services = [
    {
      icon: <Wrench className="h-10 w-10 text-primary" />,
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

  return (
    <section className="py-16 sm:py-20 bg-secondary">
      <div className="container px-4 md:px-6 mx-auto">
        <div ref={(el) => addToRefs(el, 3)}>
          <SectionHeading
            title="Nossos Serviços"
            subtitle="Oferecemos soluções completas para transformar seu espaço"
            centered
            className="max-w-2xl mx-auto"
          />
        </div>
        <div className="grid gap-6 sm:gap-8 mt-12 sm:mt-16 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              ref={(el) => addToRefs(el, 4 + index)}
            >
              <ServiceItem
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
