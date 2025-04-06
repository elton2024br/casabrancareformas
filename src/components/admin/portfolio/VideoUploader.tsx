
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Upload, Video, X } from "lucide-react";
import { type VideoUploaderProps } from "./formTypes";

export function VideoUploader({ 
  videoUrl, 
  onVideoSelect, 
  clearVideo, 
  isUploading, 
  setIsUploading 
}: VideoUploaderProps) {
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // Validar tamanho do vídeo (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Vídeo muito grande. Tamanho máximo: 50MB");
      return;
    }
    
    // Validar tipo de arquivo
    if (!file.type.startsWith("video/")) {
      toast.error("Formato inválido. Envie apenas arquivos de vídeo.");
      return;
    }
    
    // Preparar upload
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Gerar nome de arquivo único para evitar colisões
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `videos/${fileName}`;
      
      // Upload para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            // Atualizar progresso
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setProgress(percent);
          }
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter URL pública do vídeo
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);
      
      // Atualizar URL do vídeo
      onVideoSelect(publicUrl);
      toast.success("Vídeo enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar vídeo. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  }, [onVideoSelect, setIsUploading]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg', '.mov']
    },
    maxFiles: 1,
    disabled: isUploading
  });
  
  return (
    <div className="space-y-4">
      {videoUrl ? (
        <div className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-md overflow-hidden border border-border">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={clearVideo}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Vídeo selecionado. Você pode substituí-lo enviando outro vídeo ou removê-lo usando o botão acima.</p>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 
            transition-colors duration-200 ease-in-out cursor-pointer 
            flex flex-col items-center justify-center space-y-2
            ${isDragActive ? "border-primary/50 bg-primary/5" : ""}
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="text-center space-y-2">
              <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
              <p className="text-sm font-medium">Enviando vídeo... {progress}%</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          ) : (
            <>
              <Video className="h-10 w-10 text-muted-foreground" />
              
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">
                  {isDragActive ? "Solte o vídeo aqui" : "Clique para selecionar ou arraste um vídeo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  MP4, WebM, OGG ou MOV (máx. 50MB)
                </p>
              </div>
              
              <Button 
                variant="secondary" 
                className="mt-2"
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar vídeo
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
