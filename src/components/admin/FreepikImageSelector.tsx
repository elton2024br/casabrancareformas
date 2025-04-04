
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Image, Loader2, RefreshCw } from "lucide-react";
import { searchFreepikImages, type FreepikImage } from "@/services/freepikService";
import { toast } from "sonner";

interface FreepikImageSelectorProps {
  onSelectImage: (imageUrl: string) => void;
  initialQuery?: string;
  selectedImage?: string;
}

export function FreepikImageSelector({ 
  onSelectImage, 
  initialQuery = "", 
  selectedImage = "" 
}: FreepikImageSelectorProps) {
  const [query, setQuery] = useState(initialQuery);
  const [images, setImages] = useState<FreepikImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.warning("Por favor, digite um termo de busca");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchFreepikImages(query, 1, 20);
      
      if (response.data.length === 0) {
        setError("Nenhuma imagem encontrada. Tente outro termo de busca.");
        toast.warning("Nenhuma imagem encontrada");
      } else {
        setImages(response.data);
        toast.success(`${response.data.length} imagens encontradas!`);
      }
    } catch (error) {
      console.error('Error searching images:', error);
      setError("Erro ao buscar imagens. Por favor, tente novamente.");
      toast.error("Erro ao buscar imagens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = (image: FreepikImage) => {
    onSelectImage(image.preview.url);
    toast.success("Imagem selecionada com sucesso!");
    setDialogOpen(false);
  };

  useEffect(() => {
    if (dialogOpen && query.trim()) {
      handleSearch();
    }
  }, [dialogOpen]);

  // Suggested search terms
  const suggestedTerms = [
    "sala moderna",
    "cozinha luxo",
    "banheiro mármore",
    "escritório design",
    "apartamento contemporâneo",
    "interior minimalista"
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="imageUrl">Imagem do Projeto</Label>
        <div className="flex gap-2">
          <Input
            id="imageUrl"
            value={selectedImage}
            placeholder="URL da imagem do projeto"
            readOnly
            className="flex-grow"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDialogOpen(true)}
          >
            <Image className="h-4 w-4 mr-2" />
            Selecionar
          </Button>
        </div>
        {selectedImage && (
          <div className="mt-2 rounded-md overflow-hidden border">
            <img 
              src={selectedImage} 
              alt="Preview da imagem selecionada" 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagem+não+encontrada";
                toast.error("Erro ao carregar imagem");
              }}
            />
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Escolher Imagem do Freepik</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Buscar imagens (ex: sala moderna, cozinha luxo)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Suggested search terms */}
            <div className="flex flex-wrap gap-2">
              {suggestedTerms.map((term) => (
                <Button 
                  key={term} 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setQuery(term);
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  onClick={handleSearch}
                  disabled={!query.trim()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-2">
                {images.length > 0 ? (
                  images.map((image) => (
                    <div 
                      key={image.id} 
                      className="relative aspect-square rounded-md overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleSelectImage(image)}
                    >
                      <img 
                        src={image.preview.url} 
                        alt={image.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x300?text=Erro+ao+carregar";
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    {query ? "Nenhuma imagem encontrada. Tente outra busca." : "Digite sua busca e clique em pesquisar."}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
