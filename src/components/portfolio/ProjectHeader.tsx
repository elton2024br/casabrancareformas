
import { SectionHeading } from "@/components/ui/section-heading";

interface ProjectHeaderProps {
  title: string;
  category: string;
  description: string;
}

export function ProjectHeader({ title, category, description }: ProjectHeaderProps) {
  return (
    <div className="mb-12">
      <SectionHeading
        title={title}
        subtitle={`Categoria: ${category}`}
      />
      <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
        {description}
      </p>
      
      <div className="border-t border-b border-border py-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">LOCALIZAÇÃO</h3>
          <p className="mt-1">São José dos Campos, SP</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ÁREA</h3>
          <p className="mt-1">120 m²</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">CONCLUSÃO</h3>
          <p className="mt-1">Março de 2023</p>
        </div>
      </div>
    </div>
  );
}
