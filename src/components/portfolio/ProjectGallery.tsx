import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Maximize, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { isInstagramVideoUrl } from "@/lib/utils";
import { InstagramEmbed } from "@/components/ui/instagram-embed";

interface GalleryItem {
  url: string;
  isVideo: boolean;
}

interface ProjectGalleryProps {
  items: GalleryItem[];
  title?: string;
}

export function ProjectGallery({ items, title }: ProjectGalleryProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItemIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItemIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  if (!items.length) return null;

  return (
    <>
      <h2 className="text-2xl font-medium mb-6">Galeria do Projeto</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {items.map((item, index) => {
          const isInstagramVideo = item.isVideo && isInstagramVideoUrl(item.url);
          
          return (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div 
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedItemIndex(index)}
                >
                  {item.isVideo ? (
                    isInstagramVideo ? (
                      <div className="relative h-full w-full bg-muted flex items-center justify-center">
                        <div className="absolute inset-0 opacity-30">
                          <InstagramEmbed 
                            url={item.url} 
                            className="w-full h-full"
                            aspectRatio="square"
                          />
                        </div>
                        <div className="absolute z-10 bg-primary/80 rounded-full p-3">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full w-full">
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-primary/80 rounded-full p-3">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <img 
                      src={item.url} 
                      alt={`${title || 'Projeto'} - Item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    {item.isVideo ? (
                      <Play className="h-8 w-8 text-white" />
                    ) : (
                      <Maximize className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
                <div className="relative">
                  {items[selectedItemIndex].isVideo ? (
                    isInstagramVideoUrl(items[selectedItemIndex].url) ? (
                      <InstagramEmbed 
                        url={items[selectedItemIndex].url}
                        className="w-full"
                        aspectRatio="auto"
                        showCaption={true}
                      />
                    ) : (
                      <video 
                        src={items[selectedItemIndex].url}
                        controls
                        autoPlay
                        className="w-full h-auto"
                      />
                    )
                  ) : (
                    <img 
                      src={items[selectedItemIndex].url} 
                      alt={`${title || 'Projeto'} - Item ${selectedItemIndex + 1} ampliada`}
                      className="w-full h-auto" 
                    />
                  )}
                  {items.length > 1 && (
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
                        {selectedItemIndex + 1} / {items.length}
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </>
  );
}
