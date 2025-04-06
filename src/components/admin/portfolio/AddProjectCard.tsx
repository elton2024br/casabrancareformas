
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AddProjectCardProps {
  onClick: () => void;
}

export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <Card
      className="overflow-hidden border-dashed cursor-pointer hover:border-primary/50 transition-colors"
      onClick={onClick}
    >
      <div className="aspect-video flex items-center justify-center bg-muted/50">
        <div className="text-center p-6">
          <div className="mx-auto mb-3 bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium">Adicionar Novo Projeto</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Clique para adicionar um novo projeto ao portfólio
          </p>
        </div>
      </div>
    </Card>
  );
}
