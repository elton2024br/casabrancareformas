
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { type Project } from "@/components/ui/project-card";
import { ProjectForm } from "@/components/admin/portfolio/ProjectForm";
import { ProjectCard } from "@/components/admin/portfolio/ProjectCard";
import { AddProjectCard } from "@/components/admin/portfolio/AddProjectCard";

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

  const handleSubmit = (updatedProject: Project) => {
    if (isAddMode) {
      setProjects([...projects, updatedProject]);
      toast.success("Projeto adicionado com sucesso!");
    } else if (editing) {
      setProjects(
        projects.map((project) =>
          project.id === editing ? updatedProject : project
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
        <ProjectForm
          project={formData}
          isAddMode={isAddMode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id}
            project={project}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {/* Add New Project Card */}
        {!isAddMode && !editing && (
          <AddProjectCard onClick={handleAddNew} />
        )}
      </div>
    </div>
  );
};

export default AdminPortfolio;
