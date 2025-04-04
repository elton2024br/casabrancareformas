
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Project } from "@/components/ui/project-card";

// Mock data for portfolio projects
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
  },
  {
    id: "2",
    title: "Cozinha Escandinava",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade e elegância.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
  },
  {
    id: "3",
    title: "Escritório Corporativo",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade e bem-estar.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
  },
];

const AdminPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [isAddMode, setIsAddMode] = useState(false);

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditing(project.id);
    setIsAddMode(false);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast.success("Projeto removido com sucesso!");
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      title: "",
      description: "",
      imageUrl: "",
      category: "",
    });
    setIsAddMode(true);
    setEditing(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAddMode) {
      setProjects([...projects, formData]);
      toast.success("Projeto adicionado com sucesso!");
    } else if (editing) {
      setProjects(
        projects.map((project) =>
          project.id === editing ? formData : project
        )
      );
      toast.success("Projeto atualizado com sucesso!");
    }
    
    setEditing(null);
    setIsAddMode(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsAddMode(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Portfólio</h1>
          <p className="text-muted-foreground">
            Adicione, edite ou remova projetos do portfólio
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
        </Button>
      </div>

      {(editing || isAddMode) && (
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
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isAddMode ? "Adicionar" : "Atualizar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive border-destructive/50 hover:border-destructive"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Add New Project Card */}
        {!isAddMode && !editing && (
          <Card
            className="overflow-hidden border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleAddNew}
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
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;
