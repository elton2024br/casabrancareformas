
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Galeria de Imagens</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group">
                <img 
                  src={image} 
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize className="h-8 w-8 text-white" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
              <img 
                src={image} 
                alt={`Imagem ${index + 1} ampliada`}
                className="w-full h-auto" 
              />
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
