
import { Card } from "@/components/ui/card";
import { Image } from "lucide-react";

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
          <Image className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
          <h3 className="font-medium">Adicionar Novo Projeto</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Clique para adicionar um novo projeto ao portfólio
          </p>
        </div>
      </div>
    </Card>
  );
}
