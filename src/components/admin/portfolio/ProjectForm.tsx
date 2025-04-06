
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image, Video } from "lucide-react";
import { type Project } from "@/components/ui/project-card";
import { type ProjectFormProps } from "./formTypes";
import { ImageUploader } from "./ImageUploader";
import { FreepikTab } from "./FreepikTab";
import { VideoUploader } from "./VideoUploader";
import { Switch } from "@/components/ui/switch";

export function ProjectForm({ project, isAddMode, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(project);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isVideo, setIsVideo] = useState<boolean>(project.isVideo || false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, imageUrl }));
  };

  const handleVideoSelect = (videoUrl: string) => {
    setFormData((prev) => ({ ...prev, videoUrl }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Incluir o flag isVideo nos dados do projeto
    onSubmit({ ...formData, isVideo });
  };

  const clearPreviewImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const clearVideo = () => {
    setFormData((prev) => ({ ...prev, videoUrl: "" }));
  };

  const handleIsVideoChange = (checked: boolean) => {
    setIsVideo(checked);
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
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="isVideo" 
              checked={isVideo} 
              onCheckedChange={handleIsVideoChange} 
            />
            <Label htmlFor="isVideo">Este projeto possui vídeo</Label>
          </div>
          
          {isVideo ? (
            <div className="space-y-2">
              <Label>Vídeo do Projeto</Label>
              <VideoUploader 
                videoUrl={formData.videoUrl || null}
                onVideoSelect={handleVideoSelect}
                clearVideo={clearVideo}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
              />
            </div>
          ) : (
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
                  <ImageUploader 
                    imageUrl={formData.imageUrl}
                    onImageSelect={handleImageSelect}
                    clearImage={clearPreviewImage}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    activeTab={activeTab}
                  />
                </TabsContent>
                
                <TabsContent value="freepik" className="mt-4">
                  <FreepikTab 
                    category={formData.category}
                    imageUrl={formData.imageUrl}
                    onImageSelect={handleImageSelect}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
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
