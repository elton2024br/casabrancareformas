
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";

interface ProjectMainImageProps {
  imageUrl: string;
  title: string;
  altText?: string;
  onImageSelect: (image: string) => void;
}

export function ProjectMainImage({ imageUrl, title, altText, onImageSelect }: ProjectMainImageProps) {
  return (
    <div className="mb-8 relative overflow-hidden rounded-lg">
      <img 
        src={imageUrl} 
        alt={altText || title} 
        className="w-full aspect-video object-cover"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon"
            className="absolute bottom-4 right-4"
            onClick={() => onImageSelect(imageUrl)}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
          <img 
            src={imageUrl} 
            alt="Imagem ampliada" 
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
