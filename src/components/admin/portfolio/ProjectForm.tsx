
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FreepikImageSelector } from "@/components/admin/FreepikImageSelector";
import { type Project } from "@/components/ui/project-card";

interface ProjectFormProps {
  project: Project;
  isAddMode: boolean;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, isAddMode, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="border-primary/50 shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Projeto</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Residência Moderna"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Apartamento, Cozinha, Comercial"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição detalhada do projeto..."
              rows={3}
              required
            />
          </div>
          
          <FreepikImageSelector
            onSelectImage={handleImageSelect}
            initialQuery={formData.category}
            selectedImage={formData.imageUrl}
          />
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isAddMode ? "Adicionar" : "Atualizar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
