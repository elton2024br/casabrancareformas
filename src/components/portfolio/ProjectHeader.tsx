
import { SectionHeading } from "@/components/ui/section-heading";
import { CalendarIcon, MapPinIcon, RulerIcon } from "lucide-react";

interface ProjectHeaderProps {
  title: string;
  category: string;
  description: string;
  location?: string;
  area?: string;
  completionDate?: string;
  client?: string;
  budget?: string;
}

export function ProjectHeader({ 
  title, 
  category, 
  description, 
  location = "São José dos Campos, SP",
  area = "120 m²",
  completionDate = "Março de 2023",
  client,
  budget
}: ProjectHeaderProps) {
  return (
    <div className="mb-12">
      <SectionHeading
        title={title}
        subtitle={`Categoria: ${category}`}
      />
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        {description}
      </p>
      
      <div className="border-t border-b border-border py-6 mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="flex items-start">
          <MapPinIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">LOCALIZAÇÃO</h3>
            <p className="mt-1">{location}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <RulerIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">ÁREA</h3>
            <p className="mt-1">{area}</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <CalendarIcon className="h-5 w-5 text-primary mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">CONCLUSÃO</h3>
            <p className="mt-1">{completionDate}</p>
          </div>
        </div>
        
        {client && (
          <div className="flex items-start">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CLIENTE</h3>
              <p className="mt-1">{client}</p>
            </div>
          </div>
        )}
        
        {budget && (
          <div className="flex items-start">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">INVESTIMENTO</h3>
              <p className="mt-1">{budget}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
