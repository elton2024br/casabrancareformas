
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type ImageUploaderProps } from "./formTypes";

export function ImageUploader({ 
  imageUrl, 
  onImageSelect, 
  clearImage, 
  isUploading, 
  setIsUploading,
  activeTab
}: ImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(imageUrl);

  const handleFileUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsUploading(true);

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

      // Criar nome de arquivo único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `project-images/${fileName}`;

      // Criar um preview local da imagem
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Upload para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (publicUrlData) {
        onImageSelect(publicUrlData.publicUrl);
        toast.success("Imagem enviada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Falha ao enviar a imagem. Tente novamente.");
      // Resetar a preview em caso de erro
      if (imageUrl) {
        setPreviewImage(imageUrl);
      } else {
        setPreviewImage(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Configuração do react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed ${isDragActive ? 'border-primary' : 'border-primary/30'} rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-all`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="font-medium">Enviando...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-primary/60" />
            <span className="font-medium">
              {isDragActive 
                ? "Solte a imagem aqui" 
                : "Clique ou arraste uma imagem para este espaço"
              }
            </span>
            <span className="text-xs text-muted-foreground">
              JPEG, PNG, WebP (máx. 5MB)
            </span>
          </div>
        )}
      </div>
      
      {previewImage && activeTab === "upload" && (
        <div className="mt-4 relative">
          <div className="rounded-md overflow-hidden border">
            <img 
              src={previewImage} 
              alt="Preview da imagem selecionada" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagem+não+encontrada";
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
