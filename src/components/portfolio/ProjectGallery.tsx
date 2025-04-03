
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectGalleryProps {
  images: string[];
  title?: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images.length) return null;

  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Galeria de Imagens</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div 
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${title || 'Projeto'} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Maximize className="h-8 w-8 text-white" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
              <div className="relative">
                <img 
                  src={images[selectedImageIndex]} 
                  alt={`${title || 'Projeto'} - Imagem ${selectedImageIndex + 1} ampliada`}
                  className="w-full h-auto" 
                />
                {images.length > 1 && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={handleNext}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
