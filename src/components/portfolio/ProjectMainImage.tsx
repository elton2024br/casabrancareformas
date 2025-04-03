
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectMainImageProps {
  imageUrl: string;
  title: string;
  altText?: string;
  onImageSelect: (image: string) => void;
  galleryImages?: string[];
}

export function ProjectMainImage({ 
  imageUrl, 
  title, 
  altText, 
  onImageSelect, 
  galleryImages = [] 
}: ProjectMainImageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [imageUrl, ...(galleryImages || [])];

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-8 relative overflow-hidden rounded-lg group">
      <img 
        src={allImages[currentImageIndex]} 
        alt={altText || title} 
        className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      {allImages.length > 1 && (
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button 
            variant="secondary" 
            size="icon"
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePrevious}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {allImages.length > 1 && (
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button 
            variant="secondary" 
            size="icon"
            className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleNext}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon"
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageSelect(allImages[currentImageIndex])}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
          <div className="relative">
            <img 
              src={allImages[currentImageIndex]} 
              alt="Imagem ampliada" 
              className="w-full h-auto"
            />
            {allImages.length > 1 && (
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
