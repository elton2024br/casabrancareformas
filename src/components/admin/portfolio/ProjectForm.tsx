
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FreepikImageSelector } from "@/components/admin/FreepikImageSelector";
import { type Project } from "@/components/ui/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFormProps {
  project: Project;
  isAddMode: boolean;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, isAddMode, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("freepik");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar o tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    // Verificar o tamanho do arquivo (limite de 5MB)
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 5) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Criar nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (data) {
        setFormData((prev) => ({ ...prev, imageUrl: data.publicUrl }));
        toast.success("Imagem enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
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
          
          <div className="space-y-2">
            <Label>Imagem do Projeto</Label>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload size={16} /> Upload Local
                </TabsTrigger>
                <TabsTrigger value="freepik" className="flex items-center gap-2">
                  <Image size={16} /> Freepik
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center">
                    <Input
                      type="file"
                      id="imageUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                    <Label 
                      htmlFor="imageUpload" 
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-10 w-10 text-primary/60" />
                      <span className="font-medium">
                        {isUploading ? "Enviando..." : "Clique para escolher uma imagem"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Ou arraste e solte aqui (JPEG, PNG, WebP, máx 5MB)
                      </span>
                    </Label>
                  </div>
                  
                  {formData.imageUrl && activeTab === "upload" && (
                    <div className="mt-4 rounded-md overflow-hidden border">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview da imagem selecionada" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagem+não+encontrada";
                        }}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="freepik" className="mt-4">
                <FreepikImageSelector
                  onSelectImage={handleImageSelect}
                  initialQuery={formData.category}
                  selectedImage={formData.imageUrl}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isAddMode ? "Adicionar" : "Atualizar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
