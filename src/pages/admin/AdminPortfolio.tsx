
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { type Project } from "@/components/ui/project-card";
import { ProjectForm } from "@/components/admin/portfolio/ProjectForm";
import { ProjectCard } from "@/components/admin/portfolio/ProjectCard";
import { AddProjectCard } from "@/components/admin/portfolio/AddProjectCard";
import { supabase } from "@/integrations/supabase/client";

// Mock data para projetos iniciais caso o banco de dados estiver vazio
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Residência Moderna",
    description: "Reforma completa de apartamento de 120m² com conceito aberto e design minimalista.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
    category: "Apartamento",
    isVideo: false,
    videoUrl: "",
  },
  {
    id: "2",
    title: "Cozinha Escandinava",
    description: "Reforma de cozinha com inspiração escandinava, priorizando funcionalidade e elegância.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1170&auto=format&fit=crop",
    category: "Cozinha",
    isVideo: false,
    videoUrl: "",
  },
  {
    id: "3",
    title: "Escritório Corporativo",
    description: "Projeto de reforma para escritório corporativo com foco em produtividade e bem-estar.",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1169&auto=format&fit=crop",
    category: "Comercial",
    isVideo: false,
    videoUrl: "",
  },
];

const AdminPortfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    isVideo: false,
    videoUrl: "",
  });
  const [isAddMode, setIsAddMode] = useState(false);

  // Carrega os projetos do Supabase ou usa dados mock se ainda não existirem
  useEffect(() => {
    const loadProjectsFromStorage = async () => {
      try {
        // Verificar se há projetos salvos no armazenamento local
        const storedProjects = localStorage.getItem('portfolioProjects');
        
        if (storedProjects) {
          setProjects(JSON.parse(storedProjects));
        } else {
          // Se não houver no armazenamento local, usar os projetos iniciais
          setProjects(initialProjects);
          // Salvar no armazenamento local para futuras sessões
          localStorage.setItem('portfolioProjects', JSON.stringify(initialProjects));
        }
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        toast.error("Erro ao carregar projetos");
        setProjects(initialProjects);
      } finally {
        setLoading(false);
      }
    };

    loadProjectsFromStorage();
  }, []);

  const handleEdit = (project: Project) => {
    console.log("Editando projeto:", project);
    // Garantir que o projeto editado tenha todas as propriedades necessárias
    setFormData({
      ...project,
      isVideo: project.isVideo || false,
      videoUrl: project.videoUrl || ""
    });
    setEditing(project.id);
    setIsAddMode(false);
  };

  const handleDelete = (id: string) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    // Atualizar o armazenamento local
    localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
    toast.success("Projeto removido com sucesso!");
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(), // Usar timestamp como ID temporário
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      isVideo: false,
      videoUrl: ""
    });
    setIsAddMode(true);
    setEditing(null);
  };

  const handleSubmit = (updatedProject: Project) => {
    console.log("Projeto a ser salvo:", updatedProject);
    
    try {
      let updatedProjects: Project[];
      
      if (isAddMode) {
        // Adicionar novo projeto
        updatedProjects = [...projects, updatedProject];
        toast.success("Projeto adicionado com sucesso!");
      } else if (editing) {
        // Atualizar projeto existente
        updatedProjects = projects.map((project) =>
          project.id === editing ? updatedProject : project
        );
        toast.success("Projeto atualizado com sucesso!");
      } else {
        // Caso improvável, mas para evitar erros
        updatedProjects = [...projects];
      }
      
      // Atualizar estado e armazenamento local
      setProjects(updatedProjects);
      localStorage.setItem('portfolioProjects', JSON.stringify(updatedProjects));
      
      // Limpar o modo de edição
      setEditing(null);
      setIsAddMode(false);
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast.error("Erro ao salvar o projeto");
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setIsAddMode(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando projetos...</div>;
  }

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
