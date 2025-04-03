
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { searchFreepikImages, type FreepikImage } from "@/services/freepikService";
import { Loader2, Search, Image as ImageIcon } from "lucide-react";

interface FreepikImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
  buttonLabel?: string;
}

export function FreepikImageSelector({ onImageSelect, buttonLabel = "Selecionar Imagem Premium" }: FreepikImageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<FreepikImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 12;

  const searchImages = async (searchQuery: string, page: number = 0) => {
    if (!searchQuery) return;
    
    setIsLoading(true);
    try {
      const results = await searchFreepikImages(searchQuery, limit, page * limit);
      setImages(results);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchImages(query);
  };

  const handleImageSelect = (image: FreepikImage) => {
    onImageSelect(image.url);
    setIsOpen(false);
  };

  // Load default images on first open
  useEffect(() => {
    if (isOpen && images.length === 0 && !isLoading) {
      searchImages("interior design modern", 0);
    }
  }, [isOpen, images.length]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="flex gap-2">
          <ImageIcon className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Imagem Premium do Freepik</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex gap-2 my-4">
          <div className="flex-1">
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por design de interiores, casa moderna, etc..."
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Buscar
          </Button>
        </form>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="cursor-pointer rounded-md overflow-hidden border hover:border-primary transition-colors"
              onClick={() => handleImageSelect(image)}
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src={image.previewUrl || image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {image.premium && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs py-0.5 px-1.5 rounded-sm">
                    Premium
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-1">{image.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{image.contributor}</p>
              </div>
            </div>
          ))}
        </div>
        
        {isLoading && (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {!isLoading && images.length === 0 && (
          <div className="text-center my-12">
            <p className="text-muted-foreground">Nenhuma imagem encontrada. Tente outra busca.</p>
          </div>
        )}
        
        {!isLoading && images.length > 0 && (
          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => searchImages(query, Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => searchImages(query, currentPage + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
