
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { InstagramEmbed } from "@/components/ui/instagram-embed";
import { isInstagramVideoUrl } from "@/lib/utils";
import { Play } from "lucide-react";

interface ProjectMediaViewerProps {
  project: {
    title: string;
    imageUrl: string;
    videoUrl?: string;
    isVideo?: boolean;
    altText?: string;
  };
}

export const ProjectMediaViewer = ({ project }: ProjectMediaViewerProps) => {
  const isMainContentVideo = project.isVideo && project.videoUrl;
  const isInstagramVideo = isMainContentVideo && isInstagramVideoUrl(project.videoUrl!);

  if (isMainContentVideo) {
    return (
      <div className="mb-8">
        {isInstagramVideo ? (
          <InstagramEmbed 
            url={project.videoUrl!} 
            className="w-full max-w-3xl mx-auto" 
            aspectRatio="auto"
            showCaption={true}
          />
        ) : (
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <video 
              src={project.videoUrl} 
              controls 
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mb-8 aspect-video relative rounded-lg overflow-hidden cursor-pointer group">
          <img 
            src={project.imageUrl}
            alt={project.altText || project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <div className="bg-primary/80 rounded-full p-4">
              <Play className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl p-1 bg-transparent border-none">
        <img 
          src={project.imageUrl}
          alt={project.altText || project.title}
          className="w-full h-auto"
        />
      </DialogContent>
    </Dialog>
  );
};
